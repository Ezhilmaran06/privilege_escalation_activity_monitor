from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class CanonicalEvent(BaseModel):
    event_id: str
    timestamp: str
    actor: str
    action: str
    target_user: Optional[str] = None
    source_ip: Optional[str] = None
    previous_role: Optional[str] = None
    new_role: Optional[str] = None
    status: str = "success"
    resource: Optional[str] = None
    source_file: Optional[str] = "audit_log"
    raw_data: Optional[Dict[str, Any]] = None

class ScoreBreakdown(BaseModel):
    base_weight: int
    contextual_contributions: List[Dict[str, Any]] = []
    deduplication_notes: Optional[str] = None
    final_score: int
    severity: str
    calculation_summary: str

class DetectionAlert(BaseModel):
    alert_id: str
    timestamp: str
    actor: str
    target_user: Optional[str] = None
    action: str
    resource: Optional[str] = None
    source_ip: Optional[str] = None
    rule_id: str
    rule_name: str
    risk_score: int
    severity: str
    explanation: str
    evidence: Dict[str, Any]
    recommended_actions: List[str]
    related_event_ids: List[str] = []
    evidence_quality: str = "High"  # High, Medium, Low
    investigation_status: str = "New"  # New, Under Investigation, Reviewed, False Positive
    score_breakdown: Optional[ScoreBreakdown] = None

class ProcessingStats(BaseModel):
    total_records: int = 0
    accepted_records: int = 0
    rejected_records: int = 0
    duplicate_records: int = 0
    success_rate: float = 0.0
    errors: List[str] = []

class DashboardSummary(BaseModel):
    total_events: int
    suspicious_alerts: int
    critical_high_alerts: int
    affected_users: int
    processing_success_rate: float
    severity_distribution: Dict[str, int]
    rule_frequency: List[Dict[str, Any]]
    top_affected_users: List[Dict[str, Any]]
    timeline_overview: List[Dict[str, Any]]
    risk_distribution: Dict[str, int]
    processing_stats: ProcessingStats
    dataset_name: str = "Default Dataset"
    analyzed_at: Optional[str] = None

class AlertStatusUpdate(BaseModel):
    investigation_status: str
    analyst_notes: Optional[str] = None

class UserRiskItem(BaseModel):
    actor: str
    alert_count: int
    highest_risk_score: int
    highest_severity: str
    common_actions: List[str]
    recent_event_time: str
    related_alert_ids: List[str]
    source_ips: List[str] = []
    severity_breakdown: Dict[str, int] = {}

class TimelineEvent(BaseModel):
    timestamp: str
    actor: str
    action: str
    severity: str
    risk_score: int
    rule_name: str
    alert_id: Optional[str] = None
    target_user: Optional[str] = None
    source_ip: Optional[str] = None

class ReportSummary(BaseModel):
    generated_at: str
    dataset_name: str
    total_events: int
    total_alerts: int
    severity_counts: Dict[str, int]
    rule_counts: Dict[str, int]
    top_risky_users: List[Dict[str, Any]]
    critical_alerts_preview: List[Dict[str, Any]]
    system_recommendations: List[str]
    disclaimer: str

class HealthResponse(BaseModel):
    status: str
    version: str
    system: str
    timestamp: str
    persistence_enabled: bool
