import React, { useState } from 'react';
import { GLOSSARY_TERMS } from '../../data/helpContent';
import { BookMarked, Search } from 'lucide-react';

export default function Glossary({ filterQuery = '' }) {
  const [localSearch, setLocalSearch] = useState('');
  const query = (filterQuery || localSearch).toLowerCase().trim();

  const filteredTerms = GLOSSARY_TERMS.filter((item) => {
    if (!query) return true;
    return item.term.toLowerCase().includes(query) || item.def.toLowerCase().includes(query);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
          Cybersecurity & IAM Glossary
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          Plain-language definitions of key access management, detection engineering, and SOC operational terminology.
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
            placeholder="Search glossary terms..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            style={{ background: 'transparent', border: 'none', padding: 0, width: '100%', fontSize: 13 }}
          />
        </div>
      )}

      {filteredTerms.length === 0 ? (
        <div style={{
          padding: 32,
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: 13
        }}>
          No glossary definitions matched "{query}".
        </div>
      ) : (
        <div className="glossary-grid">
          {filteredTerms.map((t, idx) => (
            <div key={idx} className="glossary-card">
              <div className="glossary-term">{t.term}</div>
              <div className="glossary-def">{t.def}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
