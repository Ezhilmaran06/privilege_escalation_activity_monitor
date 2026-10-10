import pytest

def test_api_health(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["system"] == "PrivilegeGuard"

def test_api_demo_load(client):
    res = client.post("/api/demo/load")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert "summary" in data

def test_api_dashboard_summary(client):
    res = client.get("/api/dashboard/summary")
    assert res.status_code == 200
    data = res.json()
    assert "total_events" in data
    assert "severity_distribution" in data
    assert data["total_events"] > 0

def test_api_list_alerts(client):
    res = client.get("/api/alerts")
    assert res.status_code == 200
    data = res.json()
    assert "items" in data
    assert len(data["items"]) > 0

def test_api_alert_status_update(client):
    # Fetch first alert
    res = client.get("/api/alerts")
    first_alert = res.json()["items"][0]
    alert_id = first_alert["alert_id"]

    # Patch status
    patch_res = client.patch(
        f"/api/alerts/{alert_id}/status",
        json={"investigation_status": "Under Investigation", "analyst_notes": "Triage verified"}
    )
    assert patch_res.status_code == 200
    assert patch_res.json()["new_status"] == "Under Investigation"

    # Verify updated
    get_res = client.get(f"/api/alerts/{alert_id}")
    assert get_res.status_code == 200
    assert get_res.json()["investigation_status"] == "Under Investigation"

def test_api_reports_export_csv(client):
    res = client.get("/api/reports/export?format=csv")
    assert res.status_code == 200
    assert "text/csv" in res.headers["content-type"]
    assert b"Alert ID" in res.content

def test_api_reports_export_json(client):
    res = client.get("/api/reports/export?format=json")
    assert res.status_code == 200
    assert "application/json" in res.headers["content-type"]

def test_api_reports_export_pdf(client):
    res = client.get("/api/reports/export?format=pdf")
    assert res.status_code == 200
    assert "application/pdf" in res.headers["content-type"]
    assert res.content.startswith(b"%PDF")
