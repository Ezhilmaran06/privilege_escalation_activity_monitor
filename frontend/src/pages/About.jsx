import React from 'react';
import { Shield, BookOpen, Layers, CheckCircle2, AlertTriangle, Cpu, Terminal } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';

export default function About() {
  const rules = [
    { id: 'RULE-001', name: 'Privilege Elevation', weight: 55, desc: 'Detects transition from an unprivileged role to an administrator or root role.' },
    { id: 'RULE-002', name: 'Administrator Account Creation', weight: 65, desc: 'Detects direct provisioning of an account with elevated administrative rights.' },
    { id: 'RULE-003', name: 'Privileged Group Membership', weight: 55, desc: 'Detects addition of an identity into sensitive groups (e.g., Domain Admins, sudo).' },
    { id: 'RULE-004', name: 'Permission Modification', weight: 35, desc: 'Detects IAM policy modifications granting wildcard full access or elevated capabilities.' },
    { id: 'RULE-005', name: 'After-Hours Activity', weight: 15, desc: 'Detects administrative operations performed outside standard business hours (Mon-Fri 09-18 UTC).' },
    { id: 'RULE-006', name: 'Repeated Failed Access', weight: 25, desc: 'Detects 5+ consecutive authentication failures for an administrative account within 10 minutes.' },
    { id: 'RULE-007', name: 'Multiple Privilege Events', weight: 20, desc: 'Detects rapid bursts of 3+ privilege operations by the same actor in 15 minutes.' },
    { id: 'RULE-008', name: 'Suspicious Event Sequence', weight: 25, desc: 'Correlates failed login -> successful login -> privilege escalation within 30 minutes.' },
    { id: 'RULE-009', name: 'Unfamiliar IP During Privilege Change', weight: 20, desc: 'Detects administrative actions originating from an IP address outside baseline known IPs.' }
  ];

  return (
    <div>
      <PageHeader
        title="About PrivilegeGuard"
        subtitle="Identity, Authentication & Access Management (T2-PS7) Privilege Escalation Activity Monitor"
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Core Philosophy */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: 24
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <Shield size={22} style={{ color: 'var(--color-primary)' }} />
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
              Core Philosophy & Operational Principles
            </h3>
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
            Administrator accounts and elevated permissions provide direct keys to sensitive infrastructure. PrivilegeGuard monitors audit trails to identify suspicious access assignments, anomalous accounts, and rapid privilege expansions before malicious actors can establish persistence.
          </p>
          <div style={{
            padding: '12px 16px',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 13,
            color: 'var(--color-medium)'
          }}>
            <strong>Critical SOC Principle:</strong> PrivilegeGuard identifies <em>potentially suspicious activity</em> using explainable heuristics and temporal correlation. The system never claims that a rule-based detection alone confirms an unauthorized breach without independent analyst investigation.
          </div>
        </div>

        {/* 9 Detection Rules */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: 24
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Layers size={22} style={{ color: 'var(--color-primary)' }} />
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
              The 9 Deterministic Detection Rules
            </h3>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 16
          }}>
            {rules.map((r) => (
              <div
                key={r.id}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <code style={{ fontSize: 12, color: 'var(--color-primary)', fontWeight: 700 }}>{r.id}</code>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Base Weight: {r.weight}</span>
                </div>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{r.name}</div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Scoring Formula */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: 24
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <Cpu size={22} style={{ color: 'var(--color-primary)' }} />
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
              Explainable Risk Scoring Algorithm
            </h3>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
            Risk scores range from 0 to 100 and are computed deterministically without opaque black-box guessing:
          </p>
          <pre style={{
            background: 'var(--bg-main)',
            padding: 12,
            borderRadius: 'var(--radius-sm)',
            fontSize: 13,
            color: 'var(--color-primary)',
            overflowX: 'auto',
            marginBottom: 16
          }}>
            Final Risk Score = min(100, Base Rule Weight + Sum(Contextual Contributions))
          </pre>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 12,
            fontSize: 13
          }}>
            <div style={{ padding: 10, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 6 }}>
              <strong style={{ color: 'var(--color-critical)' }}>Critical: 85–100</strong>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Immediate account isolation</div>
            </div>
            <div style={{ padding: 10, background: 'rgba(249, 115, 22, 0.1)', border: '1px solid rgba(249, 115, 22, 0.3)', borderRadius: 6 }}>
              <strong style={{ color: 'var(--color-high)' }}>High: 65–84</strong>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Priority ticket validation</div>
            </div>
            <div style={{ padding: 10, background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 6 }}>
              <strong style={{ color: 'var(--color-medium)' }}>Medium: 35–64</strong>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Contextual anomaly</div>
            </div>
            <div style={{ padding: 10, background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: 6 }}>
              <strong style={{ color: 'var(--color-low)' }}>Low: 0–34</strong>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Routine telemetry audit</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
