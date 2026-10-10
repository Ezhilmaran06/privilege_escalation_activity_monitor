# PrivilegeGuard — Privilege Escalation Activity Monitor

**T2-PS7 — Identity, Authentication & Access Management**  
**Product Branding:** PrivilegeGuard  
**Architecture:** Monorepo with React (Vite) Frontend and Python (FastAPI + Pandas) Backend  
**Status:** Full-Stack Functional Cybersecurity Incident Detection System

---

## 1. Executive Overview & Problem Statement

Administrator accounts and elevated credentials provide access to sensitive systems and crown-jewel assets. Unauthorized privilege transitions, unexpected administrator account creation, suspicious directory group membership modifications, and excessive IAM permission grants frequently indicate active privilege escalation in cyber attacks.

**PrivilegeGuard** is an enterprise-grade full-stack monitoring and triage application that ingest system audit logs (CSV and JSON), validates and normalizes event streams into a canonical schema, executes 9 configurable rule-based detection heuristics using Pandas, correlates multi-stage event sequences, and computes deterministic, explainable risk scores.

> **CRITICAL OPERATIONAL PRINCIPLE:** PrivilegeGuard identifies *potentially suspicious activity* based on rule heuristics and contextual telemetry. It does **not** claim that a rule-based detection confirms an attack. Every alert must be investigated and verified by a qualified Security Operations Center (SOC) analyst.

---

## 2. Core Detection Heuristics (The 9 Security Rules)

| Rule ID | Rule Name | Base Weight | Category | Trigger Heuristic |
|---|---|:---:|---|---|
| **RULE-001** | Privilege Elevation | 55 | Privilege Escalation | Successful transition from an ordinary role (e.g. `user`) to a privileged role (e.g. `admin`, `root`). |
| **RULE-002** | Administrator Account Creation | 65 | Persistence / Account Creation | Creation of a new user account directly granted administrative access or immediate role assignment. |
| **RULE-003** | Privileged Group Membership | 55 | Privilege Escalation | Addition of an identity into sensitive groups (e.g., `Administrators`, `Domain Admins`, `sudo`, `wheel`). |
| **RULE-004** | Permission Modification | 35 | Policy Modification | Modifying IAM policies/ACLs granting elevated permissions (e.g., full wildcard `*` capabilities). |
| **RULE-005** | After-Hours Activity | 15 | Anomalous Behavior | Privileged administrative actions executed outside business hours (Mon–Fri 09:00–18:00 UTC). |
| **RULE-006** | Repeated Failed Access | 25 | Credential Access / Brute Force | At least 5 failed administrative access attempts within a rolling 10-minute window for an actor. |
| **RULE-007** | Multiple Privilege Events | 20 | Rapid Escalation | Burst of at least 3 privilege-related modifications within 15 minutes by the same actor. |
| **RULE-008** | Suspicious Event Sequence | 25 | Complex Kill-Chain Correlation | Multi-stage sequence: Authentication failure &rarr; Successful login &rarr; Privilege escalation within 30 mins. |
| **RULE-009** | Unfamiliar IP Address | 20 | Anomalous Origin | Administrative privilege changes originating from an IP address outside baseline known IPs. |

---

## 3. Explainable Risk Scoring Engine

PrivilegeGuard uses a deterministic, transparent scoring algorithm bounded between 0 and 100:

$$\text{Final Risk Score} = \min(100, \text{Base Rule Weight} + \sum \text{Justified Contextual Contributions})$$

### Severity Tiers:
- **Critical (85–100):** Multi-stage sequence correlation or administrator account creation with active anomalies. Immediate containment required.
- **High (65–84):** Successful privilege elevation, critical group additions, or wildcard policy grants.
- **Medium (35–64):** Rapid bursts of privilege actions, repeated failed access attempts, or unfamiliar IP origins.
- **Low (0–34):** Contextual indicators such as scheduled after-hours maintenance without additional risk factors.

---

## 4. System Architecture

```
[System Audit Logs: CSV / JSON]
           │
           ▼
[FastAPI Log Parser & Canonical Normalizer]
  ├── Alias resolution (username ➔ actor, etc.)
  ├── Datetime standardization (UTC timezone-aware)
  └── Deduplication & Row Validation (10 MB / 100k rows)
           │
           ▼
[Canonical Audit Events: CanonicalEvent]
           │
           ▼
[Pandas Detection Engine: 9 Detection Rules]
  ├── Rolling window temporal analysis
  ├── Multi-stage kill-chain sequence correlation
  └── Enterprise baseline comparison
           │
           ▼
[Explainable Risk Scoring & Evidence Packaging]
           │
     ┌─────┴─────────────────────────┐
     ▼                               ▼
[SQLite Storage & History]     [Export Services]
  ├── Audit tracking             ├── CSV Alerts & Events
  └── Analyst status lifecycle   ├── JSON Audit Summary
                                 └── Executive PDF Reports
           │
           ▼
[REST API: http://127.0.0.1:8000/api]
           │
           ▼
[React 18 + Vite Frontend Dashboard]
  ├── Overview SOC Dashboard with Recharts
  ├── Interactive Threat Investigation Drawer
  ├── Drag-and-Drop Ingestion Workspace
  ├── Chronological Event Timeline
  ├── User Risk Profiling
  └── Standalone Demo Mode Switcher
```

---

## 5. Repository Structure

```
privilege-escalation-monitor/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes.py           # REST endpoints
│   │   ├── core/
│   │   │   ├── analytics.py        # Metrics, timeline, and risk aggregations
│   │   │   ├── detection_engine.py # The 9 cybersecurity detection rules
│   │   │   ├── log_parser.py       # Robust CSV/JSON parsing & alias normalization
│   │   │   ├── reporting.py        # CSV, JSON, and ReportLab PDF report generators
│   │   │   ├── risk_scoring.py     # Deterministic risk scoring formula
│   │   │   └── utils.py            # Timestamps, IDs, and IP baseline helpers
│   │   ├── database/
│   │   │   └── storage.py          # SQLite persistence and audit status tracking
│   │   ├── config.py               # Central configuration, weights, and schedules
│   │   ├── main.py                 # FastAPI application with CORS
│   │   └── schemas.py              # Pydantic data models
│   ├── data/
│   │   ├── sample_audit_logs.csv   # 125 synthetic benchmark events in CSV
│   │   ├── sample_audit_logs.json  # 125 synthetic benchmark events in JSON
│   │   └── expected_demo_results.json
│   ├── tests/                      # Pytest automated test suite (29 tests)
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── alerts/             # AlertTable, Filters, Badges, Details Drawer
│   │   │   ├── dashboard/          # Metric cards and Recharts visualizations
│   │   │   ├── layout/             # Sidebar, Topbar, PageHeader, AppLayout
│   │   │   ├── reports/            # ExportPanel with CSV, JSON, PDF downloads
│   │   │   ├── timeline/           # Chronological Activity Timeline
│   │   │   ├── upload/             # FileDropzone and LogPreview
│   │   │   ├── users/              # UserRiskTable and UserDetails Drawer
│   │   │   └── common/             # Reusable UI primitives
│   │   ├── pages/                  # 7 core views
│   │   ├── context/AppContext.jsx  # Global React Context with Demo/API switching
│   │   ├── services/               # Axios API clients
│   │   ├── styles/                 # Plain CSS design tokens (#0B1220 palette)
│   │   └── utils/mockData.js       # Offline mock data covering all 9 rules
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
└── README.md
```

---

## 6. Installation & Execution Guide (Windows PowerShell)

### Prerequisites
- Python 3.10+ (Verified on Python 3.14)
- Node.js LTS (v18+)

### Step 1: Start the Backend

Open a PowerShell terminal:

```powershell
cd backend

# (Optional: Create and activate virtual environment)
py -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install dependencies
python -m pip install -r requirements.txt

# Start FastAPI backend
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

- **Backend API:** `http://127.0.0.1:8000/`
- **Interactive Swagger Docs:** `http://127.0.0.1:8000/docs`

### Step 2: Start the Frontend

Open a second PowerShell terminal:

```powershell
cd frontend

# Install Node dependencies
npm install

# Start Vite dev server
npm run dev
```

- **Application URL:** Open `http://localhost:5173` in your browser.

---

## 7. Running Automated Tests

### Backend Test Suite (Pytest)

In the `backend` directory:

```powershell
python -m pytest -q
```

Runs 29 automated tests verifying:
- CSV & JSON parsing with alias mapping
- Schema normalization and missing required fields
- Every single detection rule (RULE-001 through RULE-009)
- Score boundaries (0–100) and modifier deduplication
- REST API validation, pagination, and status patching
- CSV, JSON, and PDF report generators

### Frontend Production Build Verification

In the `frontend` directory:

```powershell
npm run build
```

---

## 8. 3-Minute Hackathon Judge Demonstration Script

| Time | Segment | Demonstration Action & Script |
|---|---|---|
| **0:00–0:30** | **The Problem** | *"Privilege escalation is the primary objective of advanced adversaries. Once standard credentials are breached, attackers seek administrative rights, assign rogue roles, or manipulate domain groups. PrivilegeGuard is an explainable detection and monitoring platform for identity and access management."* |
| **0:30–1:00** | **Dashboard & Telemetry** | Show `http://localhost:5173`. Point to the 5 Metric Cards: 125 events analyzed, 9 alerts identified across 4 severity tiers with a 100% normalization success rate. Showcase the Severity Donut, Activity Velocity chart, and Top Affected Identities. |
| **1:00–1:45** | **Alert Investigation** | Navigate to **Threat Detections**. Click **Details** on `ALT-RULE1-001` (Privilege Elevation) or `ALT-RULE2-001` (Administrator Account Creation). Show the side drawer: review the exact score breakdown (`Base weight 55 + Contextual Grant 15 = 70 [High]`), raw evidence payload, and change the Investigation Status to `Under Investigation`. |
| **1:45–2:20** | **Sequence Correlation** | Open alert `ALT-RULE8-001` (Suspicious Multi-Stage Sequence Correlation). Explain how PrivilegeGuard correlated 2 failed logins, a subsequent successful authentication, and an immediate role escalation to `superadmin` within a 9-minute window for `infiltrator_x`. Point out how temporal correlation elevates risk priority. |
| **2:20–2:45** | **Reports & Export** | Navigate to **Reports & Export**. Click **Download CSV** to inspect the alerts spreadsheet, **Download JSON** for SIEM ingestion, or **Download PDF** to show the generated compliance report. |
| **2:45–3:00** | **Conclusion & Operational Trust** | Reiterate: *"PrivilegeGuard processes logs locally with zero cloud dependencies, supports live and demo modes, and adheres to the ethical SOC principle that rule heuristics guide analysts without making unsubstantiated claims."* |

---

## 9. Offline Demo Mode vs. Live API Mode

PrivilegeGuard provides a **Demo Mode Switcher** located directly on the topbar:
- **Demo Mode:** Runs 100% standalone using client-side mock data and browser-side file downloads. Ideal for offline presentations and sandbox exploration.
- **Live API Mode:** Connects in real-time to the FastAPI backend at `http://127.0.0.1:8000/api`, executing Pandas detection rules and persisting investigation status updates into SQLite.
- If the backend is temporarily offline, the frontend gracefully falls back to Demo Mode while notifying the analyst.

---

## 10. Security & Production Considerations

- **Local Processing:** All logs are processed locally with zero external network transmission of credentials.
- **Input Sanitization:** Safe CSV dialect sniffing and JSON parsing prevent untrusted deserialization.
- **Parameterized SQL:** All queries to SQLite use parameterized statements preventing injection.
- **Production Roadmap:** For production enterprise deployment, integrate SAML/OIDC SSO, role-based analyst access controls (RBAC), and append-only encrypted ledger storage for audit history.
