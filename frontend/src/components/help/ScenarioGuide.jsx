import React from 'react';
import { COMMON_SCENARIOS } from '../../data/helpContent';
import { ShieldAlert, ArrowRight, Eye, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

export default function ScenarioGuide() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
          Practical SOC Investigation Scenarios
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          Review how PrivilegeGuard detects, scores, and guides analyst triage across typical real-world administrative events.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {COMMON_SCENARIOS.map((sc) => (
          <div
            key={sc.id}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <ShieldAlert size={18} style={{ color: 'var(--color-primary)' }} />
                <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {sc.name}
                </h4>
              </div>
              <code style={{ fontSize: 12, color: 'var(--color-primary)', background: 'var(--bg-elevated)', padding: '2px 8px', borderRadius: 4 }}>
                {sc.rule}
              </code>
            </div>

            <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5 }}>
              <strong>Situation:</strong> {sc.situation}
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 12,
              background: 'var(--bg-elevated)',
              padding: 14,
              borderRadius: 'var(--radius-md)',
              fontSize: 12
            }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Expected Alert:</span>
                <div style={{ fontWeight: 600, color: 'var(--color-high)' }}>{sc.expectedAlert}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Evidence to Inspect:</span>
                <div style={{ color: 'var(--text-secondary)' }}>{sc.evidenceToInspect}</div>
              </div>
            </div>

            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <strong style={{ color: 'var(--color-low)' }}>Suggested Investigation Action:</strong> {sc.suggestedSteps}
            </div>

            <div style={{
              fontSize: 11,
              color: 'var(--text-muted)',
              borderTop: '1px solid var(--border-color)',
              paddingTop: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 8
            }}>
              <span><strong>Operational Limitation:</strong> {sc.limitations}</span>
              <button
                onClick={() => navigate('/detections')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  color: 'var(--color-primary)',
                  fontWeight: 600,
                  fontSize: 12,
                  cursor: 'pointer'
                }}
              >
                <span>View Detections</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
