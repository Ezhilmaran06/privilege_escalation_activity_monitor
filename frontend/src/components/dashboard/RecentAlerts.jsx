import React from 'react';
import { Eye, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SeverityBadge from '../alerts/SeverityBadge';
import RiskScore from '../alerts/RiskScore';
import { formatDate } from '../../utils/formatters';
import { useApp } from '../../context/AppContext';

export default function RecentAlerts({ alerts = [] }) {
  const { setSelectedAlert } = useApp();
  const recentItems = alerts.slice(0, 6);

  return (
    <div className="table-card" style={{ marginTop: 24 }}>
      <div className="table-toolbar">
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
            Recent High-Priority Detections
          </h3>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Latest alerts requiring SOC triage
          </span>
        </div>
        <Link
          to="/detections"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            color: 'var(--color-primary)',
            fontWeight: 600
          }}
        >
          <span>View All Detections</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Severity</th>
              <th>Timestamp (UTC)</th>
              <th>Actor</th>
              <th>Action</th>
              <th>Target Identity</th>
              <th>Detection Rule</th>
              <th>Risk Score</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {recentItems.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>
                  No threat detections found in current dataset.
                </td>
              </tr>
            ) : (
              recentItems.map((alert) => (
                <tr key={alert.alert_id}>
                  <td>
                    <SeverityBadge severity={alert.severity} />
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                    {formatDate(alert.timestamp)}
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{alert.actor}</span>
                  </td>
                  <td>
                    <code style={{ fontSize: 12, background: 'var(--bg-elevated)', padding: '2px 6px', borderRadius: 4 }}>
                      {alert.action}
                    </code>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {alert.target_user || '—'}
                  </td>
                  <td style={{ maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={alert.rule_name}>
                    {alert.rule_name}
                  </td>
                  <td>
                    <RiskScore score={alert.risk_score} />
                  </td>
                  <td>
                    <button
                      onClick={() => setSelectedAlert(alert)}
                      className="btn btn-secondary btn-sm"
                      title="Investigate Alert Details"
                    >
                      <Eye size={13} />
                      <span>Investigate</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
