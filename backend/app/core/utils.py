import re
import hashlib
import ipaddress
from datetime import datetime, timezone
from typing import Optional, Tuple, Any

def parse_timestamp(ts_val: Any) -> Optional[datetime]:
    """Safely parse various datetime representations into UTC timezone-aware datetime."""
    if ts_val is None or ts_val == "":
        return None
        
    if isinstance(ts_val, datetime):
        if ts_val.tzinfo is None:
            return ts_val.replace(tzinfo=timezone.utc)
        return ts_val.astimezone(timezone.utc)
        
    ts_str = str(ts_val).strip()
    
    # Try ISO formats
    try:
        dt = datetime.fromisoformat(ts_str.replace("Z", "+00:00"))
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc)
    except (ValueError, TypeError):
        pass
        
    # Try common format strings
    formats = [
        "%Y-%m-%d %H:%M:%S",
        "%Y-%m-%d %H:%M:%S%z",
        "%Y/%m/%d %H:%M:%S",
        "%d-%m-%Y %H:%M:%S",
        "%d/%m/%Y %H:%M:%S",
        "%Y-%m-%dT%H:%M:%S",
        "%Y-%m-%d",
    ]
    for fmt in formats:
        try:
            dt = datetime.strptime(ts_str, fmt)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            return dt.astimezone(timezone.utc)
        except (ValueError, TypeError):
            continue
            
    # Try epoch timestamp
    try:
        val_float = float(ts_str)
        # If milliseconds
        if val_float > 1e11:
            val_float = val_float / 1000.0
        return datetime.fromtimestamp(val_float, tz=timezone.utc)
    except (ValueError, TypeError, OverflowError):
        pass

    return None

def format_iso_timestamp(dt: Optional[datetime]) -> str:
    """Format datetime into ISO-8601 UTC string."""
    if not dt:
        return datetime.now(timezone.utc).isoformat()
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc).isoformat()

def generate_id(prefix: str, *parts: str) -> str:
    """Generate deterministic or random unique ID."""
    content = "_".join(str(p) for p in parts if p is not None)
    if not content:
        import uuid
        return f"{prefix}-{uuid.uuid4().hex[:8]}"
    h = hashlib.sha256(content.encode("utf-8")).hexdigest()[:8]
    return f"{prefix}-{h}"

def calculate_success_rate(accepted: int, rejected: int) -> float:
    """Calculate processing success rate: accepted / (accepted + rejected) * 100."""
    total = accepted + rejected
    if total <= 0:
        return 0.0
    return round((accepted / total) * 100.0, 2)

def is_valid_ip(ip_str: Optional[str]) -> bool:
    """Check if string is a valid IPv4 or IPv6 address."""
    if not ip_str:
        return False
    try:
        ipaddress.ip_address(ip_str.strip())
        return True
    except ValueError:
        return False

def is_after_hours(dt: datetime, start_hour: int = 9, end_hour: int = 18, business_days: Tuple[int, ...] = (0, 1, 2, 3, 4)) -> bool:
    """
    Check if a datetime in UTC is outside business hours.
    business_days: 0=Monday .. 4=Friday, 5=Saturday, 6=Sunday.
    start_hour (inclusive) to end_hour (exclusive).
    """
    # Weekday check
    if dt.weekday() not in business_days:
        return True
    # Hour check
    if dt.hour < start_hour or dt.hour >= end_hour:
        return True
    return False
