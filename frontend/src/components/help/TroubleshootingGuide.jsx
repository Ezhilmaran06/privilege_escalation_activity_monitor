import React, { useState } from 'react';
import { TROUBLESHOOTING_ITEMS } from '../../data/helpContent';
import { Wrench, AlertCircle, CheckCircle2, Search } from 'lucide-react';
import HelpAccordion from './HelpAccordion';

export default function TroubleshootingGuide({ filterQuery = '' }) {
  const [localSearch, setLocalSearch] = useState('');
  const query = (filterQuery || localSearch).toLowerCase().trim();

  const filteredItems = TROUBLESHOOTING_ITEMS.filter((item) => {
    if (!query) return true;
    return (
      item.problem.toLowerCase().includes(query) ||
      item.cause.toLowerCase().includes(query) ||
      item.solution.toLowerCase().includes(query)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
          Troubleshooting & Problem Resolution
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          Quick diagnosis and practical fixes for ingestion errors, connectivity issues, scoring questions, and reporting.
        </p>
      </div>

      {!filterQuery && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '8px 14px',
          gap: 8,
          maxWidth: 360
        }}>
          <Search size={14} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search problems..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            style={{ background: 'transparent', border: 'none', padding: 0, width: '100%', fontSize: 13 }}
          />
        </div>
      )}

      {filteredItems.length === 0 ? (
        <div style={{
          padding: 32,
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: 13
        }}>
          No troubleshooting articles matched "{query}".
        </div>
      ) : (
        filteredItems.map((item, idx) => (
          <HelpAccordion
            key={idx}
            title={item.problem}
            icon={Wrench}
            defaultOpen={idx === 0 && !query}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <strong style={{ color: 'var(--color-critical)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <AlertCircle size={14} />
                  <span>Probable Cause:</span>
                </strong>
                <p style={{ color: 'var(--text-secondary)' }}>{item.cause}</p>
              </div>

              <div style={{
                background: 'var(--bg-main)',
                padding: 12,
                borderRadius: 'var(--radius-sm)',
                borderLeft: '3px solid var(--color-low)'
              }}>
                <strong style={{ color: 'var(--color-low)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <CheckCircle2 size={14} />
                  <span>Recommended Solution:</span>
                </strong>
                <p style={{ color: 'var(--text-primary)' }}>{item.solution}</p>
              </div>
            </div>
          </HelpAccordion>
        ))
      )}
    </div>
  );
}
