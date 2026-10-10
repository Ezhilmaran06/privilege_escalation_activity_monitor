import React, { useState } from 'react';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import SeverityBadge from './SeverityBadge';
import RiskScore from './RiskScore';
import { formatDate } from '../../utils/formatters';
import { useApp } from '../../context/AppContext';

export default function AlertTable({ alerts = [] }) {
  const { setSelectedAlert } = useApp();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const totalPages = Math.ceil(alerts.length / pageSize) || 1;
  const paginatedAlerts = alerts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getStatusClass = (st) => {
    switch (st) {
      case 'New': return 'new';
      case 'Under Investigation': return 'under_investigation';
      case 'Reviewed': return 'reviewed';
      case 'False Positive': return 'false_positive';
      default: return '';
    }
  };

  return (
    <div className="table-card">
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Severity</th>
              <th>Alert ID</th>
              <th>Timestamp (UTC)</th>
              <th>Actor</th>
              <th>Target</th>
              <th>Action</th>
              <th>Detection Rule</th>
              <th>Risk Score</th>
              <th>Status</th>
              <th>Investigate</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAlerts.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
                  No detections match the selected filters.
                </td>
              </tr>
            ) : (
              paginatedAlerts.map((alert) => (
                <tr key={alert.alert_id}>
                  <td>
                    <SeverityBadge severity={alert.severity} />
                  </td>
                  <td>
                    <code style={{ fontSize: 11, color: 'var(--color-primary)' }}>
                      {alert.alert_id.substring(0, 14)}
                    </code>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                    {formatDate(alert.timestamp)}
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{alert.actor}</span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {alert.target_user || '—'}
                  </td>
                  <td>
                    <code style={{ fontSize: 12, background: 'var(--bg-elevated)', padding: '2px 6px', borderRadius: 4 }}>
                      {alert.action}
                    </code>
                  </td>
                  <td style={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={alert.rule_name}>
                    {alert.rule_name}
                  </td>
                  <td>
                    <RiskScore score={alert.risk_score} />
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusClass(alert.investigation_status)}`}>
                      {alert.investigation_status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => setSelectedAlert(alert)}
                      className="btn btn-secondary btn-sm"
                      title="Review Alert Details & Evidence"
                    >
                      <Eye size={13} />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {alerts.length > pageSize && (
        <div className="pagination-wrap">
          <span>
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, alerts.length)} of {alerts.length} detections
          </span>
          <div className="pagination-controls">
            <button
              className="btn btn-secondary btn-sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft size={14} />
              Previous
            </button>
            <span style={{ display: 'flex', alignItems: 'center', padding: '0 8px', fontSize: 12 }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-secondary btn-sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
