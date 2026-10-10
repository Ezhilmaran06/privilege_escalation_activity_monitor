export const HELP_CATEGORIES = [
  { id: 'all', label: 'All Topics', icon: 'LayoutGrid' },
  { id: 'quickstart', label: 'Quick Start & Checklist', icon: 'Sparkles' },
  { id: 'overview', label: 'Project Overview', icon: 'Shield' },
  { id: 'usecases', label: 'Where & Who Uses It', icon: 'Building2' },
  { id: 'workflow', label: 'How It Works (Workflow)', icon: 'GitMerge' },
  { id: 'userguide', label: 'Step-by-Step User Guide', icon: 'Compass' },
  { id: 'rules', label: 'Detection Rules Reference', icon: 'Layers' },
  { id: 'scoring', label: 'Risk Scoring Guide', icon: 'Cpu' },
  { id: 'scenarios', label: 'Investigation Scenarios', icon: 'FileSearch' },
  { id: 'troubleshooting', label: 'Troubleshooting & Fixes', icon: 'Wrench' },
  { id: 'faq', label: 'Frequently Asked Questions', icon: 'HelpCircle' },
  { id: 'security', label: 'Security & Limitations', icon: 'Lock' },
  { id: 'glossary', label: 'Cybersecurity Glossary', icon: 'BookMarked' },
  { id: 'technical', label: 'Technical Reference & APIs', icon: 'Code' }
];

export const PROJECT_OVERVIEW = {
  whatIs: {
    title: "What is PrivilegeGuard?",
    content: "PrivilegeGuard is an audit-log analysis and threat triage application that helps identify potentially suspicious changes to user permissions, administrator accounts, and privileged group memberships.\n\nIt examines imported system audit records (CSV and JSON) using predefined security detection rules, assigns transparent, deterministic risk scores, explains why activities were flagged, and assists security analysts in investigating and documenting their findings."
  },
  problemSolved: {
    title: "What Problem Does It Solve?",
    content: "In any modern enterprise, users are granted distinct permission tiers based on their organizational roles. When an ordinary user account unexpectedly receives administrator privileges, sensitive systems, databases, and configuration settings become exposed to unauthorized access.\n\nPrivilegeGuard processes large, complex audit log streams, normalizes disparate fields into a canonical schema, and surfaces anomalous access grants with explainable evidence so analysts can quickly review what changed, who authorized it, and whether immediate containment is necessary."
  },
  privilegeEscalation: {
    title: "What is Privilege Escalation?",
    content: "Privilege escalation occurs when an account or security principal gains access or permissions beyond its intended authorization level. In cybersecurity attacks, adversaries who compromise low-privilege accounts frequently attempt to escalate to domain admin, root, or cloud administrator.\n\nCommon examples include:\n• A standard employee account suddenly receives administrator privileges.\n• A new administrator account is provisioned without an associated IT change ticket.\n• A user is added to a sensitive group such as Domain Admins or sudo.\n• A permission escalation event occurs immediately following multiple failed login attempts.\n\nContext matters: These activities may be completely legitimate during scheduled IT maintenance, or they may indicate active adversary reconnaissance and lateral movement."
  },
  whyImportant: {
    title: "Why is This Project Important?",
    benefits: [
      { title: "Rapid Threat Visibility", desc: "Instantly surfaces unauthorized administrative assignments hidden within thousands of routine audit events." },
      { title: "Explainable Risk Scoring", desc: "Calculates deterministic, transparent scores (0–100) with clear evidence breakdowns rather than opaque black-box assertions." },
      { title: "Reduced Analyst Fatigue", desc: "Correlates multi-event sequences (e.g., brute force followed by role grant) into unified, prioritized incident alerts." },
      { title: "Audit & Compliance Ready", desc: "Generates downloadable CSV spreadsheets, JSON audit summaries, and executive PDF reports for management and auditors." },
      { title: "Educational & Accessible", desc: "Provides cybersecurity students and junior analysts with hands-on practice analyzing realistic attack telemetry." }
    ]
  }
};

export const USE_CASES = [
  {
    id: "it-dept",
    title: "1. IT Departments",
    whoUses: "IT Managers, Helpdesk Supervisors, Systems Administrators",
    problem: "Tracking administrative access requests and auditing account creations across disparate servers.",
    howHelps: "Ingests weekly or monthly identity audit files and highlights every role change and group addition for review against ticketing systems.",
    example: "Verifying whether 3 new local administrator accounts created over the weekend had approved Jira Service Management tickets.",
    scopeNote: "Analyzes uploaded log files; does not continuously poll on-premises Active Directory without ingestion."
  },
  {
    id: "soc-analysts",
    title: "2. Security Operations Centers (SOC)",
    whoUses: "Tier-1 and Tier-2 SOC Analysts, Threat Hunters",
    problem: "Sifting through voluminous authentication logs to prioritize genuine privilege elevation threats over routine logins.",
    howHelps: "Applies multi-rule correlation (e.g., Rule 8) to flag high-velocity failed logins followed by immediate role assumption with Critical severity.",
    example: "Triaging an alert where an unfamiliar IP address was used to elevate an IAM role at 02:00 AM on a Sunday.",
    scopeNote: "Provides prioritized investigation candidates to be corroborated with network packet captures and EDR telemetry."
  },
  {
    id: "sysadmins",
    title: "3. System Administrators",
    whoUses: "Linux Sysadmins, Windows Server Administrators, Cloud Ops",
    problem: "Ensuring sudoers files, Windows local administrators, and root group memberships remain tightly controlled.",
    howHelps: "Detects additions to privileged groups (Rule 3) and direct sudo elevation commands executed outside standard business hours.",
    example: "Validating that an unexpected addition to the 'wheel' group was performed by an authorized colleague during maintenance.",
    scopeNote: "Relies on system audit logs (such as auditd or Windows Event 4728) supplied to the ingestion interface."
  },
  {
    id: "iam-teams",
    title: "4. Identity & Access Management (IAM)",
    whoUses: "IAM Engineers, Cloud Security Architects, Directory Admins",
    problem: "Detecting permission creep and wildcard policy attachments in AWS IAM, Azure RBAC, or Okta directories.",
    howHelps: "Identifies permission modifications (Rule 4) that grant wildcard (*) administrative policies or elevate standard users.",
    example: "Detecting an AWS IAM policy modification that attached 'AdministratorAccess' to a junior developer's role.",
    scopeNote: "Processes exported CloudTrail or IAM audit logs; does not directly modify cloud IAM policies."
  },
  {
    id: "education",
    title: "5. Educational Institutions & Cyber Labs",
    whoUses: "Cybersecurity Students, University Instructors, Hackathon Teams",
    problem: "Commercial SIEM solutions (Splunk, Sentinel) are expensive, complex to configure, and require cloud licenses for lab exercises.",
    howHelps: "Provides a zero-cost, fully local full-stack platform with synthetic benchmark data demonstrating real privilege escalation rules.",
    example: "Students inspect how failed login brute-force attempts connect to account takeover in the chronological activity timeline.",
    scopeNote: "Designed for educational labs, demonstration prototypes, and offline hackathon presentations."
  },
  {
    id: "small-orgs",
    title: "6. Small Organizations & Nonprofits",
    whoUses: "Solo IT Technicians, Security Officers in SMBs",
    problem: "Limited cybersecurity budgets make enterprise SIEM licenses cost-prohibitive, leaving audit logs unreviewed.",
    howHelps: "Enables periodic local reviews of audit logs on an analyst laptop with zero cloud fees, zero vendor lock-in, and 100% data privacy.",
    example: "A local clinic exports server logs monthly and runs PrivilegeGuard to verify that only authorized staff hold admin rights.",
    scopeNote: "Operates as an audit analysis prototype and should be augmented with automated backup solutions."
  }
];

export const USER_PERSONAS = [
  {
    role: "Security Analysts",
    icon: "ShieldAlert",
    purpose: "Triage high-priority alerts, investigate evidence breakdowns, change investigation status, and export compliance reports.",
    beginnerTip: "Focus on Critical and High severity alerts first. Look at the score breakdown to understand why an alert fired.",
    advancedDetails: "Check correlated event IDs in the evidence payload and inspect temporal rolling windows in the detection engine."
  },
  {
    role: "IT Administrators",
    icon: "Server",
    purpose: "Validate that recorded administrative activities correspond to scheduled maintenance tickets and approved change requests.",
    beginnerTip: "Use the Actor and Target filters to review specific employees undergoing role transitions.",
    advancedDetails: "Cross-reference the canonical schema fields (previous_role, new_role, resource) with directory service change logs."
  },
  {
    role: "IAM Engineers",
    icon: "KeyRound",
    purpose: "Audit privileged group additions (Domain Admins, sudo) and identify excessive permission grants across resources.",
    beginnerTip: "Review Rule 3 and Rule 4 alerts to ensure the principle of least privilege is enforced.",
    advancedDetails: "Inspect wildcard capabilities in the evidence dictionary to prevent lateral movement risks."
  },
  {
    role: "Cybersecurity Students",
    icon: "GraduationCap",
    purpose: "Learn how authentication events, role assignments, and heuristic detection engines work together in a SOC environment.",
    beginnerTip: "Load the Synthetic Benchmark Dataset and walk through the 8 Quick Start steps to learn SOC workflows.",
    advancedDetails: "Study the Pandas detection engine implementation in detection_engine.py and risk_scoring.py."
  },
  {
    role: "Security Auditors",
    icon: "FileCheck",
    purpose: "Review historical audit analyses, verify schema normalization rates, and export executive PDF summaries for compliance.",
    beginnerTip: "Navigate to Reports & Export to download audit documentation in CSV, JSON, or PDF formats.",
    advancedDetails: "Inspect the SQLite persistence tables (analyses, alerts, status_history) for tamper-evident audit trails."
  },
  {
    role: "Hackathon Judges & Demonstrators",
    icon: "Award",
    purpose: "Evaluate system architecture, explainable scoring transparency, dual Demo/API modes, and user interface polish.",
    beginnerTip: "Follow the 3-minute demonstration script in the README to evaluate the core problem, dashboard, and investigation flow.",
    advancedDetails: "Verify that all metrics are computed from actual processed data with zero fake hardcoded simulations."
  }
];

export const WORKFLOW_STEPS = [
  {
    step: 1,
    title: "Import Audit Logs",
    desc: "Analysts upload CSV or JSON audit logs via drag-and-drop or load the pre-configured synthetic benchmark dataset.",
    tech: "FastAPI multipart/form-data upload with 10 MB size and 100,000 row bounds."
  },
  {
    step: 2,
    title: "Validate Input",
    desc: "The parser checks file integrity, enforces size limits, verifies non-empty payloads, and ensures safe parsing.",
    tech: "Python csv.Sniffer dialect detection, safe JSON parsing, and UTF-8 / Latin-1 encoding fallbacks."
  },
  {
    step: 3,
    title: "Normalize Events",
    desc: "Disparate aliases (e.g., username -> actor, time -> timestamp, result -> status) are mapped into a standardized canonical schema.",
    tech: "CanonicalEvent schema in Pydantic with UTC timezone-aware datetime parsing."
  },
  {
    step: 4,
    title: "Execute Detection Engine",
    desc: "Pandas processes the event stream, sorting events temporally and applying 9 deterministic cybersecurity detection rules.",
    tech: "Pandas DataFrames, rolling time windows (10-min, 15-min, 30-min), and correlation masks."
  },
  {
    step: 5,
    title: "Calculate Transparent Risk",
    desc: "Each alert receives a bounded risk score (0–100) based on base rule weights and justified contextual modifiers.",
    tech: "Deterministic risk_scoring.py formula: min(100, base + context) with deduplication."
  },
  {
    step: 6,
    title: "Generate Explainable Alerts",
    desc: "Alerts are classified into Critical, High, Medium, or Low severity tiers with structured evidence and analyst recommendations.",
    tech: "DetectionAlert model with evidence dictionaries, related event IDs, and confidence levels."
  },
  {
    step: 7,
    title: "Investigate & Update Status",
    desc: "Analysts triage alerts in the slide-out investigation drawer, review related events, and update investigation statuses.",
    tech: "React Context, PATCH /api/alerts/{id}/status endpoint, and optional SQLite persistence."
  },
  {
    step: 8,
    title: "Export Audit Reports",
    desc: "Download forensic CSV spreadsheets, machine-readable JSON summaries, or executive PDF compliance reports.",
    tech: "ReportLab PDF generation, RFC 4180 CSV writers, and browser Blob download handling."
  }
];

export const STEP_BY_STEP_GUIDE = [
  {
    step: "Step 1",
    title: "Explore the Overview Dashboard",
    content: "The dashboard provides an instant high-level overview of your security posture:\n• Total Events Analyzed: Count of all valid canonical audit events.\n• Suspicious Activities: Number of alerts triggered across all detection rules.\n• Critical & High-Risk Alerts: High-impact alerts requiring priority triage.\n• Affected Identities: Unique actors and target accounts involved in detections.\n• Ingestion Success Rate: Percentage of raw records successfully parsed into canonical schema (measures data formatting quality, not detection accuracy).\n\nVisualizations include a Severity Distribution donut chart, an Activity Velocity area chart, Top Affected Identities, and Rule Detection Frequencies."
  },
  {
    step: "Step 2",
    title: "Load Demo Dataset or Upload Audit Logs",
    content: "Navigate to 'Upload Audit Logs' in the sidebar:\n• Load Synthetic Logs: Click 'Load Synthetic Logs' to instantly populate 125 benchmark events testing all 9 detection rules.\n• Upload Custom Logs: Drag and drop a CSV or JSON audit log (up to 10 MB).\n• Review File Details: Check filename and size, download sample templates if needed, and review normalized records in the live preview table.\n• Click 'Analyze Audit Logs' to execute the detection engine."
  },
  {
    step: "Step 3",
    title: "Review Event Normalization Preview",
    content: "Upon upload, the parser maps common field names into canonical schema fields:\n• actor: Principal who initiated the action (e.g., username, user, initiated_by).\n• action: Operation performed (e.g., login, role_elevation, create_user).\n• target_user: Account affected by the action.\n• source_ip: Client IP address.\n• previous_role & new_role: Prior and newly assigned permission levels.\n• status: Outcome ('success' or 'failure').\n• resource: Target service, group, or cloud resource."
  },
  {
    step: "Step 4",
    title: "Filter and Sort Threat Detections",
    content: "Navigate to 'Threat Detections' to review the interactive alert table:\n• Filter by Severity: Isolate 'Critical' or 'High' alerts for immediate response.\n• Filter by Status: Filter by 'New', 'Under Investigation', 'Reviewed', or 'False Positive'.\n• Search: Enter actor names, rules, or IP addresses into the search bar.\n• Sort: Sort by Risk Score (highest first) or Timestamp.\n• Click 'Details' on any row to open the full investigation drawer."
  },
  {
    step: "Step 5",
    title: "Investigate an Alert (Synthetic Example)",
    content: "When inspecting an alert in the slide-out drawer, examine:\n• Threat Explanation: Plain-language summary of what happened.\n• Transparent Risk Calculation: Shows the exact math (e.g., Base Weight 55 for RULE-001 + 15 for Standard Role Elevation = Final Score 70 [High]).\n• Event Details: Exact actor, target, timestamp, and source IP.\n• Structured Evidence: Raw JSON payload extracted from the audit log.\n• Correlated Event IDs: Clickable references to related events.\n• Recommended Actions: Practical SOC response steps (e.g., verify change ticket, validate MFA).\n• Status Control: Update status from 'New' to 'Under Investigation' or 'Reviewed'."
  },
  {
    step: "Step 6",
    title: "Inspect the Chronological Activity Timeline",
    content: "Navigate to 'Activity Timeline' to view the sequential progression of events:\n• Trace what happened before and after a suspicious privilege change.\n• Spot patterns such as failed authentication attempts leading up to a role modification.\n• Filter the timeline stream by severity tier or search for a specific user."
  },
  {
    step: "Step 7",
    title: "Analyze User Risk Profiles",
    content: "Navigate to 'User Risk Analysis' to prioritize accounts exhibiting anomalous patterns:\n• View max risk score, highest severity, alert counts, and observed source IPs for each identity.\n• Click 'Profile' to open the identity drawer with complete activity history.\n• Note: User risk profiles are an analyst prioritization aid, never proof of malicious intent."
  },
  {
    step: "Step 8",
    title: "Generate and Download Reports",
    content: "Navigate to 'Reports & Export':\n• Threat Alerts CSV: Comprehensive spreadsheet for spreadsheet analysis or ticketing.\n• Audit JSON Summary: Structured metadata and alert previews for SIEM ingestion.\n• Executive PDF Report: Professionally styled executive summary document with tables, recommendations, and formal disclaimers."
  }
];

export const DETECTION_RULES_REFERENCE = [
  {
    id: "RULE-001",
    name: "Privilege Elevation",
    weight: 55,
    category: "Privilege Escalation",
    status: "Implemented & Active",
    detects: "Successful role changes transitioning from a standard user role to an elevated administrative or root role.",
    example: "User 'charlie_dev' changes role from 'user' to 'admin' via IAM:RoleAssignment.",
    whyMatters: "Direct role elevation grants widespread access to systems. If unauthorized, it indicates a critical compromise.",
    evidenceRequired: "Previous role ('user', 'standard_user'), new role ('admin', 'administrator', 'root'), and successful status.",
    limitations: "If the log omits previous_role, evidence quality is reduced to Medium and the limitation is clearly stated.",
    investigationSteps: [
      "Check if an approved change management ticket exists for this role change.",
      "Verify whether multi-factor authentication was validated for the authorizing actor.",
      "Inspect session activity immediately following the elevation for unauthorized actions."
    ]
  },
  {
    id: "RULE-002",
    name: "Administrator Account Creation",
    weight: 65,
    category: "Persistence / Account Creation",
    status: "Implemented & Active",
    detects: "Direct creation of a new user account that receives administrator-level rights upon provisioning.",
    example: "Service account 'attacker_svc' executes 'create_user' for 'backdoor_admin' with role 'administrator'.",
    whyMatters: "Adversaries frequently create rogue administrative accounts to maintain persistence after an initial intrusion.",
    evidenceRequired: "User creation action, newly provisioned username, and administrative role assignment.",
    limitations: "Legitimate user onboarding can trigger this rule; must be verified against HR directory requests.",
    investigationSteps: [
      "Confirm whether new administrator onboarding was scheduled in directory services.",
      "Verify the credential provisioning channel and identity verification records.",
      "Check for immediate anomalous logins from the newly created account."
    ]
  },
  {
    id: "RULE-003",
    name: "Privileged Group Membership Addition",
    weight: 55,
    category: "Privilege Escalation",
    status: "Implemented & Active",
    detects: "Addition of an identity into sensitive administrative groups such as Administrators, Domain Admins, sudo, or wheel.",
    example: "Operator 'operator_jim' adds contractor 'david_contractor' to the 'Domain Admins' group.",
    whyMatters: "Group-based access bypasses individual role limits and often grants domain-wide administrative privileges.",
    evidenceRequired: "Group addition action, target identity, and recognized privileged group name.",
    limitations: "Group removals are ignored by this rule to prevent false positives on security de-provisioning.",
    investigationSteps: [
      "Audit directory service group membership modification logs.",
      "Confirm authorization from the designated privileged group owner.",
      "Temporarily restrict elevated group tokens if the addition was unapproved."
    ]
  },
  {
    id: "RULE-004",
    name: "Suspicious Permission Modification",
    weight: 35,
    category: "Policy Modification",
    status: "Implemented & Active",
    detects: "IAM policy or ACL changes granting elevated or wildcard capabilities (e.g., AdministratorAccess, full wildcard *).",
    example: "Analyst 'eve_analyst' modifies IAM policy attaching full wildcard AdministratorAccess.",
    whyMatters: "Overly permissive wildcard policies violate least privilege and can allow data exfiltration or infrastructure deletion.",
    evidenceRequired: "Policy modification action, affected resource name, and granted permission level.",
    limitations: "Policy edits that do not increase privilege are scored lower with 0 contextual modifier.",
    investigationSteps: [
      "Inspect updated IAM policies for overly permissive wildcard grants (*).",
      "Review rollback procedures and version history for the modified policy.",
      "Check the actor's recent policy modification history for unauthorized changes."
    ]
  },
  {
    id: "RULE-005",
    name: "After-Hours Administrative Activity",
    weight: 15,
    category: "Anomalous Behavior",
    status: "Implemented & Active",
    detects: "Administrative operations performed outside configured business hours (Monday–Friday 09:00–18:00 UTC).",
    example: "User 'frank_backup' executes sudo root elevation on Sunday at 02:15 AM UTC.",
    whyMatters: "Attackers frequently operate during off-hours to avoid detection by security monitoring staff.",
    evidenceRequired: "Administrative action or elevated role, UTC timestamp falling outside business hours or on weekends.",
    limitations: "Contextual indicator only. Legitimate maintenance windows and global on-call engineers frequently work off-hours.",
    investigationSteps: [
      "Cross-reference scheduled maintenance windows and on-call engineer rosters.",
      "Verify the actor's physical or VPN login location during the off-hours period.",
      "Contact the user to verify out-of-band operational activity."
    ]
  },
  {
    id: "RULE-006",
    name: "Repeated Failed Administrative Access",
    weight: 25,
    category: "Credential Access / Brute Force",
    status: "Implemented & Active",
    detects: "At least 5 failed administrative access or login attempts within a rolling 10-minute window for an actor.",
    example: "Actor 'mallory_bot' triggers 6 failed login attempts to the admin portal in 6 minutes.",
    whyMatters: "High failure velocity indicates password spraying, brute force attacks, or credential stuffing.",
    evidenceRequired: "At least 5 failure events for the same actor within 10 minutes.",
    limitations: "User forgetting a complex password can trigger this rule; origin IP must be evaluated.",
    investigationSteps: [
      "Check if the account is targeted by password spraying across multiple IPs.",
      "Verify origin IP reputation and block the IP if external or unrecognized.",
      "Enforce immediate credential reset or temporary lock if compromise is suspected."
    ]
  },
  {
    id: "RULE-007",
    name: "Multiple Privilege-Related Events in Burst",
    weight: 20,
    category: "Rapid Escalation",
    status: "Implemented & Active",
    detects: "At least 3 privilege-related operations performed by the same actor within a 15-minute time window.",
    example: "Actor 'kevin_devops' updates 4 role bindings and cluster permissions within 8 minutes.",
    whyMatters: "Rapid bursts of privilege changes may indicate automated exploit scripts expanding access rapidly.",
    evidenceRequired: "3 or more privilege events associated with the same actor within 15 minutes.",
    limitations: "Legitimate DevOps automation scripts and CI/CD provisioning pipelines frequently execute in bursts.",
    investigationSteps: [
      "Check if the actor is executing an automated deployment pipeline or terraform run.",
      "Interview the actor regarding batch administration tasks.",
      "Review all actions taken during the time burst for unauthorized commands."
    ]
  },
  {
    id: "RULE-008",
    name: "Suspicious Multi-Stage Sequence Correlation",
    weight: 25,
    category: "Complex Escalation Sequence",
    status: "Implemented & Active",
    detects: "A 3-stage kill-chain correlation: Failed login -> Successful login -> Privilege elevation within 30 minutes.",
    example: "Actor 'infiltrator_x' encounters 2 failed logins, logs in successfully, and assigns 'superadmin' in 9 minutes.",
    whyMatters: "High confidence indicator of account takeover or compromised credentials followed by immediate privilege acquisition.",
    evidenceRequired: "Temporal sequence: Failure event + subsequent successful login + subsequent role elevation within 30 minutes.",
    limitations: "Legitimate users who mistype a password and then legitimately elevate for a task can trigger this sequence.",
    investigationSteps: [
      "High Priority: Initiate incident triage protocol for potential account takeover.",
      "Revoke active web tokens, Kerberos tickets, and SAML sessions for involved accounts.",
      "Isolate affected endpoints and review network telemetry for data exfiltration."
    ]
  },
  {
    id: "RULE-009",
    name: "Unfamiliar IP Address During Privilege Change",
    weight: 20,
    category: "Anomalous Origin",
    status: "Implemented & Active",
    detects: "Administrative operations originating from an IP address outside the enterprise baseline authorized IP set.",
    example: "User 'zoe_admin' executes role elevation from external unrecognized IP '198.51.100.77'.",
    whyMatters: "Access changes originating from unfamiliar external IPs often indicate stolen session tokens or VPN bypass.",
    evidenceRequired: "Valid source IP on an administrative event that is absent from the baseline IP set.",
    limitations: "A new IP is contextual evidence, not proof of an attack. Remote workers on travel often use new IPs.",
    investigationSteps: [
      "Inspect IP geolocation, ASN, and VPN/proxy/Tor exit node indicators.",
      "Check whether the user is travelling or authorized to use a remote workstation.",
      "Verify user session multi-factor authentication (MFA) verification logs for that source IP."
    ]
  }
];

export const RISK_SCORING_GUIDE = {
  formula: "Final Score = min(100, Base Rule Weight + Sum(Contextual Contributions))",
  severityTable: [
    { severity: "Critical", range: "85 – 100", action: "Immediate containment, session revocation, and priority escalation." },
    { severity: "High", range: "65 – 84", action: "Same-day investigation, ticket reconciliation, and MFA validation." },
    { severity: "Medium", range: "35 – 64", action: "Review during routine queue triage; corroborate with secondary logs." },
    { severity: "Low", range: "0 – 34", action: "Informational or contextual anomaly; no immediate action required." }
  ],
  principles: [
    { title: "Deterministic Calculation", desc: "Every score is reproducible based on fixed rule weights and discrete context modifiers." },
    { title: "No Penalty for Missing Data", desc: "Missing optional fields (e.g., source IP) lower evidence quality rather than arbitrarily inflating risk." },
    { title: "Modifier Deduplication", desc: "Multiple occurrences of the same context factor are deduplicated to prevent score inflation." },
    { title: "Contextual Evidence Cap", desc: "Scores are strictly capped at 100 with clear notes when raw sums exceed the maximum." }
  ],
  syntheticExample: {
    alertId: "ALT-RULE1-001 (Privilege Elevation)",
    actor: "charlie_dev",
    baseRule: "RULE-001 (Privilege Elevation) = +55",
    contextModifiers: [
      "+15 from Standard Role Elevation (Transition from unprivileged user to admin)"
    ],
    calculation: "55 (Base) + 15 (Context) = 70",
    finalScore: 70,
    severity: "High"
  }
};

export const COMMON_SCENARIOS = [
  {
    id: "scenario-a",
    name: "Scenario A: Unexpected Administrator Privileges",
    rule: "RULE-001 (Privilege Elevation)",
    situation: "A standard employee account ('charlie_dev') is observed elevating from 'user' to 'admin'.",
    expectedAlert: "High Severity alert with risk score 70.",
    evidenceToInspect: "Previous role ('user'), new role ('admin'), authorizing actor, and source IP.",
    suggestedSteps: "Verify IT change management records for approved promotion or temporary elevated access grant.",
    limitations: "If previous_role was omitted in the logs, evidence quality is reduced to Medium."
  },
  {
    id: "scenario-b",
    name: "Scenario B: Repeated Failed Logins",
    rule: "RULE-006 (Repeated Failed Administrative Access)",
    situation: "Account 'mallory_bot' fails authentication 6 times within 6 minutes on the admin portal.",
    expectedAlert: "Medium Severity alert with risk score 55.",
    evidenceToInspect: "Failure count (6), 10-minute window, and origin IP address.",
    suggestedSteps: "Check if the source IP is external. Determine if password spraying is targeting other accounts.",
    limitations: "A legitimate employee who forgot a password update can trigger this alert."
  },
  {
    id: "scenario-c",
    name: "Scenario C: New Administrator Account Creation",
    rule: "RULE-002 (Administrator Account Creation)",
    situation: "Service principal 'attacker_svc' creates 'backdoor_admin' directly with administrator rights.",
    expectedAlert: "Critical Severity alert with risk score 85.",
    evidenceToInspect: "Created username, assigning actor, creation timestamp, and role assignment.",
    suggestedSteps: "Verify whether the account was provisioned via an authorized HR onboarding pipeline.",
    limitations: "Legitimate automated provisioning scripts can trigger this rule if not pre-allowlisted."
  },
  {
    id: "scenario-d",
    name: "Scenario D: After-Hours Permission Change",
    rule: "RULE-005 (After-Hours Administrative Activity)",
    situation: "Administrator 'frank_backup' performs sudo elevation on Sunday at 02:15 AM UTC.",
    expectedAlert: "Low Severity alert with risk score 25.",
    evidenceToInspect: "Timestamp, weekday, action taken, and target resource.",
    suggestedSteps: "Cross-reference scheduled maintenance windows and on-call rotation schedules.",
    limitations: "Contextual indicator only; does not indicate malicious activity without additional suspicious factors."
  },
  {
    id: "scenario-e",
    name: "Scenario E: Multi-Stage Sequence Correlation",
    rule: "RULE-008 (Suspicious Multi-Stage Sequence Correlation)",
    situation: "Actor 'infiltrator_x' encounters 2 failed logins, logs in successfully, and assumes 'superadmin' in 9 minutes.",
    expectedAlert: "Critical Severity alert with risk score 95.",
    evidenceToInspect: "The 3 sequential events: failure timestamps, successful auth timestamp, and role grant.",
    suggestedSteps: "High Priority: Revoke all active sessions for the account and initiate incident containment.",
    limitations: "Users who mistype their password before legitimate work can trigger this sequence."
  },
  {
    id: "scenario-f",
    name: "Scenario F: Legitimate Administrative Maintenance",
    rule: "RULE-004 (Permission Modification)",
    situation: "An authorized sysadmin updates role permissions during an approved upgrade window.",
    expectedAlert: "Medium/High alert flagged due to elevated permission changes.",
    evidenceToInspect: "Change management ticket number, authorizer signature, and policy diff.",
    suggestedSteps: "Document ticket ID in the alert notes and update investigation status to 'Reviewed' or 'False Positive'.",
    limitations: "Rule engines cannot know business intent without human review against change records."
  }
];

export const TROUBLESHOOTING_ITEMS = [
  {
    problem: "File upload is rejected",
    cause: "File is not CSV/JSON, exceeds 10 MB limit, or is empty.",
    solution: "Ensure the file has a .csv or .json extension, is smaller than 10 MB, and contains valid records. Download the sample CSV or JSON templates for reference."
  },
  {
    problem: "Required fields are missing",
    cause: "Uploaded records lack actor (username) or action (operation) fields.",
    solution: "PrivilegeGuard requires an actor and action for every record. Use supported aliases: 'username', 'user', 'initiated_by' for actor; 'operation', 'event_type', 'activity' for action."
  },
  {
    problem: "No suspicious activity is detected",
    cause: "The uploaded logs contain routine events that do not trigger any of the 9 enabled rules.",
    solution: "This is normal for benign audit logs! Absence of alerts means no matching rule patterns were found. Click 'Load Synthetic Logs' to see benchmark attack patterns."
  },
  {
    problem: "Risk scores are lower than expected",
    cause: "The event matched a rule with a lower base weight or lacked additional contextual modifiers.",
    solution: "Review the 'Transparent Risk Calculation' in the alert details drawer. For example, After-Hours activity has a base weight of 15 because off-hours work is often benign."
  },
  {
    problem: "Dashboard charts are empty",
    cause: "No dataset has been analyzed or the active dataset has 0 events.",
    solution: "Navigate to 'Upload Audit Logs' and click 'Load Synthetic Logs' or upload a CSV file and click 'Analyze Audit Logs'."
  },
  {
    problem: "Frontend cannot connect to the backend",
    cause: "FastAPI server is not running on http://127.0.0.1:8000 or CORS is blocked.",
    solution: "Start the backend server in PowerShell: cd backend; python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000. PrivilegeGuard automatically switches to Demo Mode if the backend is offline."
  },
  {
    problem: "Report download fails",
    cause: "Browser blocked pop-up download or backend returned an error.",
    solution: "Check browser download permissions. In Live API mode, ensure backend is running. In Demo mode, downloads are handled directly via browser Blobs."
  },
  {
    problem: "Data disappears after page refresh",
    cause: "Application was running in-memory or SQLite persistence is disabled.",
    solution: "The default benchmark is automatically re-seeded upon startup. In Live API mode with ENABLE_SQLITE_PERSISTENCE=true, analyses and status changes persist across reloads."
  },
  {
    problem: "PDF export is unavailable",
    cause: "Live PDF generation requires ReportLab in the backend environment.",
    solution: "Ensure ReportLab is installed: pip install reportlab. In Demo mode, use CSV or JSON export as reliable client-side alternatives."
  },
  {
    problem: "The application flags legitimate activity",
    cause: "Rule heuristics detect elevated actions regardless of business intent.",
    solution: "This is expected! PrivilegeGuard flags potentially suspicious events. Open the alert drawer, review the change ticket, and set status to 'Reviewed' or 'False Positive'."
  },
  {
    problem: "Timestamps appear in UTC instead of local time",
    cause: "Security audit standards require UTC for cross-timezone forensic correlation.",
    solution: "PrivilegeGuard normalizes all timestamps to UTC to avoid timezone ambiguities during incident correlation."
  }
];

export const FAQS = [
  {
    q: "What is PrivilegeGuard?",
    a: "PrivilegeGuard is an audit-log analysis and threat triage application that processes system event streams to detect potentially suspicious privilege escalation, rogue administrator creations, and abnormal access modifications."
  },
  {
    q: "What is privilege escalation?",
    a: "Privilege escalation is an attack phase where an adversary gains elevated permissions (such as root, admin, or domain admin) beyond what was initially granted to their compromised account."
  },
  {
    q: "Why are administrator accounts particularly sensitive?",
    a: "Administrator accounts have permission to configure security controls, create new users, modify access policies, access sensitive databases, and delete system audit logs."
  },
  {
    q: "What audit-log formats are supported?",
    a: "PrivilegeGuard natively supports CSV files (RFC 4180) and JSON files (both arrays of event objects and objects with an 'events' key), supporting common column aliases."
  },
  {
    q: "Can I use the application without uploading my own logs?",
    a: "Yes! PrivilegeGuard includes a 125-event pre-configured Synthetic Benchmark Dataset covering all 9 detection rules. You can load it anytime with a single click."
  },
  {
    q: "Does the application monitor my computer in real time?",
    a: "No. PrivilegeGuard is an audit log ingestion and analysis prototype that inspects supplied CSV/JSON log files. It does not install an operating system agent or monitor kernel calls in real time."
  },
  {
    q: "Does a high-risk alert confirm a cyberattack?",
    a: "No. PrivilegeGuard adheres to the core operational principle: detection rules highlight potentially suspicious activity. Only an analyst reviewing business context and corroborating evidence can confirm an incident."
  },
  {
    q: "How is the risk score calculated?",
    a: "Scores are bounded between 0 and 100 using a deterministic formula: min(100, Base Rule Weight + Sum of Context Modifiers). Every alert displays its complete calculation breakdown."
  },
  {
    q: "What should I do when an alert appears?",
    a: "Open the alert details drawer, review the explanation and evidence, check for an authorized IT change ticket, follow the recommended response steps, and update the investigation status."
  },
  {
    q: "Can legitimate administrative actions trigger alerts?",
    a: "Yes. Routine maintenance such as an approved promotion or scheduled after-hours server reboot will match rule criteria. Analysts simply mark these alerts as 'Reviewed' or 'False Positive'."
  },
  {
    q: "Where are uploaded logs processed?",
    a: "By default, all log parsing, normalization, and detection execution happens locally on your machine on http://127.0.0.1:8000. No audit logs are sent to external cloud servers or paid APIs."
  },
  {
    q: "Are uploaded logs sent to external servers?",
    a: "No. The system operates 100% locally with zero external network dependencies and no third-party tracking."
  },
  {
    q: "Does the application store historical results?",
    a: "Yes. When SQLite persistence is enabled, analysis runs, alert records, and analyst investigation status history are stored in a local SQLite database (data/privilege_guard.db)."
  },
  {
    q: "Can I export the investigation results?",
    a: "Yes. You can export forensic Threat Alerts CSV files, structured Audit JSON summaries, and professionally formatted executive PDF reports."
  },
  {
    q: "Can I use this project in a college cybersecurity lab?",
    a: "Absolutely! PrivilegeGuard was specifically designed for students, educators, and hackathons to learn identity and access management security triage without expensive enterprise software."
  },
  {
    q: "Does this replace a production SIEM platform?",
    a: "No. PrivilegeGuard is an educational and forensic analysis prototype. Enterprise environments require production SIEMs (Splunk, Microsoft Sentinel) with continuous agent ingestion and 24/7 SOC staffing."
  }
];

export const GLOSSARY_TERMS = [
  { term: "Privilege Escalation", def: "The act of exploiting a bug, design flaw, or configuration oversight to gain elevated access to resources normally protected from an application or user." },
  { term: "Administrator Account", def: "A privileged user identity possessing full rights to configure systems, manage user credentials, install software, and modify security policies." },
  { term: "Privileged Group", def: "A security group (such as Domain Admins, sudo, or Administrators) whose members inherit elevated permissions across enterprise systems." },
  { term: "Role-Based Access Control (RBAC)", def: "An authorization approach where system access is restricted to authorized users based on defined organizational roles." },
  { term: "Audit Log", def: "A chronologically recorded document of system activities, logins, and permission changes providing forensic evidence of operations." },
  { term: "Authentication", def: "The security process of verifying the claimed identity of a user, device, or service (e.g., verifying a password or MFA token)." },
  { term: "Authorization", def: "The process of determining whether an authenticated identity has permission to perform a specific action on a resource." },
  { term: "Access Denied / Failure Event", def: "An audit record generated when an authentication or authorization request fails due to invalid credentials or insufficient rights." },
  { term: "Source IP Address", def: "The Internet Protocol address of the client or machine that initiated an audit event." },
  { term: "Detection Rule", def: "A defined logic pattern or heuristic used by a security engine to identify suspicious behavior in audit logs." },
  { term: "Risk Score", def: "A numerical metric (0–100) reflecting the relative priority and severity of an identified security anomaly." },
  { term: "Severity", def: "A categorical tier (Critical, High, Medium, Low) derived from the risk score to prioritize analyst response urgency." },
  { term: "False Positive", def: "A detection alert generated by legitimate, authorized activity that matched detection criteria." },
  { term: "False Negative", def: "A genuine malicious event that failed to trigger any detection rule and went unnoticed." },
  { term: "Event Correlation", def: "The analytical process of linking multiple related events across time, identity, and IP address to identify an attack sequence." },
  { term: "Baseline", def: "A profile of expected standard behavior (such as authorized enterprise IP addresses or business hours) used for comparison." },
  { term: "Security Operations Center (SOC)", def: "A centralized team and facility responsible for monitoring, detecting, analyzing, and responding to cybersecurity incidents." },
  { term: "Identity & Access Management (IAM)", def: "The security framework and policies that ensure appropriate individuals access enterprise technology resources." },
  { term: "SIEM (Security Information & Event Management)", def: "A software platform that aggregates security log data from across an enterprise for real-time analysis." },
  { term: "Incident Investigation", def: "The methodical forensic process of examining evidence, root cause, timeline, and impact of a potential security event." }
];

export const QUICK_START_CHECKLIST = [
  { id: 1, title: "1. Open the Overview Dashboard", desc: "Review the 5 metric cards and telemetry charts." },
  { id: 2, title: "2. Load Benchmark Data or Upload File", desc: "Navigate to Upload Audit Logs and load synthetic logs or select a CSV." },
  { id: 3, title: "3. Run Detection Engine Analysis", desc: "Execute multi-rule correlation across canonical events." },
  { id: 4, title: "4. Review Severity Distribution", desc: "Inspect Critical, High, Medium, and Low alert distributions." },
  { id: 5, title: "5. Investigate a Priority Alert", desc: "Open an alert drawer to review the explanation, evidence, and score math." },
  { id: 6, title: "6. Check Correlated Events", desc: "Review related event IDs in multi-stage sequence correlations." },
  { id: 7, title: "7. Update Investigation Status", desc: "Set status to 'Under Investigation' or 'Reviewed' with notes." },
  { id: 8, title: "8. Export Forensic Reports", desc: "Download Threat Alerts CSV, Audit JSON, or executive PDF report." }
];
