import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';

export function useAlerts() {
  const { alerts, loading, updateAlertStatus, setSelectedAlert } = useApp();
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('risk_score');
  const [sortDir, setSortDir] = useState('desc');

  const filteredAlerts = useMemo(() => {
    return alerts
      .filter((alert) => {
        if (severityFilter !== 'ALL' && alert.severity.toUpperCase() !== severityFilter.toUpperCase()) {
          return false;
        }
        if (statusFilter !== 'ALL' && alert.investigation_status !== statusFilter) {
          return false;
        }
        if (searchTerm) {
          const s = searchTerm.toLowerCase();
          const matchActor = alert.actor?.toLowerCase().includes(s);
          const matchTarget = alert.target_user?.toLowerCase().includes(s);
          const matchRule = alert.rule_name?.toLowerCase().includes(s);
          const matchExpl = alert.explanation?.toLowerCase().includes(s);
          const matchAction = alert.action?.toLowerCase().includes(s);
          if (!matchActor && !matchTarget && !matchRule && !matchExpl && !matchAction) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];
        if (sortBy === 'severity') {
          const ranks = { Critical: 4, High: 3, Medium: 2, Low: 1 };
          valA = ranks[a.severity] || 0;
          valB = ranks[b.severity] || 0;
        }
        if (valA < valB) return sortDir === 'asc' ? -1 : 1;
        if (valA > valB) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
  }, [alerts, severityFilter, statusFilter, searchTerm, sortBy, sortDir]);

  return {
    alerts: filteredAlerts,
    totalAlerts: alerts.length,
    loading,
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
    updateAlertStatus,
    setSelectedAlert
  };
}
