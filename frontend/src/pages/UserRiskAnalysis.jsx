import React from 'react';
import PageHeader from '../components/layout/PageHeader';
import UserRiskTable from '../components/users/UserRiskTable';
import LoadingState from '../components/common/LoadingState';
import { useApp } from '../context/AppContext';

export default function UserRiskAnalysis() {
  const { userRisks, loading } = useApp();

  return (
    <div>
      <PageHeader
        title="Identity & User Risk Profiling"
        subtitle="Behavioral risk prioritization of identities exhibiting anomalous privilege adjustments or credential anomalies"
      />

      {/* Guidance Alert Banner */}
      <div style={{
        padding: '14px 18px',
        background: 'rgba(59, 130, 246, 0.08)',
        border: '1px solid rgba(59, 130, 246, 0.25)',
        borderRadius: 'var(--radius-md)',
        marginBottom: 20,
        fontSize: 13,
        color: 'var(--text-secondary)',
        lineHeight: 1.5
      }}>
        <strong style={{ color: 'var(--color-primary)' }}>SOC Triage Note:</strong> User risk profiles aggregate suspicious events and frequency to help prioritize analyst investigation order. An elevated score is an investigation trigger, never conclusive proof of malicious intent.
      </div>

      {loading ? (
        <LoadingState message="Calculating identity risk baselines..." />
      ) : (
        <UserRiskTable users={userRisks || []} />
      )}
    </div>
  );
}
