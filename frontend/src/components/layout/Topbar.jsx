import React from 'react';
import { useLocation } from 'react-router-dom';
import { Search, RefreshCw, Bell, ShieldAlert, Cpu } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NAV_ITEMS } from '../../utils/constants';

export default function Topbar() {
  const location = useLocation();
  const {
    isDemoMode,
    toggleMode,
    refreshData,
    loading,
    summary,
    searchQuery,
    setSearchQuery
  } = useApp();

  const currentNav = NAV_ITEMS.find((item) => item.path === location.pathname) || {
    label: 'Overview Dashboard'
  };

  const notificationCount = summary?.critical_high_alerts || 0;

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            PrivilegeGuard /
          </span>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
            {currentNav.label}
          </h2>
        </div>
      </div>

      <div className="topbar-right">
        {/* Search */}
        <div className="search-box">
          <Search size={14} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search actors, rules, IPs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Demo / API Mode Switcher */}
        <button
          className={`mode-toggle-btn ${isDemoMode ? 'demo' : 'api'}`}
          onClick={toggleMode}
          title="Click to toggle between Demo (mock data) and Live API mode"
        >
          <Cpu size={14} />
          <span>{isDemoMode ? 'Demo Mode' : 'Live API'}</span>
        </button>

        {/* Refresh */}
        <button
          onClick={refreshData}
          disabled={loading}
          style={{
            color: 'var(--text-secondary)',
            padding: '6px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer'
          }}
          title="Refresh Data"
        >
          <RefreshCw size={16} className={loading ? 'spin-animation' : ''} />
        </button>

        {/* Notification indicator */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }} title={`${notificationCount} Critical/High Alerts`}>
          <Bell size={18} style={{ color: 'var(--text-secondary)' }} />
          {notificationCount > 0 && (
            <span style={{
              position: 'absolute',
              top: -6,
              right: -6,
              background: 'var(--color-critical)',
              color: '#FFFFFF',
              fontSize: 10,
              fontWeight: 700,
              borderRadius: 'var(--radius-full)',
              padding: '1px 5px',
              lineHeight: 1
            }}>
              {notificationCount}
            </span>
          )}
        </div>

        {/* Analyst Profile */}
        <div className="analyst-profile">
          <div className="analyst-avatar">SOC</div>
          <div className="analyst-info">
            <span className="analyst-name">Analyst Console</span>
            <span className="analyst-role">Tier-2 IAM Responder</span>
          </div>
        </div>
      </div>
    </header>
  );
}
