import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  UploadCloud,
  ShieldAlert,
  Clock,
  Users,
  FileText,
  BookOpen,
  Info,
  Database
} from 'lucide-react';
import { NAV_ITEMS } from '../../utils/constants';
import { useApp } from '../../context/AppContext';

const ICONS = {
  LayoutDashboard,
  UploadCloud,
  ShieldAlert,
  Clock,
  Users,
  FileText,
  BookOpen,
  Info
};

export default function Sidebar() {
  const { datasetName, isDemoMode, summary } = useApp();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-shield">
          <Shield size={20} />
        </div>
        <div className="brand-text">
          <span className="brand-title">PrivilegeGuard</span>
          <span className="brand-tag">SOC Escalation Monitor</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const Icon = ICONS[item.icon] || Info;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              end={item.path === '/'}
            >
              <Icon className="nav-icon" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="dataset-badge">
          <span className="dataset-name-label">Dataset:</span>
          <span className="dataset-name-val" title={datasetName}>{datasetName}</span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: 'var(--text-muted)',
          padding: '0 2px'
        }}>
          <span>Mode: <strong style={{ color: isDemoMode ? 'var(--color-medium)' : 'var(--color-low)' }}>
            {isDemoMode ? 'Demo Mode' : 'Live API'}
          </strong></span>
          <span>Alerts: <strong style={{ color: 'var(--color-critical)' }}>{summary?.suspicious_alerts || 0}</strong></span>
        </div>
      </div>
    </aside>
  );
}
