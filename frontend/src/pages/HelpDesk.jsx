import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HelpCircle,
  LayoutDashboard,
  UploadCloud,
  Sparkles,
  BookOpen,
  Shield,
  Building2,
  GitMerge,
  Compass,
  Layers,
  Cpu,
  FileSearch,
  Wrench,
  Lock,
  BookMarked,
  Code,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';
import HelpSearch from '../components/help/HelpSearch';
import HelpCategoryNav from '../components/help/HelpCategoryNav';
import HelpAccordion from '../components/help/HelpAccordion';
import WorkflowGuide from '../components/help/WorkflowGuide';
import ScenarioGuide from '../components/help/ScenarioGuide';
import TroubleshootingGuide from '../components/help/TroubleshootingGuide';
import Glossary from '../components/help/Glossary';
import QuickStartChecklist from '../components/help/QuickStartChecklist';
import GuidedTour from '../components/help/GuidedTour';

import {
  PROJECT_OVERVIEW,
  USE_CASES,
  USER_PERSONAS,
  STEP_BY_STEP_GUIDE,
  DETECTION_RULES_REFERENCE,
  RISK_SCORING_GUIDE,
  FAQS
} from '../data/helpContent';
import '../styles/helpDesk.css';

export default function HelpDesk() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showTour, setShowTour] = useState(false);

  const query = searchTerm.toLowerCase().trim();

  // Helper filter
  const matchesQuery = (...texts) => {
    if (!query) return true;
    return texts.some((t) => t && String(t).toLowerCase().includes(query));
  };

  const shouldShowSection = (sectionId) => {
    if (query) return true;
    return activeCategory === 'all' || activeCategory === sectionId;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader
        title="Help Desk & User Guide"
        subtitle="Learn what PrivilegeGuard does, where it is useful, and how to use it effectively."
        actions={
          <div style={{ display: 'flex', gap: 10 }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/')}
              icon={LayoutDashboard}
            >
              Dashboard
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/upload')}
              icon={UploadCloud}
            >
              Upload Logs
            </Button>
          </div>
        }
      />

      {/* Hero Knowledge Center Banner */}
      <div className="help-hero">
        <h2 className="help-hero-title">
          <BookOpen size={26} style={{ color: 'var(--color-primary)' }} />
          <span>Welcome to PrivilegeGuard Help Desk</span>
        </h2>
        <p className="help-hero-desc">
          Your comprehensive operational guide to understanding privilege escalation monitoring, analyzing system audit logs, investigating anomalous access modifications, and generating forensic compliance reports.
        </p>

        <div className="help-hero-actions">
          <Button
            variant="primary"
            onClick={() => setShowTour(true)}
            icon={Sparkles}
          >
            Start Guided Walkthrough
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/')}
            icon={LayoutDashboard}
          >
            Open Dashboard
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/upload')}
            icon={UploadCloud}
          >
            Upload Audit Logs
          </Button>
        </div>
      </div>

      {/* Search Input */}
      <HelpSearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Category Navigation Bar */}
      {!searchTerm && (
        <HelpCategoryNav
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
      )}

      {/* SECTION: Quick Start Checklist */}
      {shouldShowSection('quickstart') && matchesQuery('quick start', 'checklist', 'getting started') && (
        <QuickStartChecklist onStartTour={() => setShowTour(true)} />
      )}

      {/* SECTION 1: What is this project? */}
      {shouldShowSection('overview') && matchesQuery('what is', 'privilege escalation', 'problem', 'overview') && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Shield size={20} style={{ color: 'var(--color-primary)' }} />
            <span>1. What is PrivilegeGuard?</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                {PROJECT_OVERVIEW.whatIs.title}
              </h4>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {PROJECT_OVERVIEW.whatIs.content}
              </p>
            </div>

            <div style={{ background: 'var(--bg-elevated)', padding: 16, borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--color-primary)' }}>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                {PROJECT_OVERVIEW.problemSolved.title}
              </h4>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {PROJECT_OVERVIEW.problemSolved.content}
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                {PROJECT_OVERVIEW.privilegeEscalation.title}
              </h4>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {PROJECT_OVERVIEW.privilegeEscalation.content}
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10 }}>
                {PROJECT_OVERVIEW.whyImportant.title}
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
                {PROJECT_OVERVIEW.whyImportant.benefits.map((b, i) => (
                  <div key={i} style={{ background: 'var(--bg-elevated)', padding: 12, borderRadius: 'var(--radius-sm)' }}>
                    <strong style={{ color: 'var(--text-primary)', fontSize: 13 }}>{b.title}</strong>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2 & 3: Where can this project be used & Who should use it? */}
      {shouldShowSection('usecases') && matchesQuery('where', 'who', 'use cases', 'personas', 'soc', 'iam', 'students') && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Building2 size={20} style={{ color: 'var(--color-primary)' }} />
            <span>2. Where Can PrivilegeGuard Be Used?</span>
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
            Realistic operational scenarios across corporate environments, security teams, and educational labs:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 28 }}>
            {USE_CASES.map((uc) => (
              <div key={uc.id} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{uc.title}</h4>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}><strong>Who:</strong> {uc.whoUses}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}><strong>Problem:</strong> {uc.problem}</div>
                <div style={{ fontSize: 12, color: 'var(--color-primary)' }}><strong>How It Helps:</strong> {uc.howHelps}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--bg-main)', padding: 6, borderRadius: 4 }}>
                  <strong>Example:</strong> {uc.example}
                </div>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Shield size={20} style={{ color: 'var(--color-primary)' }} />
            <span>3. Who Can Use PrivilegeGuard?</span>
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
            Designed with dual-depth explanations for beginners and technical cybersecurity professionals:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {USER_PERSONAS.map((p, idx) => (
              <div key={idx} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{p.role}</h4>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.purpose}</p>
                <div style={{ fontSize: 11, color: 'var(--color-low)', background: 'rgba(34, 197, 94, 0.08)', padding: 6, borderRadius: 4 }}>
                  <strong>Beginner Tip:</strong> {p.beginnerTip}
                </div>
                <div style={{ fontSize: 11, color: 'var(--color-primary)', background: 'rgba(59, 130, 246, 0.08)', padding: 6, borderRadius: 4 }}>
                  <strong>Technical Detail:</strong> {p.advancedDetails}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: How does the project work? */}
      {shouldShowSection('workflow') && matchesQuery('how it works', 'workflow', 'pipeline', 'architecture', 'technology') && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
          <WorkflowGuide />
        </div>
      )}

      {/* SECTION 5: Step-by-Step User Guide */}
      {shouldShowSection('userguide') && matchesQuery('step', 'guide', 'how to use', 'investigate', 'analyze') && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Compass size={20} style={{ color: 'var(--color-primary)' }} />
            <span>5. Interactive Step-by-Step User Guide</span>
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
            Complete walkthrough of analyzing logs, triaging alerts, and generating reports:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {STEP_BY_STEP_GUIDE.map((sg, i) => (
              <HelpAccordion
                key={i}
                title={`${sg.step}: ${sg.title}`}
                defaultOpen={i === 0 && !query}
              >
                <p style={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>{sg.content}</p>
              </HelpAccordion>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 6: Understanding Detection Rules */}
      {shouldShowSection('rules') && matchesQuery('rule', 'detection', 'rule-001', 'rule-002', 'rule-003', 'rule-008') && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Layers size={20} style={{ color: 'var(--color-primary)' }} />
            <span>6. Detection Rules Reference Catalog</span>
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
            All 9 active heuristic rules implemented by the backend detection engine with weights, limitations, and playbook steps:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {DETECTION_RULES_REFERENCE.map((r) => (
              <HelpAccordion
                key={r.id}
                title={`${r.id}: ${r.name} (Base Weight: ${r.weight})`}
                badge={r.status}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div><strong>What it Detects:</strong> {r.detects}</div>
                  <div><strong>Realistic Example:</strong> <code>{r.example}</code></div>
                  <div><strong>Why it Matters:</strong> {r.whyMatters}</div>
                  <div><strong>Required Evidence:</strong> {r.evidenceRequired}</div>
                  <div style={{ color: 'var(--color-medium)' }}><strong>Limitation:</strong> {r.limitations}</div>
                  <div>
                    <strong style={{ color: 'var(--color-primary)' }}>Suggested SOC Playbook Steps:</strong>
                    <ul style={{ paddingLeft: 18, marginTop: 4 }}>
                      {r.investigationSteps.map((st, sidx) => (
                        <li key={sidx}>{st}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </HelpAccordion>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 7: Understanding Risk Scores */}
      {shouldShowSection('scoring') && matchesQuery('score', 'risk', 'calculation', 'severity', 'weight') && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Cpu size={20} style={{ color: 'var(--color-primary)' }} />
            <span>7. Explainable Risk Scoring Engine Guide</span>
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
            Deterministic mathematics behind risk score calculations and severity tiers:
          </p>

          <pre style={{ background: 'var(--bg-main)', padding: 12, borderRadius: 6, fontSize: 13, color: 'var(--color-primary)', marginBottom: 16 }}>
            {RISK_SCORING_GUIDE.formula}
          </pre>

          {/* Severity Table */}
          <table className="data-table" style={{ marginBottom: 20 }}>
            <thead>
              <tr>
                <th>Severity Tier</th>
                <th>Score Range</th>
                <th>Recommended SOC Action</th>
              </tr>
            </thead>
            <tbody>
              {RISK_SCORING_GUIDE.severityTable.map((st, i) => (
                <tr key={i}>
                  <td><strong>{st.severity}</strong></td>
                  <td><code>{st.range}</code></td>
                  <td>{st.action}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Scoring Principles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, marginBottom: 16 }}>
            {RISK_SCORING_GUIDE.principles.map((pr, i) => (
              <div key={i} style={{ background: 'var(--bg-elevated)', padding: 12, borderRadius: 6 }}>
                <strong style={{ color: 'var(--text-primary)', fontSize: 13 }}>{pr.title}</strong>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{pr.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 8: Common Scenarios */}
      {shouldShowSection('scenarios') && matchesQuery('scenario', 'unexpected', 'maintenance', 'brute force') && (
        <ScenarioGuide />
      )}

      {/* SECTION 9: Troubleshooting */}
      {shouldShowSection('troubleshooting') && matchesQuery('troubleshoot', 'error', 'failed', 'empty', 'missing', 'connect') && (
        <TroubleshootingGuide filterQuery={query} />
      )}

      {/* SECTION 10: FAQ */}
      {shouldShowSection('faq') && matchesQuery('faq', 'question', 'frequently asked', 'what is') && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
            <HelpCircle size={20} style={{ color: 'var(--color-primary)' }} />
            <span>10. Frequently Asked Questions (FAQ)</span>
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
            Verified answers to common operational questions:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FAQS.map((faq, i) => (
              <HelpAccordion
                key={i}
                title={faq.q}
              >
                <p style={{ lineHeight: 1.6 }}>{faq.a}</p>
              </HelpAccordion>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 11: Security, Privacy & Limitations */}
      {shouldShowSection('security') && matchesQuery('security', 'privacy', 'limitations', 'disclaimer', 'local') && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Lock size={20} style={{ color: 'var(--color-primary)' }} />
            <span>11. Security, Privacy & Limitations</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <p>
              • <strong>100% Local Processing:</strong> Audit log parsing, event normalization, and detection rule execution take place entirely on the local host (http://127.0.0.1:8000). No audit data is transmitted to third-party cloud services or paid APIs.
            </p>
            <p>
              • <strong>Persistence Governance:</strong> Optional SQLite persistence stores analysis metadata, detected alerts, and analyst investigation status logs in a local database (<code>backend/data/privilege_guard.db</code>).
            </p>
            <p>
              • <strong>Incomplete Log Evidence:</strong> Detection accuracy relies on the quality of supplied audit logs. If an uploaded log omits previous roles or timestamps, the detection engine transparently lowers evidence quality.
            </p>
            <p>
              • <strong>Operational Rule Heuristics:</strong> Rule-based analysis flags anomalous patterns. An alert is an investigation candidate and does not constitute proof of an attack without human verification.
            </p>

            <div style={{
              marginTop: 10,
              padding: '14px 18px',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-md)',
              fontSize: 12,
              color: 'var(--color-critical)'
            }}>
              <strong>Mandatory Compliance Disclaimer:</strong> PrivilegeGuard is an audit-log analysis prototype intended to support security investigation and education. It does not replace a production SIEM, endpoint detection platform, identity governance system, or professional incident-response process.
            </div>
          </div>
        </div>
      )}

      {/* SECTION 12: Glossary */}
      {shouldShowSection('glossary') && matchesQuery('glossary', 'terms', 'definitions', 'rbac', 'siem') && (
        <Glossary filterQuery={query} />
      )}

      {/* SECTION 14: Technical Reference */}
      {shouldShowSection('technical') && matchesQuery('technical', 'api', 'endpoints', 'backend', 'developer') && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Code size={20} style={{ color: 'var(--color-primary)' }} />
            <span>14. Technical Reference & API Endpoints</span>
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
            Technical specifications for developers, API integrators, and cybersecurity evaluators:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14, fontSize: 12 }}>
            <div style={{ background: 'var(--bg-elevated)', padding: 14, borderRadius: 6 }}>
              <code style={{ color: 'var(--color-low)' }}>GET /api/health</code>
              <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>System health, version status, and SQLite persistence mode.</p>
            </div>
            <div style={{ background: 'var(--bg-elevated)', padding: 14, borderRadius: 6 }}>
              <code style={{ color: 'var(--color-primary)' }}>GET /api/dashboard/summary</code>
              <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Telemetry metrics, severity counts, rule frequencies, and timeline overview.</p>
            </div>
            <div style={{ background: 'var(--bg-elevated)', padding: 14, borderRadius: 6 }}>
              <code style={{ color: 'var(--color-high)' }}>POST /api/logs/upload</code>
              <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Multipart CSV/JSON upload with validation and canonical normalization.</p>
            </div>
            <div style={{ background: 'var(--bg-elevated)', padding: 14, borderRadius: 6 }}>
              <code style={{ color: 'var(--color-high)' }}>POST /api/logs/analyze</code>
              <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Executes all 9 detection rules and computes risk score breakdowns.</p>
            </div>
            <div style={{ background: 'var(--bg-elevated)', padding: 14, borderRadius: 6 }}>
              <code style={{ color: 'var(--color-primary)' }}>GET /api/alerts</code>
              <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Paginated alert query supporting severity, status, actor, and sorting.</p>
            </div>
            <div style={{ background: 'var(--bg-elevated)', padding: 14, borderRadius: 6 }}>
              <code style={{ color: 'var(--color-medium)' }}>PATCH /api/alerts/{'{id}'}/status</code>
              <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Updates investigation status (New, Under Investigation, Reviewed, False Positive).</p>
            </div>
            <div style={{ background: 'var(--bg-elevated)', padding: 14, borderRadius: 6 }}>
              <code style={{ color: 'var(--color-low)' }}>GET /api/reports/export</code>
              <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Forensic downloads supporting ?format=csv, ?format=json, and ?format=pdf.</p>
            </div>
          </div>
        </div>
      )}

      {/* Guided Walkthrough Modal */}
      <GuidedTour
        isOpen={showTour}
        onClose={() => setShowTour(false)}
      />
    </div>
  );
}
