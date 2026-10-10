import React, { useState, useMemo } from 'react';
import { Clock, ShieldAlert, ArrowUpRight, Search, Filter } from 'lucide-react';
import SeverityBadge from '../alerts/SeverityBadge';
import RiskScore from '../alerts/RiskScore';
import { formatDate } from '../../utils/formatters';
import { SEVERITIES } from '../../utils/constants';
import { useApp } from '../../context/AppContext';

export default function ActivityTimeline({ items = [] }) {
  const { setSelectedAlert } = useApp();
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (severityFilter !== 'ALL' && item.severity.toUpperCase() !== severityFilter.toUpperCase()) {
        return false;
      }
      if (searchTerm) {
        const s = searchTerm.toLowerCase();
        return (
          item.actor.toLowerCase().includes(s) ||
          item.action.toLowerCase().includes(s) ||
          item.rule_name.toLowerCase().includes(s) ||
          (item.explanation && item.explanation.toLowerCase().includes(s))
        );
      }
      return true;
    });
  }, [items, severityFilter, searchTerm]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Timeline Filter Controls */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: '14px 18px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '6px 12px',
          gap: 8,
          width: 280
        }}>
          <Search size={14} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search timeline..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ background: 'transparent', border: 'none', padding: 0, width: '100%', fontSize: 13 }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Filter Severity:</span>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            style={{ fontSize: 13 }}
          >
            <option value="ALL">All Severities</option>
            {SEVERITIES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Timeline Stream */}
      <div style={{
        position: 'relative',
        paddingLeft: 28,
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}>
        {/* Vertical Guide Line */}
        <div style={{
          position: 'absolute',
          top: 8,
          bottom: 8,
          left: 11,
          width: 2,
          background: 'var(--border-color)'
        }} />

        {filteredItems.length === 0 ? (
          <div style={{
            padding: 32,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: 13
          }}>
            No timeline events match the filter parameters.
          </div>
        ) : (
          filteredItems.map((ev, idx) => (
            <div
              key={idx}
              style={{
                position: 'relative',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {/* Bullet Node */}
              <div style={{
                position: 'absolute',
                left: -23,
                top: 18,
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: ev.severity === 'Critical' ? 'var(--color-critical)' : (ev.severity === 'High' ? 'var(--color-high)' : 'var(--color-primary)'),
                border: '2px solid var(--bg-main)'
              }} />

              {/* Node Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 8
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <SeverityBadge severity={ev.severity} />
                  <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>
                    {ev.rule_name}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={12} />
                    {formatDate(ev.timestamp)}
                  </span>
                  <RiskScore score={ev.risk_score} />
                </div>
              </div>

              {/* Node Body */}
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {ev.explanation}
              </div>

              {/* Metadata Pill Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 8,
                borderTop: '1px solid var(--border-color)',
                fontSize: 12,
                color: 'var(--text-muted)'
              }}>
                <div style={{ display: 'flex', gap: 16 }}>
                  <span>Actor: <strong style={{ color: 'var(--text-primary)' }}>{ev.actor}</strong></span>
                  <span>Action: <code>{ev.action}</code></span>
                  {ev.source_ip && <span>IP: <code>{ev.source_ip}</code></span>}
                </div>

                {ev.alert_id && (
                  <button
                    onClick={() => setSelectedAlert(ev)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      color: 'var(--color-primary)',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <span>Investigate Alert</span>
                    <ArrowUpRight size={14} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
