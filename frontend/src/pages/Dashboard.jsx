import React from 'react';
import {
  FileText,
  ShieldAlert,
  Flame,
  Users,
  CheckCircle2,
  RefreshCw,
  UploadCloud,
  Database
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import MetricCard from '../components/dashboard/MetricCard';
import SeverityChart from '../components/dashboard/SeverityChart';
import ActivityChart from '../components/dashboard/ActivityChart';
import TopUsersChart from '../components/dashboard/TopUsersChart';
import RuleFrequencyChart from '../components/dashboard/RuleFrequencyChart';
import RecentAlerts from '../components/dashboard/RecentAlerts';
import Button from '../components/common/Button';
import LoadingState from '../components/common/LoadingState';
import ErrorMessage from '../components/common/ErrorMessage';
import { useApp } from '../context/AppContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { summary, alerts, loading, error, refreshData, loadDemo, isDemoMode, datasetName } = useApp();

  if (loading && !summary) {
    return <LoadingState message="Aggregating telemetry and detection metrics..." />;
  }

  return (
    <div>
      <PageHeader
        title="Identity & Access Threat Overview"
        subtitle={`Dataset: ${datasetName} • Monitoring unauthorized privilege transitions and abnormal administrative actions`}
        actions={
          <div style={{ display: 'flex', gap: 10 }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={refreshData}
              icon={RefreshCw}
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/upload')}
              icon={UploadCloud}
            >
              Upload Logs
            </Button>
          </div>
        }
      />

      {error && !isDemoMode && (
        <ErrorMessage
          message={error}
          onRetry={refreshData}
        />
      )}

      {/* 5 Metric Cards */}
      <div className="metric-grid">
        <MetricCard
          title="Total Events Analyzed"
          value={summary?.total_events?.toLocaleString() || '0'}
          subtext="Normalized audit records"
          icon={FileText}
          iconColor="var(--color-primary)"
        />

        <MetricCard
          title="Suspicious Activities"
          value={summary?.suspicious_alerts?.toLocaleString() || '0'}
          subtext="Total detection triggers"
          icon={ShieldAlert}
          iconColor="var(--color-high)"
          accentColor="var(--color-high)"
        />

        <MetricCard
          title="Critical & High Alerts"
          value={summary?.critical_high_alerts?.toLocaleString() || '0'}
          subtext="Immediate triage priority"
          icon={Flame}
          iconColor="var(--color-critical)"
          accentColor="var(--color-critical)"
        />

        <MetricCard
          title="Affected Identities"
          value={summary?.affected_users?.toLocaleString() || '0'}
          subtext="Actors & target users"
          icon={Users}
          iconColor="var(--color-medium)"
        />

        <MetricCard
          title="Ingestion Success Rate"
          value={`${summary?.processing_success_rate || 100}%`}
          subtext="Schema normalization rate"
          icon={CheckCircle2}
          iconColor="var(--color-low)"
        />
      </div>

      {/* Visual Analytics Charts Grid 1 */}
      <div className="charts-grid-2">
        <SeverityChart data={summary?.severity_distribution} />
        <ActivityChart data={summary?.timeline_overview || []} />
      </div>

      {/* Visual Analytics Charts Grid 2 */}
      <div className="charts-grid-2">
        <TopUsersChart data={summary?.top_affected_users || []} />
        <RuleFrequencyChart data={summary?.rule_frequency || []} />
      </div>

      {/* Recent Alerts Feed */}
      <RecentAlerts alerts={alerts || []} />
    </div>
  );
}
