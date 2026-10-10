import React from 'react';
import { WORKFLOW_STEPS } from '../../data/helpContent';
import { Cpu, Terminal, Database, Code2 } from 'lucide-react';

export default function WorkflowGuide() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
          The End-to-End Audit Processing Pipeline
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          How PrivilegeGuard moves raw unstructured audit records into normalized, explainable cybersecurity threat detections.
        </p>
      </div>

      <div className="workflow-grid">
        {WORKFLOW_STEPS.map((s) => (
          <div key={s.step} className="workflow-card">
            <div className="workflow-step-num">{s.step}</div>
            <div className="workflow-card-title">{s.title}</div>
            <div className="workflow-card-desc">{s.desc}</div>
            <div className="workflow-card-tech">{s.tech}</div>
          </div>
        ))}
      </div>

      {/* Technology Stack Explainer */}
      <div style={{
        marginTop: 10,
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: 20
      }}>
        <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Code2 size={18} style={{ color: 'var(--color-primary)' }} />
          <span>Core Technology Architecture Breakdown</span>
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, fontSize: 12 }}>
          <div style={{ background: 'var(--bg-elevated)', padding: 12, borderRadius: 6 }}>
            <strong style={{ color: 'var(--color-primary)' }}>React JSX & Vite:</strong>
            <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Fast, modular single-page UI with Recharts visualizations and zero heavy CSS frameworks.</p>
          </div>
          <div style={{ background: 'var(--bg-elevated)', padding: 12, borderRadius: 6 }}>
            <strong style={{ color: 'var(--color-low)' }}>FastAPI & Pydantic:</strong>
            <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>High-performance asynchronous Python REST API validating incoming request schemas.</p>
          </div>
          <div style={{ background: 'var(--bg-elevated)', padding: 12, borderRadius: 6 }}>
            <strong style={{ color: 'var(--color-high)' }}>Pandas Analytics Engine:</strong>
            <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>High-throughput temporal sorting, rolling 10/15/30-minute time windows, and correlation masks.</p>
          </div>
          <div style={{ background: 'var(--bg-elevated)', padding: 12, borderRadius: 6 }}>
            <strong style={{ color: 'var(--color-medium)' }}>SQLite & ReportLab:</strong>
            <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Local parameterized persistence and dynamic PDF report generation with zero cloud lock-in.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
