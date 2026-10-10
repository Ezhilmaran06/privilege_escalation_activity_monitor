import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  Clock,
  User,
  Activity,
  Layers,
  Terminal,
  FileCheck,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import SeverityBadge from './SeverityBadge';
import RiskScore from './RiskScore';
import Button from '../common/Button';
import { formatDate } from '../../utils/formatters';
import { INVESTIGATION_STATUSES } from '../../utils/constants';
import { useApp } from '../../context/AppContext';

export default function AlertDetails({ alert, onClose }) {
  const { updateAlertStatus } = useApp();
  const [currentStatus, setCurrentStatus] = useState(alert.investigation_status || 'New');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!alert) return null;

  const handleStatusChange = async (newStatus) => {
    setIsSaving(true);
    setCurrentStatus(newStatus);
    await updateAlertStatus(alert.alert_id, newStatus, notes);
    setIsSaving(false);
  };

  const bd = alert.score_breakdown || {
    base_weight: alert.risk_score,
    contextual_contributions: [],
    calculation_summary: 'Deterministic rule heuristic'
  };

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <SeverityBadge severity={alert.severity} />
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                {alert.rule_name}
              </h2>
              <code style={{ fontSize: 11, color: 'var(--text-muted)' }}>{alert.alert_id}</code>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ color: 'var(--text-muted)', padding: 6, cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="drawer-body">
          {/* Status Bar Controls */}
          <div className="detail-section" style={{ background: 'var(--bg-elevated)' }}>
            <div className="detail-title">
              <CheckCircle size={14} style={{ color: 'var(--color-primary)' }} />
              <span>Investigation Status</span>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
              {INVESTIGATION_STATUSES.map((st) => (
                <button
                  key={st}
                  disabled={isSaving}
                  onClick={() => handleStatusChange(st)}
                  className={`btn btn-sm ${currentStatus === st ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: 12 }}
                >
                  {st}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                placeholder="Analyst investigation notes / ticket ID..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ flex: 1, fontSize: 12 }}
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => updateAlertStatus(alert.alert_id, currentStatus, notes)}
                disabled={isSaving}
              >
                Save Notes
              </Button>
            </div>
          </div>

          {/* Explanation Banner */}
          <div className="detail-section" style={{ borderLeft: '3px solid var(--color-primary)' }}>
            <div className="detail-title">
              <Info size={14} style={{ color: 'var(--color-primary)' }} />
              <span>Threat Explanation & Assessment</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6 }}>
              {alert.explanation}
            </p>
            <div style={{
              display: 'flex',
              gap: 16,
              marginTop: 12,
              paddingTop: 10,
              borderTop: '1px solid var(--border-color)',
              fontSize: 12,
              color: 'var(--text-muted)'
            }}>
              <span>Evidence Confidence: <strong style={{ color: 'var(--text-primary)' }}>{alert.evidence_quality || 'High'}</strong></span>
              <span>Rule Identifier: <strong style={{ color: 'var(--text-primary)' }}>{alert.rule_id}</strong></span>
            </div>
          </div>

          {/* Risk Score Breakdown */}
          <div className="detail-section">
            <div className="detail-title">
              <Activity size={14} style={{ color: 'var(--color-critical)' }} />
              <span>Transparent Risk Calculation</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Calculated Score:</span>
              <RiskScore score={alert.risk_score} />
            </div>

            <div style={{
              background: 'var(--bg-main)',
              borderRadius: 'var(--radius-sm)',
              padding: 12,
              fontSize: 12,
              display: 'flex',
              flexDirection: 'column',
              gap: 8
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Base Rule Weight ({alert.rule_id}):</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>+{bd.base_weight}</span>
              </div>
              {bd.contextual_contributions && bd.contextual_contributions.map((c, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{c.name} ({c.reason}):</span>
                  <span style={{ fontWeight: 600, color: c.weight >= 0 ? 'var(--color-high)' : 'var(--color-low)' }}>
                    {c.weight >= 0 ? `+${c.weight}` : c.weight}
                  </span>
                </div>
              ))}
              {bd.deduplication_notes && (
                <div style={{ color: 'var(--color-medium)', fontStyle: 'italic', fontSize: 11 }}>
                  Note: {bd.deduplication_notes}
                </div>
              )}
              <div style={{
                borderTop: '1px solid var(--border-color)',
                paddingTop: 6,
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 700
              }}>
                <span>Final Bounded Score:</span>
                <span style={{ color: 'var(--color-critical)' }}>{alert.risk_score} / 100 [{alert.severity}]</span>
              </div>
            </div>
          </div>

          {/* Core Event Telemetry */}
          <div className="detail-section">
            <div className="detail-title">
              <Terminal size={14} style={{ color: 'var(--text-secondary)' }} />
              <span>Event Details & Identifiers</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13 }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>Actor:</span>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{alert.actor}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>Target Identity:</span>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{alert.target_user || 'None'}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>Action Taken:</span>
                <div><code>{alert.action}</code></div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>Source IP:</span>
                <div><code>{alert.source_ip || 'Internal / N/A'}</code></div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>Timestamp (UTC):</span>
                <div>{formatDate(alert.timestamp)}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>Target Resource:</span>
                <div>{alert.resource || 'Identity Service'}</div>
              </div>
            </div>
          </div>

          {/* Structured Evidence Payload */}
          <div className="detail-section">
            <div className="detail-title">
              <Layers size={14} style={{ color: 'var(--text-secondary)' }} />
              <span>Structured Evidence Payload</span>
            </div>
            <pre style={{
              background: 'var(--bg-main)',
              padding: 12,
              borderRadius: 'var(--radius-sm)',
              fontSize: 12,
              color: 'var(--text-secondary)',
              overflowX: 'auto',
              maxHeight: 200
            }}>
              {JSON.stringify(alert.evidence, null, 2)}
            </pre>
          </div>

          {/* Related Event Correlated IDs */}
          {alert.related_event_ids && alert.related_event_ids.length > 0 && (
            <div className="detail-section">
              <div className="detail-title">
                <FileCheck size={14} style={{ color: 'var(--text-secondary)' }} />
                <span>Correlated Audit Event IDs ({alert.related_event_ids.length})</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {alert.related_event_ids.map((id) => (
                  <span
                    key={id}
                    style={{
                      background: 'var(--bg-main)',
                      border: '1px solid var(--border-color)',
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontSize: 11,
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--color-primary)'
                    }}
                  >
                    {id}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Analyst Playbook Steps */}
          <div className="detail-section" style={{ background: 'rgba(59, 130, 246, 0.05)', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
            <div className="detail-title">
              <ShieldAlert size={14} style={{ color: 'var(--color-primary)' }} />
              <span>Recommended SOC Response Steps</span>
            </div>
            <ul style={{ paddingLeft: 18, fontSize: 13, color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {alert.recommended_actions.map((act, i) => (
                <li key={i}>{act}</li>
              ))}
            </ul>
          </div>

          {/* System Disclaimer */}
          <div style={{
            fontSize: 11,
            color: 'var(--text-muted)',
            lineHeight: 1.5,
            padding: '8px 12px',
            background: 'var(--bg-main)',
            borderRadius: 'var(--radius-sm)',
            border: '1px dashed var(--border-color)'
          }}>
            <strong>SOC Operational Principle:</strong> PrivilegeGuard identifies potentially suspicious activity based on rule heuristics and telemetry correlation. Rule detections do not confirm an attack without independent human analyst verification.
          </div>
        </div>
      </div>
    </div>
  );
}
