export const MOCK_ALERTS = [
  {
    alert_id: "ALT-RULE8-001",
    timestamp: "2026-10-10T16:09:00Z",
    actor: "infiltrator_x",
    target_user: "infiltrator_x",
    action: "assign_role",
    resource: "IAM:RoleAssignment",
    source_ip: "198.51.100.99",
    rule_id: "RULE-008",
    rule_name: "Suspicious Multi-Stage Sequence Correlation",
    risk_score: 95,
    severity: "Critical",
    explanation: "Detected suspicious 3-stage kill-chain sequence for actor 'infiltrator_x': (1) Failed login at 16:00:00, (2) Successful login at 16:05:00, (3) Privilege escalation 'assign_role' to 'superadmin' at 16:09:00.",
    evidence: {
      actor: "infiltrator_x",
      stage_1_failure: { event_id: "EVT-RULE8-001", time: "2026-10-10T16:00:00Z", action: "login" },
      stage_2_success_login: { event_id: "EVT-RULE8-003", time: "2026-10-10T16:05:00Z", action: "login" },
      stage_3_escalation: { event_id: "EVT-RULE8-004", time: "2026-10-10T16:09:00Z", action: "assign_role" },
      correlation_window_minutes: 30
    },
    recommended_actions: [
      "High priority: Initiate incident triage protocol for potential account takeover.",
      "Revoke active sessions and force token invalidation for involved accounts.",
      "Isolate affected hosts and collect memory/network telemetry."
    ],
    related_event_ids: ["EVT-RULE8-001", "EVT-RULE8-002", "EVT-RULE8-003", "EVT-RULE8-004"],
    evidence_quality: "High",
    investigation_status: "New",
    score_breakdown: {
      base_weight: 25,
      contextual_contributions: [
        { name: "Multi-Stage Correlation", weight: 35, reason: "Failed login immediately followed by successful entry and privilege escalation" },
        { name: "Critical Role Target", weight: 35, reason: "Target role 'superadmin' possesses total environment privileges" }
      ],
      final_score: 95,
      severity: "Critical",
      calculation_summary: "Base weight: 25 (RULE-008); +35 from Multi-Stage Correlation; +35 from Critical Role Target -> Final Score: 95 [Critical]"
    }
  },
  {
    alert_id: "ALT-RULE2-001",
    timestamp: "2026-10-10T11:20:00Z",
    actor: "attacker_svc",
    target_user: "backdoor_admin",
    action: "create_user",
    resource: "ActiveDirectory:Users",
    source_ip: "10.0.0.5",
    rule_id: "RULE-002",
    rule_name: "Administrator Account Creation",
    risk_score: 85,
    severity: "Critical",
    explanation: "Actor 'attacker_svc' created new administrative identity 'backdoor_admin' with elevated role 'administrator'.",
    evidence: {
      actor: "attacker_svc",
      created_account: "backdoor_admin",
      assigned_role: "administrator",
      action: "create_user"
    },
    recommended_actions: [
      "Confirm whether new administrator onboarding was scheduled in directory services.",
      "Verify identity proofing and credentials provisioning channel.",
      "Check for immediate anomalous logins from new account."
    ],
    related_event_ids: ["EVT-RULE2-001"],
    evidence_quality: "High",
    investigation_status: "Under Investigation",
    score_breakdown: {
      base_weight: 65,
      contextual_contributions: [
        { name: "Immediate Admin Assignment", weight: 10, reason: "Account was provisioned directly with administrator-level rights" },
        { name: "Service Principal Creator", weight: 10, reason: "Created non-interactively via service account" }
      ],
      final_score: 85,
      severity: "Critical",
      calculation_summary: "Base weight: 65 (RULE-002); +10 from Immediate Admin Assignment; +10 from Service Principal Creator -> Final Score: 85 [Critical]"
    }
  },
  {
    alert_id: "ALT-RULE3-001",
    timestamp: "2026-10-10T11:45:00Z",
    actor: "operator_jim",
    target_user: "david_contractor",
    action: "add_member",
    resource: "Domain Admins",
    source_ip: "10.10.1.50",
    rule_id: "RULE-003",
    rule_name: "Privileged Group Membership Addition",
    risk_score: 75,
    severity: "High",
    explanation: "Actor 'operator_jim' assigned identity 'david_contractor' into privileged group 'Domain Admins'.",
    evidence: {
      actor: "operator_jim",
      target_user: "david_contractor",
      privileged_group: "Domain Admins",
      action: "add_member"
    },
    recommended_actions: [
      "Audit directory group membership change logs.",
      "Confirm authorization from group owner.",
      "Temporarily restrict elevated group tokens if unexpected."
    ],
    related_event_ids: ["EVT-RULE3-001"],
    evidence_quality: "High",
    investigation_status: "New",
    score_breakdown: {
      base_weight: 55,
      contextual_contributions: [
        { name: "Critical Group Grant", weight: 20, reason: "Target group 'Domain Admins' possesses full domain/administrative rights" }
      ],
      final_score: 75,
      severity: "High",
      calculation_summary: "Base weight: 55 (RULE-003); +20 from Critical Group Grant -> Final Score: 75 [High]"
    }
  },
  {
    alert_id: "ALT-RULE1-001",
    timestamp: "2026-10-10T10:15:00Z",
    actor: "charlie_dev",
    target_user: "charlie_dev",
    action: "role_elevation",
    resource: "IAM:RoleAssignment",
    source_ip: "10.0.0.1",
    rule_id: "RULE-001",
    rule_name: "Privilege Elevation",
    risk_score: 70,
    severity: "High",
    explanation: "Actor 'charlie_dev' successfully elevated role to 'admin' from 'user'.",
    evidence: {
      actor: "charlie_dev",
      target_user: "charlie_dev",
      previous_role: "user",
      new_role: "admin",
      evidence_limitation: "None"
    },
    recommended_actions: [
      "Verify with IT/IAM if this role elevation had an approved change request or ticket.",
      "Inspect the authorizing actor and verify multi-factor authentication was validated.",
      "Review session activity immediately following the role change for unauthorized actions."
    ],
    related_event_ids: ["EVT-RULE1-001"],
    evidence_quality: "High",
    investigation_status: "Reviewed",
    score_breakdown: {
      base_weight: 55,
      contextual_contributions: [
        { name: "Standard Role Elevation", weight: 15, reason: "Transition from unprivileged user to admin" }
      ],
      final_score: 70,
      severity: "High",
      calculation_summary: "Base weight: 55 (RULE-001); +15 from Standard Role Elevation -> Final Score: 70 [High]"
    }
  },
  {
    alert_id: "ALT-RULE4-001",
    timestamp: "2026-10-10T12:30:00Z",
    actor: "eve_analyst",
    target_user: "eve_analyst",
    action: "attach_policy",
    resource: "arn:aws:iam::policy/AdministratorAccess",
    source_ip: "10.0.0.1",
    rule_id: "RULE-004",
    rule_name: "Suspicious Permission Modification",
    risk_score: 65,
    severity: "High",
    explanation: "Actor 'eve_analyst' executed permission change on 'AdministratorAccess' policy attaching full wildcard privileges.",
    evidence: {
      actor: "eve_analyst",
      target_resource: "arn:aws:iam::policy/AdministratorAccess",
      action: "attach_policy",
      new_permissions: "AdministratorAccess"
    },
    recommended_actions: [
      "Inspect updated IAM policies or ACLs for overly permissive grants.",
      "Review rollback procedures for modified policy.",
      "Check actor's recent permission modification history."
    ],
    related_event_ids: ["EVT-RULE4-001"],
    evidence_quality: "High",
    investigation_status: "New",
    score_breakdown: {
      base_weight: 35,
      contextual_contributions: [
        { name: "Privilege-Increasing Modification", weight: 30, reason: "Policy includes full administrative wildcard capabilities" }
      ],
      final_score: 65,
      severity: "High",
      calculation_summary: "Base weight: 35 (RULE-004); +30 from Privilege-Increasing Modification -> Final Score: 65 [High]"
    }
  },
  {
    alert_id: "ALT-RULE6-001",
    timestamp: "2026-10-10T14:05:00Z",
    actor: "mallory_bot",
    target_user: "admin",
    action: "admin_login",
    resource: "SSO:AdminPortal",
    source_ip: "203.0.113.42",
    rule_id: "RULE-006",
    rule_name: "Repeated Failed Administrative Access",
    risk_score: 55,
    severity: "Medium",
    explanation: "Actor 'mallory_bot' encountered 6 failed administrative access attempts within 10 minutes.",
    evidence: {
      actor: "mallory_bot",
      failure_count: 6,
      window_minutes: 10,
      source_ip: "203.0.113.42"
    },
    recommended_actions: [
      "Check if account is targeted by password spraying or brute force.",
      "Verify IP reputation and block origin IP if external/unrecognized.",
      "Enforce immediate credential reset or temporary lock if compromised."
    ],
    related_event_ids: ["EVT-RULE6-001", "EVT-RULE6-002", "EVT-RULE6-003", "EVT-RULE6-004", "EVT-RULE6-005", "EVT-RULE6-006"],
    evidence_quality: "High",
    investigation_status: "New",
    score_breakdown: {
      base_weight: 25,
      contextual_contributions: [
        { name: "High Failure Velocity", weight: 30, reason: "6 consecutive authentication failures" }
      ],
      final_score: 55,
      severity: "Medium",
      calculation_summary: "Base weight: 25 (RULE-006); +30 from High Failure Velocity -> Final Score: 55 [Medium]"
    }
  },
  {
    alert_id: "ALT-RULE7-001",
    timestamp: "2026-10-10T15:08:00Z",
    actor: "kevin_devops",
    target_user: "kevin_devops",
    action: "role_permission_update_4",
    resource: "K8s:RoleBinding_4",
    source_ip: "10.0.0.5",
    rule_id: "RULE-007",
    rule_name: "Multiple Privilege-Related Events in Burst",
    risk_score: 45,
    severity: "Medium",
    explanation: "Actor 'kevin_devops' triggered 4 privilege-modifying events within a 15-minute time window.",
    evidence: {
      actor: "kevin_devops",
      event_count: 4,
      window_minutes: 15
    },
    recommended_actions: [
      "Check if actor is running an automated deployment script or provisioning run.",
      "Interview actor regarding batch administration tasks.",
      "Review all actions taken during time burst."
    ],
    related_event_ids: ["EVT-RULE7-001", "EVT-RULE7-002", "EVT-RULE7-003", "EVT-RULE7-004"],
    evidence_quality: "High",
    investigation_status: "New",
    score_breakdown: {
      base_weight: 20,
      contextual_contributions: [
        { name: "Privilege Velocity Burst", weight: 25, reason: "4 privileged modifications in rapid succession" }
      ],
      final_score: 45,
      severity: "Medium",
      calculation_summary: "Base weight: 20 (RULE-007); +25 from Privilege Velocity Burst -> Final Score: 45 [Medium]"
    }
  },
  {
    alert_id: "ALT-RULE9-001",
    timestamp: "2026-10-10T17:10:00Z",
    actor: "zoe_admin",
    target_user: "zoe_admin",
    action: "grant_role",
    resource: "CloudConsole:IAM",
    source_ip: "198.51.100.77",
    rule_id: "RULE-009",
    rule_name: "Unfamiliar IP Address During Privilege Change",
    risk_score: 40,
    severity: "Medium",
    explanation: "Actor 'zoe_admin' executed administrative action 'grant_role' from unfamiliar source IP '198.51.100.77' not in baseline authorized IP set. Contextual indicator.",
    evidence: {
      actor: "zoe_admin",
      action: "grant_role",
      source_ip: "198.51.100.77",
      baseline_policy: "Compared against configured enterprise IP baseline"
    },
    recommended_actions: [
      "Inspect IP geolocation, ASN, and VPN/proxy indicators.",
      "Check whether user is travelling or using an unauthorized remote workstation.",
      "Verify user session MFA verification logs for that source IP."
    ],
    related_event_ids: ["EVT-RULE9-001"],
    evidence_quality: "Medium",
    investigation_status: "New",
    score_breakdown: {
      base_weight: 20,
      contextual_contributions: [
        { name: "Anomalous Source IP", weight: 20, reason: "IP '198.51.100.77' is outside familiar enterprise baseline" }
      ],
      final_score: 40,
      severity: "Medium",
      calculation_summary: "Base weight: 20 (RULE-009); +20 from Anomalous Source IP -> Final Score: 40 [Medium]"
    }
  },
  {
    alert_id: "ALT-RULE5-001",
    timestamp: "2026-10-11T02:15:00Z",
    actor: "frank_backup",
    target_user: "root",
    action: "sudo_elevation",
    resource: "/etc/sudoers",
    source_ip: "10.0.0.1",
    rule_id: "RULE-005",
    rule_name: "After-Hours Administrative Activity",
    risk_score: 25,
    severity: "Low",
    explanation: "Actor 'frank_backup' executed administrative activity 'sudo_elevation' outside business hours (Sunday 02:15 UTC). Contextual indicator.",
    evidence: {
      actor: "frank_backup",
      timestamp_utc: "2026-10-11T02:15:00Z",
      weekday: "Sunday",
      hour_utc: 2,
      context_note: "Outside Mon-Fri 09:00-18:00 UTC schedule"
    },
    recommended_actions: [
      "Cross-reference maintenance windows or on-call schedules.",
      "Verify actor's physical or VPN login location during this time.",
      "Contact user to verify out-of-band operational activity."
    ],
    related_event_ids: ["EVT-RULE5-001"],
    evidence_quality: "Medium",
    investigation_status: "False Positive",
    score_breakdown: {
      base_weight: 15,
      contextual_contributions: [
        { name: "Off-Hours Execution", weight: 10, reason: "Operation performed during non-business hours / weekend" }
      ],
      final_score: 25,
      severity: "Low",
      calculation_summary: "Base weight: 15 (RULE-005); +10 from Off-Hours Execution -> Final Score: 25 [Low]"
    }
  }
];

export const MOCK_SUMMARY = {
  total_events: 125,
  suspicious_alerts: 9,
  critical_high_alerts: 5,
  affected_users: 8,
  processing_success_rate: 100.0,
  severity_distribution: {
    Critical: 2,
    High: 3,
    Medium: 3,
    Low: 1
  },
  rule_frequency: [
    { rule: "Suspicious Multi-Stage Sequence Correlation", count: 1, rule_id: "RULE-008" },
    { rule: "Administrator Account Creation", count: 1, rule_id: "RULE-002" },
    { rule: "Privileged Group Membership Addition", count: 1, rule_id: "RULE-003" },
    { rule: "Privilege Elevation", count: 1, rule_id: "RULE-001" },
    { rule: "Suspicious Permission Modification", count: 1, rule_id: "RULE-004" },
    { rule: "Repeated Failed Administrative Access", count: 1, rule_id: "RULE-006" },
    { rule: "Multiple Privilege-Related Events in Burst", count: 1, rule_id: "RULE-007" },
    { rule: "Unfamiliar IP Address During Privilege Change", count: 1, rule_id: "RULE-009" },
    { rule: "After-Hours Administrative Activity", count: 1, rule_id: "RULE-005" }
  ],
  top_affected_users: [
    { user: "infiltrator_x", alert_count: 1 },
    { user: "backdoor_admin", alert_count: 1 },
    { user: "david_contractor", alert_count: 1 },
    { user: "charlie_dev", alert_count: 1 },
    { user: "eve_analyst", alert_count: 1 },
    { user: "admin", alert_count: 1 },
    { user: "kevin_devops", alert_count: 1 },
    { user: "zoe_admin", alert_count: 1 }
  ],
  timeline_overview: [
    { time: "2026-10-10 09:00", events: 15, alerts: 0 },
    { time: "2026-10-10 10:00", events: 18, alerts: 1 },
    { time: "2026-10-10 11:00", events: 20, alerts: 2 },
    { time: "2026-10-10 12:00", events: 16, alerts: 1 },
    { time: "2026-10-10 13:00", events: 14, alerts: 0 },
    { time: "2026-10-10 14:00", events: 18, alerts: 1 },
    { time: "2026-10-10 15:00", events: 12, alerts: 1 },
    { time: "2026-10-10 16:00", events: 10, alerts: 2 },
    { time: "2026-10-11 02:00", events: 2, alerts: 1 }
  ],
  risk_distribution: {
    "0-20": 0,
    "21-40": 2,
    "41-60": 2,
    "61-80": 3,
    "81-100": 2
  },
  processing_stats: {
    total_records: 125,
    accepted_records: 125,
    rejected_records: 0,
    duplicate_records: 0,
    success_rate: 100.0,
    errors: []
  },
  dataset_name: "PrivilegeGuard Synthetic Enterprise Baseline",
  analyzed_at: "2026-10-10T09:30:00Z"
};

export const MOCK_USER_RISKS = [
  {
    actor: "infiltrator_x",
    alert_count: 1,
    highest_risk_score: 95,
    highest_severity: "Critical",
    common_actions: ["login", "assign_role"],
    recent_event_time: "2026-10-10T16:09:00Z",
    related_alert_ids: ["ALT-RULE8-001"],
    source_ips: ["198.51.100.99"],
    severity_breakdown: { Critical: 1 }
  },
  {
    actor: "attacker_svc",
    alert_count: 1,
    highest_risk_score: 85,
    highest_severity: "Critical",
    common_actions: ["create_user"],
    recent_event_time: "2026-10-10T11:20:00Z",
    related_alert_ids: ["ALT-RULE2-001"],
    source_ips: ["10.0.0.5"],
    severity_breakdown: { Critical: 1 }
  },
  {
    actor: "operator_jim",
    alert_count: 1,
    highest_risk_score: 75,
    highest_severity: "High",
    common_actions: ["add_member"],
    recent_event_time: "2026-10-10T11:45:00Z",
    related_alert_ids: ["ALT-RULE3-001"],
    source_ips: ["10.10.1.50"],
    severity_breakdown: { High: 1 }
  },
  {
    actor: "charlie_dev",
    alert_count: 1,
    highest_risk_score: 70,
    highest_severity: "High",
    common_actions: ["role_elevation"],
    recent_event_time: "2026-10-10T10:15:00Z",
    related_alert_ids: ["ALT-RULE1-001"],
    source_ips: ["10.0.0.1"],
    severity_breakdown: { High: 1 }
  },
  {
    actor: "eve_analyst",
    alert_count: 1,
    highest_risk_score: 65,
    highest_severity: "High",
    common_actions: ["attach_policy"],
    recent_event_time: "2026-10-10T12:30:00Z",
    related_alert_ids: ["ALT-RULE4-001"],
    source_ips: ["10.0.0.1"],
    severity_breakdown: { High: 1 }
  },
  {
    actor: "mallory_bot",
    alert_count: 1,
    highest_risk_score: 55,
    highest_severity: "Medium",
    common_actions: ["admin_login"],
    recent_event_time: "2026-10-10T14:05:00Z",
    related_alert_ids: ["ALT-RULE6-001"],
    source_ips: ["203.0.113.42"],
    severity_breakdown: { Medium: 1 }
  },
  {
    actor: "kevin_devops",
    alert_count: 1,
    highest_risk_score: 45,
    highest_severity: "Medium",
    common_actions: ["role_permission_update_4"],
    recent_event_time: "2026-10-10T15:08:00Z",
    related_alert_ids: ["ALT-RULE7-001"],
    source_ips: ["10.0.0.5"],
    severity_breakdown: { Medium: 1 }
  },
  {
    actor: "zoe_admin",
    alert_count: 1,
    highest_risk_score: 40,
    highest_severity: "Medium",
    common_actions: ["grant_role"],
    recent_event_time: "2026-10-10T17:10:00Z",
    related_alert_ids: ["ALT-RULE9-001"],
    source_ips: ["198.51.100.77"],
    severity_breakdown: { Medium: 1 }
  },
  {
    actor: "frank_backup",
    alert_count: 1,
    highest_risk_score: 25,
    highest_severity: "Low",
    common_actions: ["sudo_elevation"],
    recent_event_time: "2026-10-11T02:15:00Z",
    related_alert_ids: ["ALT-RULE5-001"],
    source_ips: ["10.0.0.1"],
    severity_breakdown: { Low: 1 }
  }
];
