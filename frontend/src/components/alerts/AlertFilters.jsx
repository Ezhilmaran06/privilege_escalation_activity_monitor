import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { SEVERITIES, INVESTIGATION_STATUSES } from '../../utils/constants';

export default function AlertFilters({
  severityFilter,
  setSeverityFilter,
  statusFilter,
  setStatusFilter,
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  sortDir,
  setSortDir,
  onReset
}) {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 12,
      padding: '16px 20px',
      background: 'var(--bg-card)',
      borderBottom: '1px solid var(--border-color)'
    }}>
      {/* Search Input */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '6px 12px',
        gap: 8,
        flex: '1 1 240px',
        maxWidth: 320
      }}>
        <Search size={14} style={{ color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Filter by actor, rule, action..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ background: 'transparent', border: 'none', padding: 0, width: '100%', fontSize: 13 }}
        />
      </div>

      {/* Severity Filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Severity:</span>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          style={{ fontSize: 13 }}
        >
          <option value="ALL">All Severities</option>
          {SEVERITIES.map((sev) => (
            <option key={sev} value={sev}>{sev}</option>
          ))}
        </select>
      </div>

      {/* Investigation Status Filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Status:</span>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ fontSize: 13 }}
        >
          <option value="ALL">All Statuses</option>
          {INVESTIGATION_STATUSES.map((st) => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>
      </div>

      {/* Sort By */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Sort:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ fontSize: 13 }}
        >
          <option value="risk_score">Risk Score</option>
          <option value="timestamp">Timestamp</option>
          <option value="actor">Actor</option>
          <option value="severity">Severity</option>
        </select>
        <button
          onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
          style={{
            padding: '6px 10px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--text-secondary)'
          }}
          title="Toggle sort direction"
        >
          {sortDir.toUpperCase()}
        </button>
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '6px 10px',
          background: 'transparent',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          fontSize: 12,
          color: 'var(--text-muted)',
          cursor: 'pointer'
        }}
        title="Reset all filters"
      >
        <RotateCcw size={12} />
        <span>Reset</span>
      </button>
    </div>
  );
}
