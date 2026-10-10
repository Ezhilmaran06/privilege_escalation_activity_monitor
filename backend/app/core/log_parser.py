import io
import csv
import json
from typing import List, Dict, Any, Tuple, Optional
from datetime import datetime, timezone
import pandas as pd

from app.schemas import CanonicalEvent, ProcessingStats
from app.config import settings
from app.core.utils import parse_timestamp, format_iso_timestamp, generate_id, calculate_success_rate

ALIAS_MAP = {
    "actor": ["actor", "username", "user", "initiated_by", "principal", "account_name", "src_user"],
    "timestamp": ["timestamp", "event_time", "datetime", "time", "date", "@timestamp"],
    "action": ["action", "operation", "event_type", "activity", "event_name", "command"],
    "target_user": ["target_user", "target", "affected_user", "member", "dst_user", "target_account", "recipient"],
    "source_ip": ["source_ip", "ip", "ip_address", "client_ip", "src_ip", "caller_ip"],
    "previous_role": ["previous_role", "old_role", "from_role", "prev_role", "current_role"],
    "new_role": ["new_role", "assigned_role", "to_role", "target_role", "granted_role"],
    "status": ["status", "result", "outcome", "event_outcome", "success"],
    "resource": ["resource", "target_resource", "object", "group", "group_name", "entity"]
}

def resolve_field(record: Dict[str, Any], canonical_key: str) -> Optional[Any]:
    """Resolve a canonical field from record using case-insensitive key and alias matching."""
    # Build lower-key map
    normalized_keys = {str(k).lower().strip().replace(" ", "_").replace("-", "_"): k for k in record.keys()}
    aliases = ALIAS_MAP.get(canonical_key, [canonical_key])
    
    for alias in aliases:
        norm_alias = alias.lower().replace(" ", "_").replace("-", "_")
        if norm_alias in normalized_keys:
            orig_key = normalized_keys[norm_alias]
            val = record[orig_key]
            if val is not None and str(val).strip() != "" and str(val).strip().lower() != "nan":
                return val
    return None

def parse_csv_content(content_bytes: bytes) -> List[Dict[str, Any]]:
    """Parse CSV bytes safely, handling encodings and delimiters."""
    try:
        text = content_bytes.decode("utf-8")
    except UnicodeDecodeError:
        text = content_bytes.decode("latin-1", errors="replace")
        
    text_io = io.StringIO(text.strip())
    # Try sniff delimiter
    sample = text[:2048]
    delimiter = ","
    try:
        sniffer = csv.Sniffer()
        dialect = sniffer.sniff(sample)
        delimiter = dialect.delimiter
    except Exception:
        delimiter = ","

    reader = csv.DictReader(text_io, delimiter=delimiter)
    records = []
    for row in reader:
        if any(v.strip() for v in row.values() if v is not None):
            records.append({k.strip(): v.strip() if isinstance(v, str) else v for k, v in row.items() if k})
    return records

def parse_json_content(content_bytes: bytes) -> List[Dict[str, Any]]:
    """Parse JSON bytes, supporting list of objects or object with 'events'/'records' key."""
    try:
        text = content_bytes.decode("utf-8")
    except UnicodeDecodeError:
        text = content_bytes.decode("latin-1", errors="replace")
        
    data = json.loads(text)
    if isinstance(data, list):
        return [item for item in data if isinstance(item, dict)]
    elif isinstance(data, dict):
        for key in ["events", "records", "logs", "audit_logs", "data"]:
            if key in data and isinstance(data[key], list):
                return [item for item in data[key] if isinstance(item, dict)]
        # If single object represents an event
        if "action" in data or "actor" in data or "event_type" in data:
            return [data]
        raise ValueError("JSON object must contain an 'events', 'records', or 'logs' array.")
    else:
        raise ValueError("JSON root must be an array of event objects or a valid container object.")

def normalize_event(raw_record: Dict[str, Any], index: int, source_file: str = "upload") -> Tuple[Optional[CanonicalEvent], Optional[str]]:
    """
    Normalize raw record into CanonicalEvent.
    Returns (CanonicalEvent, None) or (None, rejection_reason).
    """
    raw_copy = {k: v for k, v in raw_record.items() if v is not None and str(v).lower() != "nan"}
    
    actor = resolve_field(raw_copy, "actor")
    action = resolve_field(raw_copy, "action")
    
    if not actor or not str(actor).strip():
        return None, f"Row {index+1}: Missing required actor/username."
    if not action or not str(action).strip():
        return None, f"Row {index+1}: Missing required action/operation."
        
    actor = str(actor).strip()
    action = str(action).strip()
    
    # Parse timestamp
    raw_ts = resolve_field(raw_copy, "timestamp")
    parsed_dt = parse_timestamp(raw_ts) if raw_ts else None
    if not parsed_dt:
        # Default with fallback timestamp
        parsed_dt = datetime.now(timezone.utc)
        ts_str = format_iso_timestamp(parsed_dt)
    else:
        ts_str = format_iso_timestamp(parsed_dt)
        
    # Optional fields
    target_user = resolve_field(raw_copy, "target_user")
    target_user = str(target_user).strip() if target_user is not None else None
    
    source_ip = resolve_field(raw_copy, "source_ip")
    source_ip = str(source_ip).strip() if source_ip is not None else None
    
    prev_role = resolve_field(raw_copy, "previous_role")
    prev_role = str(prev_role).strip().lower() if prev_role is not None else None
    
    new_role = resolve_field(raw_copy, "new_role")
    new_role = str(new_role).strip().lower() if new_role is not None else None
    
    status_raw = resolve_field(raw_copy, "status")
    if status_raw is not None:
        status_str = str(status_raw).strip().lower()
        if status_str in ["true", "1", "ok", "success", "successful"]:
            status = "success"
        elif status_str in ["false", "0", "fail", "failed", "failure", "denied", "error"]:
            status = "failure"
        else:
            status = status_str
    else:
        status = "success"
        
    resource = resolve_field(raw_copy, "resource")
    resource = str(resource).strip() if resource is not None else None
    
    # Event ID
    event_id = resolve_field(raw_copy, "event_id")
    if not event_id:
        event_id = generate_id("EVT", actor, action, ts_str, str(index))
    else:
        event_id = str(event_id).strip()

    event = CanonicalEvent(
        event_id=event_id,
        timestamp=ts_str,
        actor=actor,
        action=action,
        target_user=target_user,
        source_ip=source_ip,
        previous_role=prev_role,
        new_role=new_role,
        status=status,
        resource=resource,
        source_file=source_file,
        raw_data=raw_copy
    )
    return event, None

def process_log_records(records: List[Dict[str, Any]], source_file: str = "upload") -> Tuple[List[CanonicalEvent], ProcessingStats]:
    """Normalize records into CanonicalEvents, filter duplicates, and track statistics."""
    stats = ProcessingStats(
        total_records=len(records),
        accepted_records=0,
        rejected_records=0,
        duplicate_records=0,
        success_rate=0.0,
        errors=[]
    )
    
    events: List[CanonicalEvent] = []
    seen_fingerprints = set()
    
    for idx, raw_record in enumerate(records):
        event, err = normalize_event(raw_record, idx, source_file)
        if err:
            stats.rejected_records += 1
            if len(stats.errors) < 25:
                stats.errors.append(err)
            continue
            
        # Deduplication check: actor + action + timestamp + target_user + new_role
        fingerprint = f"{event.actor}|{event.action}|{event.timestamp}|{event.target_user}|{event.new_role}"
        if fingerprint in seen_fingerprints:
            stats.duplicate_records += 1
            # Still count as rejected duplicate
            continue
            
        seen_fingerprints.add(fingerprint)
        events.append(event)
        stats.accepted_records += 1

    stats.success_rate = calculate_success_rate(stats.accepted_records, stats.rejected_records + stats.duplicate_records)
    return events, stats
