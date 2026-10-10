import React from 'react';
import { Search, X } from 'lucide-react';

export default function HelpSearch({ searchTerm, setSearchTerm, resultCount = null }) {
  return (
    <div className="help-search-container">
      <Search size={18} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
      <input
        type="text"
        className="help-search-input"
        placeholder="Search help topics, detection rules, FAQs, troubleshooting, glossary..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {resultCount !== null && searchTerm.trim() && (
        <span style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          {resultCount} {resultCount === 1 ? 'match' : 'matches'}
        </span>
      )}
      {searchTerm && (
        <button
          className="help-search-clear"
          onClick={() => setSearchTerm('')}
          title="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
