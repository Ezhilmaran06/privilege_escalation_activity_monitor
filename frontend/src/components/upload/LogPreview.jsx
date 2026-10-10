import React from 'react';
import { formatDate } from '../../utils/formatters';

export default function LogPreview({ events = [], stats = null }) {
  const previewRows = events.slice(0, 10);

  return (
    <div className="table-card" style={{ marginTop: 20 }}>
      <div className="table-toolbar">
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
            Normalized Event Ingestion Stream
          </h3>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Canonical schema normalization preview (Showing top 10 records)
          </span>
        </div>

        {stats && (
          <div style={{ display: 'flex', gap: 12, fontSize: 12 }}>
            <span>Total: <strong>{stats.total_records}</strong></span>
            <span style={{ color: 'var(--color-low)' }}>Accepted: <strong>{stats.accepted_records}</strong></span>
            {stats.rejected_records > 0 && (
              <span style={{ color: 'var(--color-critical)' }}>Rejected: <strong>{stats.rejected_records}</strong></span>
            )}
            {stats.duplicate_records > 0 && (
              <span style={{ color: 'var(--color-medium)' }}>Duplicates: <strong>{stats.duplicate_records}</strong></span>
            )}
            <span>Success Rate: <strong>{stats.success_rate}%</strong></span>
          </div>
        )}
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Event ID</th>
              <th>Timestamp (UTC)</th>
              <th>Actor</th>
              <th>Action</th>
              <th>Target User</th>
              <th>Source IP</th>
              <th>Prev Role</th>
              <th>New Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {previewRows.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>
                  No parsed records to display.
                </td>
              </tr>
            ) : (
              previewRows.map((e) => (
                <tr key={e.event_id}>
                  <td>
                    <code style={{ fontSize: 11, color: 'var(--color-primary)' }}>{e.event_id}</code>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    {formatDate(e.timestamp)}
                  </td>
                  <td style={{ fontWeight: 600 }}>{e.actor}</td>
                  <td>
                    <code style={{ fontSize: 11, background: 'var(--bg-elevated)', padding: '2px 6px', borderRadius: 4 }}>
                      {e.action}
                    </code>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{e.target_user || '—'}</td>
                  <td><code>{e.source_ip || '—'}</code></td>
                  <td>{e.previous_role || '—'}</td>
                  <td>
                    <strong style={{ color: e.new_role ? 'var(--color-primary)' : 'inherit' }}>
                      {e.new_role || '—'}
                    </strong>
                  </td>
                  <td>
                    <span style={{
                      color: e.status === 'success' ? 'var(--color-low)' : 'var(--color-critical)',
                      fontWeight: 600,
                      fontSize: 12
                    }}>
                      {e.status}
                    </span>
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
