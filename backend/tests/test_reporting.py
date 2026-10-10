import pytest
from app.core.reporting import (
    generate_alerts_csv, generate_events_csv,
    generate_audit_summary_json, generate_pdf_report
)
from app.schemas import CanonicalEvent, DetectionAlert
from app.core.risk_scoring import compute_risk_score

@pytest.fixture
def dummy_event():
    return CanonicalEvent(
        event_id="EVT-DUMMY-1",
        timestamp="2026-10-10T12:00:00Z",
        actor="alice",
        action="login",
        status="success"
    )

@pytest.fixture
def dummy_alert(dummy_event):
    score_bd = compute_risk_score("RULE-001")
    return DetectionAlert(
        alert_id="ALT-DUMMY-1",
        timestamp=dummy_event.timestamp,
        actor=dummy_event.actor,
        action=dummy_event.action,
        rule_id="RULE-001",
        rule_name="Privilege Elevation",
        risk_score=score_bd.final_score,
        severity=score_bd.severity,
        explanation="Test explanation",
        evidence={"actor": "alice"},
        recommended_actions=["Verify change"],
        score_breakdown=score_bd
    )

def test_generate_alerts_csv(dummy_alert):
    csv_str = generate_alerts_csv([dummy_alert])
    assert "Alert ID" in csv_str
    assert "ALT-DUMMY-1" in csv_str
    assert "Privilege Elevation" in csv_str

def test_generate_events_csv(dummy_event):
    csv_str = generate_events_csv([dummy_event])
    assert "Event ID" in csv_str
    assert "EVT-DUMMY-1" in csv_str

def test_generate_audit_summary_json(dummy_event, dummy_alert):
    data = generate_audit_summary_json([dummy_event], [dummy_alert])
    assert data["total_events"] == 1
    assert data["total_alerts"] == 1
    assert "disclaimer" in data

def test_generate_pdf_report(dummy_event, dummy_alert):
    pdf_bytes = generate_pdf_report([dummy_event], [dummy_alert])
    assert len(pdf_bytes) > 1000
    assert pdf_bytes.startswith(b"%PDF")
