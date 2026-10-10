import pytest
from app.core.detection_engine import DetectionEngine
from app.schemas import CanonicalEvent

@pytest.fixture
def detector():
    return DetectionEngine()

def test_rule_001_privilege_elevation(detector):
    event = CanonicalEvent(
        event_id="E-01",
        timestamp="2026-10-10T10:00:00Z",
        actor="charlie",
        action="elevate_role",
        target_user="charlie",
        previous_role="standard_user",
        new_role="admin",
        status="success"
    )
    alerts = detector.run_all_rules([event])
    rule_alerts = [a for a in alerts if a.rule_id == "RULE-001"]
    assert len(rule_alerts) == 1
    assert rule_alerts[0].severity in ["High", "Medium"]
    assert "charlie" in rule_alerts[0].explanation

def test_rule_002_admin_account_creation(detector):
    event = CanonicalEvent(
        event_id="E-02",
        timestamp="2026-10-10T11:00:00Z",
        actor="system_admin",
        action="create_user",
        target_user="new_sysadmin",
        new_role="administrator",
        status="success"
    )
    alerts = detector.run_all_rules([event])
    rule_alerts = [a for a in alerts if a.rule_id == "RULE-002"]
    assert len(rule_alerts) == 1
    assert rule_alerts[0].rule_id == "RULE-002"

def test_rule_003_privileged_group_membership(detector):
    event = CanonicalEvent(
        event_id="E-03",
        timestamp="2026-10-10T12:00:00Z",
        actor="admin_dan",
        action="add_member",
        target_user="contractor_tim",
        resource="Domain Admins",
        status="success"
    )
    alerts = detector.run_all_rules([event])
    rule_alerts = [a for a in alerts if a.rule_id == "RULE-003"]
    assert len(rule_alerts) == 1
    assert "Domain Admins" in rule_alerts[0].explanation

def test_rule_004_permission_modification(detector):
    event = CanonicalEvent(
        event_id="E-04",
        timestamp="2026-10-10T13:00:00Z",
        actor="eve",
        action="attach_policy",
        resource="AdministratorAccess",
        new_role="FullAccess",
        status="success"
    )
    alerts = detector.run_all_rules([event])
    rule_alerts = [a for a in alerts if a.rule_id == "RULE-004"]
    assert len(rule_alerts) == 1

def test_rule_005_after_hours_activity(detector):
    # Sunday midnight (after hours)
    event = CanonicalEvent(
        event_id="E-05",
        timestamp="2026-10-11T02:00:00Z",
        actor="sam_ops",
        action="sudo_command",
        new_role="root",
        status="success"
    )
    alerts = detector.run_all_rules([event])
    rule_alerts = [a for a in alerts if a.rule_id == "RULE-005"]
    assert len(rule_alerts) == 1

def test_rule_006_repeated_failed_access(detector):
    events = [
        CanonicalEvent(
            event_id=f"E-06-{i}",
            timestamp=f"2026-10-10T14:0{i}:00Z",
            actor="brute_actor",
            action="login",
            status="failure"
        )
        for i in range(5)
    ]
    alerts = detector.run_all_rules(events)
    rule_alerts = [a for a in alerts if a.rule_id == "RULE-006"]
    assert len(rule_alerts) >= 1

def test_rule_007_multiple_privilege_burst(detector):
    events = [
        CanonicalEvent(
            event_id=f"E-07-{i}",
            timestamp=f"2026-10-10T15:0{i*2}:00Z",
            actor="burst_user",
            action="role_change",
            new_role=f"role_{i}",
            status="success"
        )
        for i in range(3)
    ]
    alerts = detector.run_all_rules(events)
    rule_alerts = [a for a in alerts if a.rule_id == "RULE-007"]
    assert len(rule_alerts) >= 1

def test_rule_008_suspicious_sequence(detector):
    events = [
        CanonicalEvent(
            event_id="E-08-1",
            timestamp="2026-10-10T16:00:00Z",
            actor="attacker",
            action="login",
            status="failure"
        ),
        CanonicalEvent(
            event_id="E-08-2",
            timestamp="2026-10-10T16:05:00Z",
            actor="attacker",
            action="login",
            status="success"
        ),
        CanonicalEvent(
            event_id="E-08-3",
            timestamp="2026-10-10T16:10:00Z",
            actor="attacker",
            action="assign_role",
            new_role="superadmin",
            status="success"
        )
    ]
    alerts = detector.run_all_rules(events)
    rule_alerts = [a for a in alerts if a.rule_id == "RULE-008"]
    assert len(rule_alerts) == 1
    assert "kill-chain" in rule_alerts[0].explanation.lower() or "sequence" in rule_alerts[0].explanation.lower()

def test_rule_009_unfamiliar_ip(detector):
    event = CanonicalEvent(
        event_id="E-09",
        timestamp="2026-10-10T17:00:00Z",
        actor="zoe",
        action="grant_admin",
        new_role="admin",
        source_ip="198.51.100.222",  # Unfamiliar IP
        status="success"
    )
    alerts = detector.run_all_rules([event])
    rule_alerts = [a for a in alerts if a.rule_id == "RULE-009"]
    assert len(rule_alerts) == 1
