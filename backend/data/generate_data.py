import json
import csv
import os
from datetime import datetime, timedelta, timezone

def generate_datasets():
    base_time = datetime(2026, 10, 10, 9, 0, 0, tzinfo=timezone.utc)
    events = []
    
    # 1. Normal business background traffic (60 events)
    users = ["alice_smith", "bob_operator", "carol_qa", "dan_pm", "erin_data", "frank_eng", "grace_lead", "heidi_support"]
    normal_actions = ["login", "view_dashboard", "read_record", "query_database", "logout", "access_file", "execute_job"]
    ips = ["10.0.0.1", "10.0.0.5", "192.168.1.100", "10.10.1.50"]
    
    t = base_time
    for i in range(65):
        t += timedelta(minutes=4, seconds=15)
        u = users[i % len(users)]
        act = normal_actions[i % len(normal_actions)]
        events.append({
            "event_id": f"EVT-NORM-{i+1:03d}",
            "timestamp": t.isoformat(),
            "actor": u,
            "action": act,
            "target_user": u,
            "source_ip": ips[i % len(ips)],
            "previous_role": "standard_user",
            "new_role": "standard_user",
            "status": "success",
            "resource": f"/app/service/{act}"
        })

    # 2. RULE-001: Privilege Elevation
    # Charlie elevates from 'user' to 'admin'
    t = base_time + timedelta(hours=1, minutes=15)
    events.append({
        "event_id": "EVT-RULE1-001",
        "timestamp": t.isoformat(),
        "actor": "charlie_dev",
        "action": "role_elevation",
        "target_user": "charlie_dev",
        "source_ip": "10.0.0.1",
        "previous_role": "user",
        "new_role": "admin",
        "status": "success",
        "resource": "IAM:RoleAssignment"
    })

    # 3. RULE-002: Administrator Account Creation
    # attacker_svc creates new admin account 'backdoor_admin'
    t = base_time + timedelta(hours=2, minutes=20)
    events.append({
        "event_id": "EVT-RULE2-001",
        "timestamp": t.isoformat(),
        "actor": "attacker_svc",
        "action": "create_user",
        "target_user": "backdoor_admin",
        "source_ip": "10.0.0.5",
        "previous_role": None,
        "new_role": "administrator",
        "status": "success",
        "resource": "ActiveDirectory:Users"
    })

    # 4. RULE-003: Privileged Group Membership Addition
    # operator_jim adds david_contractor to Domain Admins
    t = base_time + timedelta(hours=2, minutes=45)
    events.append({
        "event_id": "EVT-RULE3-001",
        "timestamp": t.isoformat(),
        "actor": "operator_jim",
        "action": "add_member",
        "target_user": "david_contractor",
        "source_ip": "10.10.1.50",
        "previous_role": "contractor",
        "new_role": "Domain Admins",
        "status": "success",
        "resource": "Domain Admins"
    })

    # 5. RULE-004: Suspicious Permission Modification
    # eve_analyst attaches AdministratorAccess wildcard policy
    t = base_time + timedelta(hours=3, minutes=30)
    events.append({
        "event_id": "EVT-RULE4-001",
        "timestamp": t.isoformat(),
        "actor": "eve_analyst",
        "action": "attach_policy",
        "target_user": "eve_analyst",
        "source_ip": "10.0.0.1",
        "previous_role": "analyst",
        "new_role": "AdministratorAccess",
        "status": "success",
        "resource": "arn:aws:iam::policy/AdministratorAccess"
    })

    # 6. RULE-005: After-Hours Administrative Activity
    # frank_backup executes root sudo elevation on Sunday midnight (2026-10-11T02:15:00Z)
    after_hours_t = datetime(2026, 10, 11, 2, 15, 0, tzinfo=timezone.utc)
    events.append({
        "event_id": "EVT-RULE5-001",
        "timestamp": after_hours_t.isoformat(),
        "actor": "frank_backup",
        "action": "sudo_elevation",
        "target_user": "root",
        "source_ip": "10.0.0.1",
        "previous_role": "operator",
        "new_role": "root",
        "status": "success",
        "resource": "/etc/sudoers"
    })

    # 7. RULE-006: Repeated Failed Administrative Access (6 consecutive failures in 6 minutes)
    t = base_time + timedelta(hours=5, minutes=0)
    for k in range(6):
        events.append({
            "event_id": f"EVT-RULE6-{k+1:03d}",
            "timestamp": (t + timedelta(minutes=k)).isoformat(),
            "actor": "mallory_bot",
            "action": "admin_login",
            "target_user": "admin",
            "source_ip": "203.0.113.42",
            "previous_role": None,
            "new_role": None,
            "status": "failure",
            "resource": "SSO:AdminPortal"
        })

    # 8. RULE-007: Multiple Privilege-Related Events in Burst (4 events in 6 minutes)
    t = base_time + timedelta(hours=6, minutes=0)
    for k in range(4):
        events.append({
            "event_id": f"EVT-RULE7-{k+1:03d}",
            "timestamp": (t + timedelta(minutes=k*2)).isoformat(),
            "actor": "kevin_devops",
            "action": f"role_permission_update_{k+1}",
            "target_user": "kevin_devops",
            "source_ip": "10.0.0.5",
            "previous_role": "devops_engineer",
            "new_role": f"cluster_admin_tier_{k+1}",
            "status": "success",
            "resource": f"K8s:RoleBinding_{k+1}"
        })

    # 9. RULE-008: Suspicious Multi-Stage Sequence Correlation
    # Actor 'infiltrator_x': 2 fails -> successful login -> role escalation to superadmin in 12 mins
    t = base_time + timedelta(hours=7, minutes=0)
    events.append({
        "event_id": "EVT-RULE8-001",
        "timestamp": t.isoformat(),
        "actor": "infiltrator_x",
        "action": "login",
        "target_user": "infiltrator_x",
        "source_ip": "198.51.100.99",
        "previous_role": None,
        "new_role": None,
        "status": "failure",
        "resource": "AuthService"
    })
    events.append({
        "event_id": "EVT-RULE8-002",
        "timestamp": (t + timedelta(minutes=2)).isoformat(),
        "actor": "infiltrator_x",
        "action": "login",
        "target_user": "infiltrator_x",
        "source_ip": "198.51.100.99",
        "previous_role": None,
        "new_role": None,
        "status": "failure",
        "resource": "AuthService"
    })
    events.append({
        "event_id": "EVT-RULE8-003",
        "timestamp": (t + timedelta(minutes=5)).isoformat(),
        "actor": "infiltrator_x",
        "action": "login",
        "target_user": "infiltrator_x",
        "source_ip": "198.51.100.99",
        "previous_role": None,
        "new_role": None,
        "status": "success",
        "resource": "AuthService"
    })
    events.append({
        "event_id": "EVT-RULE8-004",
        "timestamp": (t + timedelta(minutes=9)).isoformat(),
        "actor": "infiltrator_x",
        "action": "assign_role",
        "target_user": "infiltrator_x",
        "source_ip": "198.51.100.99",
        "previous_role": "user",
        "new_role": "superadmin",
        "status": "success",
        "resource": "IAM:RoleAssignment"
    })

    # 10. RULE-009: Unfamiliar IP During Privilege Change
    t = base_time + timedelta(hours=8, minutes=10)
    events.append({
        "event_id": "EVT-RULE9-001",
        "timestamp": t.isoformat(),
        "actor": "zoe_admin",
        "action": "grant_role",
        "target_user": "zoe_admin",
        "source_ip": "198.51.100.77",  # external unfamiliar IP
        "previous_role": "lead",
        "new_role": "sysadmin",
        "status": "success",
        "resource": "CloudConsole:IAM"
    })

    # 11. Additional 40 diverse realistic routine & administrative logs to make total > 120
    admin_users = ["sam_secops", "tina_infra", "uriel_dba", "val_architect"]
    admin_actions = ["rotate_secrets", "snapshot_volume", "flush_cache", "update_tls_cert", "review_audit_log", "scale_cluster"]
    for j in range(40):
        t += timedelta(minutes=7, seconds=30)
        u = admin_users[j % len(admin_users)]
        act = admin_actions[j % len(admin_actions)]
        events.append({
            "event_id": f"EVT-MAINT-{j+1:03d}",
            "timestamp": t.isoformat(),
            "actor": u,
            "action": act,
            "target_user": u,
            "source_ip": ips[j % len(ips)],
            "previous_role": "operator",
            "new_role": "operator",
            "status": "success",
            "resource": f"/system/maintenance/{act}"
        })

    # Sort all by timestamp
    events.sort(key=lambda x: x["timestamp"])

    data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
    os.makedirs(data_dir, exist_ok=True)

    # Save CSV
    csv_path = os.path.join(data_dir, "sample_audit_logs.csv")
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        fieldnames = ["event_id", "timestamp", "actor", "action", "target_user", "source_ip", "previous_role", "new_role", "status", "resource"]
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for ev in events:
            writer.writerow({k: ev.get(k, "") for k in fieldnames})

    # Save JSON
    json_path = os.path.join(data_dir, "sample_audit_logs.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump({"events": events}, f, indent=2)

    # Expected demo results summary
    expected_path = os.path.join(data_dir, "expected_demo_results.json")
    expected = {
        "dataset_name": "PrivilegeGuard Synthetic Enterprise Audit Baseline",
        "total_events": len(events),
        "synthetic": True,
        "expected_triggered_rules": [
            {"rule_id": "RULE-001", "name": "Privilege Elevation", "actor": "charlie_dev", "expected_severity": "High"},
            {"rule_id": "RULE-002", "name": "Administrator Account Creation", "actor": "attacker_svc", "expected_severity": "Critical"},
            {"rule_id": "RULE-003", "name": "Privileged Group Membership Addition", "actor": "operator_jim", "expected_severity": "High"},
            {"rule_id": "RULE-004", "name": "Suspicious Permission Modification", "actor": "eve_analyst", "expected_severity": "High"},
            {"rule_id": "RULE-005", "name": "After-Hours Administrative Activity", "actor": "frank_backup", "expected_severity": "Medium"},
            {"rule_id": "RULE-006", "name": "Repeated Failed Administrative Access", "actor": "mallory_bot", "expected_severity": "Medium"},
            {"rule_id": "RULE-007", "name": "Multiple Privilege-Related Events in Burst", "actor": "kevin_devops", "expected_severity": "Medium"},
            {"rule_id": "RULE-008", "name": "Suspicious Multi-Stage Sequence Correlation", "actor": "infiltrator_x", "expected_severity": "Critical"},
            {"rule_id": "RULE-009", "name": "Unfamiliar IP Address During Privilege Change", "actor": "zoe_admin", "expected_severity": "Medium"}
        ],
        "key_scenarios_explained": {
            "account_takeover_sequence": "infiltrator_x failed authentication twice, logged in, and promoted account to superadmin in 9 minutes (RULE-008).",
            "backdoor_creation": "attacker_svc provisioned backdoor_admin directly with administrator rights (RULE-002).",
            "unauthorized_group_grant": "operator_jim granted Domain Admins membership to david_contractor (RULE-003)."
        }
    }
    with open(expected_path, "w", encoding="utf-8") as f:
        json.dump(expected, f, indent=2)

    print(f"Generated {len(events)} synthetic audit log events in CSV and JSON.")

if __name__ == "__main__":
    generate_datasets()
