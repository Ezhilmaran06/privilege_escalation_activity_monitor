import pytest
import os
import sys

# Ensure backend directory is in sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fastapi.testclient import TestClient
from app.main import app
from app.schemas import CanonicalEvent

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def sample_raw_csv_bytes():
    csv_data = """event_id,timestamp,actor,action,target_user,source_ip,previous_role,new_role,status,resource
EVT-01,2026-10-10T10:00:00Z,alice,login,alice,10.0.0.1,user,user,success,/login
EVT-02,2026-10-10T10:15:00Z,charlie,role_elevation,charlie,10.0.0.1,user,admin,success,IAM:Role
"""
    return csv_data.encode("utf-8")

@pytest.fixture
def sample_raw_json_bytes():
    json_data = """{
  "events": [
    {
      "event_id": "EVT-J01",
      "timestamp": "2026-10-10T10:00:00Z",
      "username": "bob",
      "activity": "login",
      "ip_address": "10.0.0.2",
      "outcome": "success"
    }
  ]
}"""
    return json_data.encode("utf-8")
