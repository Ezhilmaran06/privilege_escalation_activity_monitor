import React, { useState, useEffect } from 'react';
import PageHeader from '../components/layout/PageHeader';
import ExportPanel from '../components/reports/ExportPanel';
import LoadingState from '../components/common/LoadingState';
import { reportService } from '../services/reportService';
import { useApp } from '../context/AppContext';

export default function Reports() {
  const { summary, alerts, isDemoMode } = useApp();
  const [reportSummary, setReportSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadReportData() {
      if (isDemoMode) {
        setReportSummary({
          generated_at: new Date().toISOString(),
          dataset_name: summary?.dataset_name || 'PrivilegeGuard Synthetic Enterprise Baseline',
          total_events: summary?.total_events || 125,
          total_alerts: alerts.length,
          severity_counts: summary?.severity_distribution || {},
          rule_counts: (summary?.rule_frequency || []).reduce((acc, r) => ({ ...acc, [r.rule]: r.count }), {}),
          system_recommendations: [
            "Prioritize investigation of accounts with sequence correlation alerts (Rule 8).",
            "Audit all after-hours privilege elevations against approved maintenance change requests.",
            "Verify all additions to sensitive groups (Administrators, sudo, Domain Admins).",
            "Revoke stale or unexpected elevated role grants immediately."
          ],
          disclaimer: "PrivilegeGuard identifies potentially suspicious activity based on rule heuristics and contextual indicators. It does not confirm an attack occurred without SOC analyst verification."
        });
        return;
      }

      setLoading(true);
      try {
        const res = await reportService.getSummary();
        setReportSummary(res);
      } catch (err) {
        console.warn('Report summary fetch fallback:', err);
      } finally {
        setLoading(false);
      }
    }

    loadReportData();
  }, [isDemoMode, summary, alerts]);

  return (
    <div>
      <PageHeader
        title="Security Reports & Export Center"
        subtitle="Download forensic audit documentation, evidence spreadsheets, and executive compliance reports"
      />

      <ExportPanel />

      {/* Audit Executive Summary Card */}
      {reportSummary && (
        <div style={{
          marginTop: 24,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: 24
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
            Active Dataset Audit Summary
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16,
            marginBottom: 20,
            padding: 16,
            background: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-md)'
          }}>
            <div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Dataset Identifier:</span>
              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-primary)' }}>
                {reportSummary.dataset_name}
              </div>
            </div>
            <div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Total Events:</span>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{reportSummary.total_events}</div>
            </div>
            <div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Detected Alerts:</span>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-critical)' }}>
                {reportSummary.total_alerts}
              </div>
            </div>
            <div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Generated Timestamp:</span>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                {new Date(reportSummary.generated_at).toLocaleString()}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
              Standard Recommended SOC Mitigations:
            </h4>
            <ul style={{ paddingLeft: 20, fontSize: 13, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {reportSummary.system_recommendations?.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>

          <div style={{
            fontSize: 11,
            color: 'var(--text-muted)',
            fontStyle: 'italic',
            borderTop: '1px solid var(--border-color)',
            paddingTop: 12
          }}>
            {reportSummary.disclaimer}
          </div>
        </div>
      )}
    </div>
  );
}
