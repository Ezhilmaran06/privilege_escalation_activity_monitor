import pytest
from app.core.risk_scoring import compute_risk_score, classify_severity

def test_severity_classification():
    assert classify_severity(90) == "Critical"
    assert classify_severity(75) == "High"
    assert classify_severity(50) == "Medium"
    assert classify_severity(20) == "Low"
    assert classify_severity(0) == "Low"
    assert classify_severity(100) == "Critical"

def test_risk_score_boundaries():
    # Test capping at 100
    modifiers = [
        {"name": "High Modifier", "weight": 40, "reason": "Reason 1"},
        {"name": "Another Modifier", "weight": 50, "reason": "Reason 2"}
    ]
    bd = compute_risk_score("RULE-002", modifiers)  # base weight 65 + 90 = 155 -> capped at 100
    assert bd.final_score == 100
    assert bd.severity == "Critical"
    assert bd.deduplication_notes is not None

def test_risk_score_deduplication():
    modifiers = [
        {"name": "Same Factor", "weight": 10, "reason": "One"},
        {"name": "Same Factor", "weight": 10, "reason": "Duplicate"}
    ]
    bd = compute_risk_score("RULE-001", modifiers)  # base weight 55 + 10 = 65
    assert bd.final_score == 65
    assert len(bd.contextual_contributions) == 1
