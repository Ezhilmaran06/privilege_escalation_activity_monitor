import React from 'react';
import PageHeader from '../components/layout/PageHeader';
import AlertFilters from '../components/alerts/AlertFilters';
import AlertTable from '../components/alerts/AlertTable';
import LoadingState from '../components/common/LoadingState';
import { useAlerts } from '../hooks/useAlerts';
import { useApp } from '../context/AppContext';

export default function ThreatDetections() {
  const { isDemoMode } = useApp();
  const {
    alerts,
    totalAlerts,
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
    setSortDir
  } = useAlerts();

  const handleResetFilters = () => {
    setSeverityFilter('ALL');
    setStatusFilter('ALL');
    setSearchTerm('');
    setSortBy('risk_score');
    setSortDir('desc');
  };

  return (
    <div>
      <PageHeader
        title="Threat Detections & Alerts"
        subtitle={`Investigate ${totalAlerts} correlated suspicious administrative and privilege escalation activities`}
      />

      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden'
      }}>
        {/* Filter Toolbar */}
        <AlertFilters
          severityFilter={severityFilter}
          setSeverityFilter={setSeverityFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortDir={sortDir}
          setSortDir={setSortDir}
          onReset={handleResetFilters}
        />

        {/* Data Table */}
        {loading ? (
          <LoadingState message="Fetching detections..." />
        ) : (
          <AlertTable alerts={alerts} />
        )}
      </div>
    </div>
  );
}
