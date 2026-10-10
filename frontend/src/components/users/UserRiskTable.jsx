import React from 'react';
import { Eye, ShieldAlert, User } from 'lucide-react';
import SeverityBadge from '../alerts/SeverityBadge';
import RiskScore from '../alerts/RiskScore';
import { formatDate } from '../../utils/formatters';
import { useApp } from '../../context/AppContext';

export default function UserRiskTable({ users = [] }) {
  const { setSelectedUser } = useApp();

  return (
    <div className="table-card">
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Identity / Actor</th>
              <th>Highest Severity</th>
              <th>Max Risk Score</th>
              <th>Alert Count</th>
              <th>Common Suspicious Actions</th>
              <th>Recent Event (UTC)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
                  No identity risks detected in the active dataset.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.actor}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        background: 'var(--bg-elevated)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-primary)'
                      }}>
                        <User size={15} />
                      </div>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u.actor}</span>
                    </div>
                  </td>
                  <td>
                    <SeverityBadge severity={u.highest_severity} />
                  </td>
                  <td>
                    <RiskScore score={u.highest_risk_score} />
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-elevated)',
                      fontWeight: 700,
                      fontSize: 12
                    }}>
                      {u.alert_count} alerts
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {u.common_actions.map((act, i) => (
                        <code key={i} style={{ fontSize: 11, background: 'var(--bg-elevated)', padding: '1px 5px', borderRadius: 3 }}>
                          {act}
                        </code>
                      ))}
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                    {formatDate(u.recent_event_time)}
                  </td>
                  <td>
                    <button
                      onClick={() => setSelectedUser(u)}
                      className="btn btn-secondary btn-sm"
                      title="Investigate Identity Risk Profile"
                    >
                      <Eye size={13} />
                      <span>Profile</span>
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
