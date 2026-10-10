import React from 'react';
import { X, User, ShieldAlert, Globe, Activity, CheckCircle, Info } from 'lucide-react';
import SeverityBadge from '../alerts/SeverityBadge';
import RiskScore from '../alerts/RiskScore';
import { formatDate } from '../../utils/formatters';
import { useApp } from '../../context/AppContext';

export default function UserDetails({ user, onClose }) {
  const { alerts, setSelectedAlert } = useApp();

  if (!user) return null;

  // Filter alerts associated with this user
  const userAlerts = alerts.filter(
    (a) => a.actor === user.actor || a.target_user === user.actor
  );

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'rgba(59, 130, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)'
            }}>
              <User size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                {user.actor}
              </h2>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Identity Threat & Privilege Profile
              </span>
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
          {/* Risk Summary Card */}
          <div className="detail-section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Max Risk Score:</span>
              <div><RiskScore score={user.highest_risk_score} /></div>
            </div>
            <div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Highest Severity:</span>
              <div><SeverityBadge severity={user.highest_severity} /></div>
            </div>
            <div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Associated Alerts:</span>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{user.alert_count}</div>
            </div>
            <div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Last Seen Active:</span>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{formatDate(user.recent_event_time)}</div>
            </div>
          </div>

          {/* Observed Origin IP Baseline */}
          <div className="detail-section">
            <div className="detail-title">
              <Globe size={14} style={{ color: 'var(--text-secondary)' }} />
              <span>Observed Source IPs</span>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {user.source_ips && user.source_ips.length > 0 ? (
                user.source_ips.map((ip) => (
                  <span
                    key={ip}
                    style={{
                      background: 'var(--bg-main)',
                      border: '1px solid var(--border-color)',
                      padding: '3px 8px',
                      borderRadius: 4,
                      fontSize: 12,
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    {ip}
                  </span>
                ))
              ) : (
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>No source IP addresses recorded in telemetry</span>
              )}
            </div>
          </div>

          {/* Associated Alert History */}
          <div className="detail-section">
            <div className="detail-title">
              <ShieldAlert size={14} style={{ color: 'var(--color-critical)' }} />
              <span>Associated Threat Detections ({userAlerts.length})</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {userAlerts.length === 0 ? (
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>No alerts linked to this identity.</span>
              ) : (
                userAlerts.map((a) => (
                  <div
                    key={a.alert_id}
                    onClick={() => {
                      onClose();
                      setSelectedAlert(a);
                    }}
                    style={{
                      background: 'var(--bg-main)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '10px 12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 8,
                      transition: 'border-color 0.15s ease'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                        <SeverityBadge severity={a.severity} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                          {a.rule_name}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        {formatDate(a.timestamp)} • Action: {a.action}
                      </div>
                    </div>
                    <RiskScore score={a.risk_score} />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Critical SOC Operational Disclaimer */}
          <div style={{
            fontSize: 11,
            color: 'var(--text-muted)',
            lineHeight: 1.5,
            padding: '10px 14px',
            background: 'var(--bg-main)',
            borderRadius: 'var(--radius-sm)',
            border: '1px dashed var(--border-color)'
          }}>
            <strong>SOC Operational Guidance:</strong> User risk scores and alert associations serve as an analyst prioritization aid. Elevated scores indicate anomalous telemetry and do not constitute evidence or proof of malicious intent.
          </div>
        </div>
      </div>
    </div>
  );
}
