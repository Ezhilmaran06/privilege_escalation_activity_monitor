import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';
import { alertService } from '../services/alertService';
import { logService } from '../services/logService';
import { MOCK_SUMMARY, MOCK_ALERTS, MOCK_USER_RISKS } from '../utils/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('privilege_guard_theme') || 'dark';
  });
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [datasetName, setDatasetName] = useState('PrivilegeGuard Synthetic Baseline');
  const [summary, setSummary] = useState(MOCK_SUMMARY);
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [userRisks, setUserRisks] = useState(MOCK_USER_RISKS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('privilege_guard_theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      const nextTheme = prevTheme === 'dark' ? 'light' : 'dark';
      return nextTheme;
    });
  }, []);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch live backend data
  const fetchData = useCallback(async () => {
    if (isDemoMode) {
      setSummary(MOCK_SUMMARY);
      setAlerts(MOCK_ALERTS);
      setUserRisks(MOCK_USER_RISKS);
      setDatasetName(MOCK_SUMMARY.dataset_name);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [sumData, alertsData, usersData] = await Promise.all([
        dashboardService.getSummary(),
        alertService.getAlerts({ page_size: 100 }),
        alertService.getUserRisks()
      ]);
      setSummary(sumData);
      setAlerts(alertsData.items || []);
      setUserRisks(usersData || []);
      setDatasetName(sumData.dataset_name || 'Active Audit Dataset');
    } catch (err) {
      console.warn('Backend unavailable, prompting demo fallback:', err.message);
      setError(err.message);
      // If user is starting up for first time and backend isn't up, auto-select demo mode smoothly
      setIsDemoMode(true);
      setSummary(MOCK_SUMMARY);
      setAlerts(MOCK_ALERTS);
      setUserRisks(MOCK_USER_RISKS);
      showToast('Backend offline. Switched to Demo Mode with synthetic cybersecurity logs.', 'info');
    } finally {
      setLoading(false);
    }
  }, [isDemoMode, showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleMode = () => {
    const nextMode = !isDemoMode;
    setIsDemoMode(nextMode);
    if (nextMode) {
      setSummary(MOCK_SUMMARY);
      setAlerts(MOCK_ALERTS);
      setUserRisks(MOCK_USER_RISKS);
      setDatasetName('Synthetic Enterprise Baseline');
      setError(null);
      showToast('Switched to Demo Mode (Standalone Mock Data)', 'info');
    } else {
      showToast('Switched to Live API Mode (Connecting to Backend)', 'info');
    }
  };

  const loadDemo = async () => {
    if (isDemoMode) {
      setSummary(MOCK_SUMMARY);
      setAlerts(MOCK_ALERTS);
      setUserRisks(MOCK_USER_RISKS);
      setDatasetName('PrivilegeGuard Synthetic Baseline');
      showToast('Reloaded synthetic demo dataset.', 'success');
      return;
    }
    setLoading(true);
    try {
      const res = await logService.loadDemo();
      setSummary(res.summary);
      await fetchData();
      showToast('Demo dataset loaded on server.', 'success');
    } catch (err) {
      setError(err.message);
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateAlertStatus = async (alertId, newStatus, notes = '') => {
    if (isDemoMode) {
      setAlerts((prev) =>
        prev.map((a) => (a.alert_id === alertId ? { ...a, investigation_status: newStatus } : a))
      );
      if (selectedAlert && selectedAlert.alert_id === alertId) {
        setSelectedAlert((prev) => ({ ...prev, investigation_status: newStatus }));
      }
      showToast(`Status updated to "${newStatus}" (Demo)`, 'success');
      return;
    }

    try {
      await alertService.updateStatus(alertId, newStatus, notes);
      setAlerts((prev) =>
        prev.map((a) => (a.alert_id === alertId ? { ...a, investigation_status: newStatus } : a))
      );
      if (selectedAlert && selectedAlert.alert_id === alertId) {
        setSelectedAlert((prev) => ({ ...prev, investigation_status: newStatus }));
      }
      showToast(`Investigation status updated to "${newStatus}".`, 'success');
    } catch (err) {
      showToast(`Failed to update status: ${err.message}`, 'error');
    }
  };

  const value = {
    theme,
    toggleTheme,
    isDemoMode,
    datasetName,
    setDatasetName,
    summary,
    setSummary,
    alerts,
    setAlerts,
    userRisks,
    loading,
    error,
    selectedAlert,
    setSelectedAlert,
    selectedUser,
    setSelectedUser,
    toasts,
    showToast,
    removeToast,
    searchQuery,
    setSearchQuery,
    toggleMode,
    loadDemo,
    refreshData: fetchData,
    updateAlertStatus
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
