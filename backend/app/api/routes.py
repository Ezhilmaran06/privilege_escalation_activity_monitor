import os
import json
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Query, Response, status
from fastapi.responses import JSONResponse, Response

from app.config import settings
from app.schemas import (
    HealthResponse, DashboardSummary, CanonicalEvent, DetectionAlert,
    AlertStatusUpdate, UserRiskItem, ProcessingStats, ReportSummary
)
from app.core.log_parser import parse_csv_content, parse_json_content, process_log_records
from app.core.detection_engine import DetectionEngine
from app.core.analytics import compute_dashboard_metrics, compute_user_risk_analysis
from app.core.reporting import (
    generate_alerts_csv, generate_events_csv,
    generate_audit_summary_json, generate_pdf_report
)
from app.database.storage import db_manager

router = APIRouter()

# Global state for active in-memory session (fast, interactive, responsive)
class SessionState:
    def __init__(self):
        self.dataset_name: str = "Demo Dataset"
        self.events: List[CanonicalEvent] = []
        self.alerts: List[DetectionAlert] = []
        self.stats: ProcessingStats = ProcessingStats()
        self.analyzed: bool = False
        self.detector = DetectionEngine()

session = SessionState()

def _load_initial_demo():
    """Load default sample dataset if state is empty."""
    if not session.events:
        json_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "sample_audit_logs.json")
        if os.path.exists(json_path):
            with open(json_path, "rb") as f:
                content = f.read()
                raw_records = parse_json_content(content)
                events, stats = process_log_records(raw_records, source_file="sample_audit_logs.json")
                session.events = events
                session.stats = stats
                session.dataset_name = "Synthetic Enterprise Audit Baseline"
                session.alerts = session.detector.run_all_rules(events)
                session.analyzed = True
                if settings.ENABLE_SQLITE_PERSISTENCE:
                    db_manager.save_analysis("demo-analysis", session.dataset_name, len(events), session.alerts, stats.success_rate)

# Automatically seed demo data on first import
try:
    _load_initial_demo()
except Exception:
    pass

# --- Health ---
@router.get("/health", response_model=HealthResponse)
def get_health():
    return HealthResponse(
        status="healthy",
        version=settings.VERSION,
        system=settings.PROJECT_NAME,
        timestamp=datetime.now(timezone.utc).isoformat(),
        persistence_enabled=settings.ENABLE_SQLITE_PERSISTENCE
    )

# --- Dashboard ---
@router.get("/dashboard/summary", response_model=DashboardSummary)
def get_dashboard_summary():
    _load_initial_demo()
    return compute_dashboard_metrics(
        events=session.events,
        alerts=session.alerts,
        stats=session.stats,
        dataset_name=session.dataset_name
    )

# --- Upload & Ingestion ---
@router.post("/logs/upload")
async def upload_logs(file: UploadFile = File(...)):
    # Validate extension
    filename = file.filename or "uploaded_file"
    ext = os.path.splitext(filename)[1].lower()
    if ext not in [".csv", ".json"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{ext}'. Only .csv and .json audit logs are supported."
        )

    # Read and check size
    content = await file.read()
    if len(content) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty. Please supply a valid CSV or JSON audit log."
        )
    if len(content) > settings.MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum allowed upload size of {settings.MAX_UPLOAD_SIZE_BYTES // (1024 * 1024)} MB."
        )

    try:
        if ext == ".csv":
            raw_records = parse_csv_content(content)
        else:
            raw_records = parse_json_content(content)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Failed to parse file: {str(e)}"
        )

    if not raw_records:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File contained no data rows or recognizable event records."
        )

    if len(raw_records) > settings.MAX_ROW_COUNT:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Record count {len(raw_records)} exceeds maximum allowable limit of {settings.MAX_ROW_COUNT}."
        )

    events, stats = process_log_records(raw_records, source_file=filename)
    if not events and stats.rejected_records > 0:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"All {stats.rejected_records} records failed schema validation. Sample error: {stats.errors[0] if stats.errors else 'Invalid schema'}"
        )

    # Update session
    session.dataset_name = filename
    session.events = events
    session.stats = stats
    session.alerts = []
    session.analyzed = False

    return {
        "status": "success",
        "message": f"Successfully parsed and normalized {len(events)} events from {filename}.",
        "filename": filename,
        "total_records": stats.total_records,
        "accepted_records": stats.accepted_records,
        "rejected_records": stats.rejected_records,
        "duplicate_records": stats.duplicate_records,
        "success_rate": stats.success_rate,
        "errors_preview": stats.errors[:5]
    }

# --- Analyze Logs ---
@router.post("/logs/analyze")
def analyze_logs():
    if not session.events:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No events loaded in active session. Upload a file or load the demo dataset first."
        )

    alerts = session.detector.run_all_rules(session.events)
    session.alerts = alerts
    session.analyzed = True

    # Persist in SQLite
    if settings.ENABLE_SQLITE_PERSISTENCE:
        import uuid
        analysis_id = f"ANL-{uuid.uuid4().hex[:8]}"
        db_manager.save_analysis(analysis_id, session.dataset_name, len(session.events), alerts, session.stats.success_rate)

    summary = compute_dashboard_metrics(session.events, session.alerts, session.stats, session.dataset_name)
    return {
        "status": "success",
        "message": f"Detection engine executed 9 rules across {len(session.events)} events. Found {len(alerts)} suspicious activity alerts.",
        "summary": summary
    }

# --- Logs list with pagination ---
@router.get("/logs")
def list_logs(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=500),
    actor: Optional[str] = None,
    action: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    search: Optional[str] = None
):
    _load_initial_demo()
    filtered = session.events
    
    if actor:
        filtered = [e for e in filtered if actor.lower() in e.actor.lower()]
    if action:
        filtered = [e for e in filtered if action.lower() in e.action.lower()]
    if status_filter:
        filtered = [e for e in filtered if e.status.lower() == status_filter.lower()]
    if search:
        s = search.lower()
        filtered = [
            e for e in filtered
            if s in e.actor.lower() or s in e.action.lower() or (e.target_user and s in e.target_user.lower()) or (e.resource and s in e.resource.lower())
        ]

    total = len(filtered)
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    items = filtered[start_idx:end_idx]

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size if total > 0 else 1,
        "items": items
    }

# --- Demo Load ---
@router.post("/demo/load")
def load_demo_dataset():
    json_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "sample_audit_logs.json")
    if not os.path.exists(json_path):
        raise HTTPException(status_code=500, detail="Demo dataset file not found on server.")

    with open(json_path, "rb") as f:
        content = f.read()
    raw_records = parse_json_content(content)
    events, stats = process_log_records(raw_records, source_file="sample_audit_logs.json")

    session.events = events
    session.stats = stats
    session.dataset_name = "Synthetic Enterprise Audit Baseline"
    session.alerts = session.detector.run_all_rules(events)
    session.analyzed = True

    if settings.ENABLE_SQLITE_PERSISTENCE:
        db_manager.save_analysis("demo-run", session.dataset_name, len(events), session.alerts, stats.success_rate)

    summary = compute_dashboard_metrics(session.events, session.alerts, session.stats, session.dataset_name)
    return {
        "status": "success",
        "message": f"Successfully loaded synthetic demo dataset with {len(events)} events and {len(session.alerts)} alerts.",
        "summary": summary
    }

# --- Alerts ---
@router.get("/alerts")
def list_alerts(
    severity: Optional[str] = None,
    actor: Optional[str] = None,
    rule: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    min_score: Optional[int] = None,
    search: Optional[str] = None,
    sort_by: str = Query("risk_score", pattern="^(risk_score|timestamp|actor|severity)$"),
    sort_dir: str = Query("desc", pattern="^(asc|desc)$"),
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=200)
):
    _load_initial_demo()
    filtered = list(session.alerts)

    if severity:
        filtered = [a for a in filtered if a.severity.lower() == severity.lower()]
    if actor:
        filtered = [a for a in filtered if actor.lower() in a.actor.lower() or (a.target_user and actor.lower() in a.target_user.lower())]
    if rule:
        filtered = [a for a in filtered if rule.lower() in a.rule_name.lower() or rule.lower() in a.rule_id.lower()]
    if status_filter:
        filtered = [a for a in filtered if a.investigation_status.lower() == status_filter.lower()]
    if min_score is not None:
        filtered = [a for a in filtered if a.risk_score >= min_score]
    if search:
        s = search.lower()
        filtered = [
            a for a in filtered
            if s in a.actor.lower() or s in a.rule_name.lower() or s in a.explanation.lower() or (a.target_user and s in a.target_user.lower())
        ]

    # Sort
    reverse = (sort_dir == "desc")
    if sort_by == "risk_score":
        filtered.sort(key=lambda a: a.risk_score, reverse=reverse)
    elif sort_by == "timestamp":
        filtered.sort(key=lambda a: a.timestamp, reverse=reverse)
    elif sort_by == "actor":
        filtered.sort(key=lambda a: a.actor, reverse=reverse)
    elif sort_by == "severity":
        sev_rank = {"Critical": 4, "High": 3, "Medium": 2, "Low": 1}
        filtered.sort(key=lambda a: sev_rank.get(a.severity, 0), reverse=reverse)

    total = len(filtered)
    start_idx = (page - 1) * page_size
    items = filtered[start_idx:start_idx + page_size]

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size if total > 0 else 1,
        "items": items
    }

@router.get("/alerts/{alert_id}", response_model=DetectionAlert)
def get_alert_details(alert_id: str):
    _load_initial_demo()
    for a in session.alerts:
        if a.alert_id == alert_id:
            return a
    raise HTTPException(status_code=404, detail=f"Alert with ID '{alert_id}' not found.")

@router.patch("/alerts/{alert_id}/status")
def update_alert_status(alert_id: str, update: AlertStatusUpdate):
    valid_statuses = ["New", "Under Investigation", "Reviewed", "False Positive"]
    if update.investigation_status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid investigation status. Must be one of: {', '.join(valid_statuses)}"
        )

    found = False
    for a in session.alerts:
        if a.alert_id == alert_id:
            a.investigation_status = update.investigation_status
            found = True
            break

    if not found:
        raise HTTPException(status_code=404, detail=f"Alert '{alert_id}' not found.")

    # Update in SQLite
    if settings.ENABLE_SQLITE_PERSISTENCE:
        db_manager.update_alert_status(alert_id, update.investigation_status, update.analyst_notes)

    return {
        "status": "success",
        "alert_id": alert_id,
        "new_status": update.investigation_status,
        "notes": update.analyst_notes
    }

# --- Timeline ---
@router.get("/timeline")
def get_activity_timeline():
    _load_initial_demo()
    # Combine alerts and events into a chronological stream
    items = []
    for a in session.alerts:
        items.append({
            "timestamp": a.timestamp,
            "actor": a.actor,
            "action": a.action,
            "severity": a.severity,
            "risk_score": a.risk_score,
            "rule_name": a.rule_name,
            "alert_id": a.alert_id,
            "target_user": a.target_user,
            "source_ip": a.source_ip,
            "is_alert": True,
            "explanation": a.explanation
        })

    # Sort descending
    items.sort(key=lambda x: x["timestamp"], reverse=True)
    return {"total": len(items), "timeline": items}

# --- User Risk ---
@router.get("/users/risk")
def get_users_risk():
    _load_initial_demo()
    return compute_user_risk_analysis(session.events, session.alerts)

# --- Reports & Export ---
@router.get("/reports/summary", response_model=ReportSummary)
def get_report_summary():
    _load_initial_demo()
    json_summary = generate_audit_summary_json(session.events, session.alerts, session.dataset_name)
    user_risks = compute_user_risk_analysis(session.events, session.alerts)
    
    return ReportSummary(
        generated_at=json_summary["generated_at"],
        dataset_name=session.dataset_name,
        total_events=len(session.events),
        total_alerts=len(session.alerts),
        severity_counts=json_summary["severity_distribution"],
        rule_counts=json_summary["rule_frequency"],
        top_risky_users=[u.model_dump() for u in user_risks[:5]],
        critical_alerts_preview=json_summary["critical_high_alerts_preview"],
        system_recommendations=json_summary["recommendations"],
        disclaimer=json_summary["disclaimer"]
    )

@router.get("/reports/export")
def export_report(
    format: str = Query("csv", pattern="^(csv|json|pdf|events_csv)$"),
    severity: Optional[str] = None
):
    _load_initial_demo()
    alerts_to_export = session.alerts
    if severity:
        alerts_to_export = [a for a in alerts_to_export if a.severity.lower() == severity.lower()]

    safe_name = session.dataset_name.replace(" ", "_").replace(".", "_")

    if format == "csv":
        csv_text = generate_alerts_csv(alerts_to_export)
        return Response(
            content=csv_text,
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=privilege_guard_alerts_{safe_name}.csv"}
        )
    elif format == "events_csv":
        csv_text = generate_events_csv(session.events)
        return Response(
            content=csv_text,
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=privilege_guard_normalized_events_{safe_name}.csv"}
        )
    elif format == "json":
        data = generate_audit_summary_json(session.events, alerts_to_export, session.dataset_name)
        return Response(
            content=json.dumps(data, indent=2),
            media_type="application/json",
            headers={"Content-Disposition": f"attachment; filename=privilege_guard_audit_{safe_name}.json"}
        )
    elif format == "pdf":
        pdf_bytes = generate_pdf_report(session.events, alerts_to_export, session.dataset_name)
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=privilege_guard_report_{safe_name}.pdf"}
        )
