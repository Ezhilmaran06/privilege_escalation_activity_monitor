import pytest
from app.core.log_parser import parse_csv_content, parse_json_content, normalize_event, process_log_records

def test_parse_csv_content(sample_raw_csv_bytes):
    records = parse_csv_content(sample_raw_csv_bytes)
    assert len(records) == 2
    assert records[0]["actor"] == "alice"
    assert records[1]["action"] == "role_elevation"

def test_parse_json_content(sample_raw_json_bytes):
    records = parse_json_content(sample_raw_json_bytes)
    assert len(records) == 1
    assert records[0]["username"] == "bob"

def test_alias_normalization():
    raw_record = {
        "user": "developer_dan",
        "operation": "assume_role",
        "time": "2026-10-10 14:00:00",
        "client_ip": "192.168.1.55",
        "from_role": "viewer",
        "to_role": "admin",
        "result": "success"
    }
    event, err = normalize_event(raw_record, 0)
    assert err is None
    assert event.actor == "developer_dan"
    assert event.action == "assume_role"
    assert event.previous_role == "viewer"
    assert event.new_role == "admin"
    assert event.source_ip == "192.168.1.55"
    assert event.status == "success"

def test_missing_required_fields():
    # Missing action
    record = {"actor": "alice"}
    event, err = normalize_event(record, 0)
    assert event is None
    assert "Missing required action" in err

    # Missing actor
    record2 = {"action": "login"}
    event2, err2 = normalize_event(record2, 0)
    assert event2 is None
    assert "Missing required actor" in err2

def test_duplicate_filtering():
    records = [
        {"actor": "bob", "action": "login", "timestamp": "2026-10-10T10:00:00Z"},
        {"actor": "bob", "action": "login", "timestamp": "2026-10-10T10:00:00Z"},  # Duplicate
        {"actor": "bob", "action": "view", "timestamp": "2026-10-10T10:05:00Z"}
    ]
    events, stats = process_log_records(records)
    assert len(events) == 2
    assert stats.duplicate_records == 1
    assert stats.accepted_records == 2
