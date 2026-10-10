import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, FileCode, CheckCircle, ShieldAlert } from 'lucide-react';
import Button from '../common/Button';
import { reportService } from '../../services/reportService';
import { SEVERITIES } from '../../utils/constants';
import { useApp } from '../../context/AppContext';

export default function ExportPanel() {
  const { isDemoMode, alerts, summary, showToast } = useApp();
  const [selectedFormat, setSelectedFormat] = useState('csv');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format) => {
    setIsExporting(true);
    try {
      if (isDemoMode) {
        // Offline demo export via client-side Blob
        let content = '';
        let mime = 'text/plain';
        let filename = `privilege_guard_demo_export.${format}`;

        if (format === 'csv') {
          mime = 'text/csv';
          filename = 'privilege_guard_alerts_demo.csv';
          const headers = ['Alert ID', 'Timestamp', 'Actor', 'Target User', 'Action', 'Rule', 'Risk Score', 'Severity', 'Explanation'];
          const rows = alerts.map((a) => [
            a.alert_id, a.timestamp, a.actor, a.target_user || '', a.action, a.rule_name, a.risk_score, a.severity, `"${a.explanation.replace(/"/g, '""')}"`
          ]);
          content = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        } else if (format === 'json') {
          mime = 'application/json';
          filename = 'privilege_guard_audit_demo.json';
          content = JSON.stringify({ summary, alerts }, null, 2);
        } else if (format === 'pdf') {
          showToast('Live PDF generation requires backend service in Live API mode.', 'info');
          setIsExporting(false);
          return;
        }

        const blob = new Blob([content], { type: mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        showToast(`Exported ${filename} successfully.`, 'success');
      } else {
        const sev = selectedSeverity === 'ALL' ? null : selectedSeverity;
        await reportService.exportReport(format, sev);
        showToast(`Exported ${format.toUpperCase()} report successfully.`, 'success');
      }
    } catch (err) {
      showToast(`Export failed: ${err.message}`, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }}>
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
          Generate Security Audit Reports
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          Export full telemetry evidence and detection assessments for external auditing and compliance.
        </p>
      </div>

      {/* Filter Options */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Filter by Severity:</span>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            style={{ fontSize: 13 }}
          >
            <option value="ALL">All Threat Severities</option>
            {SEVERITIES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Format Action Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16
      }}>
        {/* CSV Format */}
        <div style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--color-primary)' }}>
            <FileSpreadsheet size={22} />
            <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>Threat Alerts CSV</span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            RFC 4180 spreadsheet with detailed threat scores, actors, timestamps, and investigation statuses.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            icon={Download}
          >
            Download CSV
          </Button>
        </div>

        {/* JSON Audit Summary */}
        <div style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--color-low)' }}>
            <FileCode size={22} />
            <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>Audit JSON Summary</span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Machine-readable JSON telemetry schema for SIEM ingestion and analytical pipeline processing.
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleExport('json')}
            disabled={isExporting}
            icon={Download}
          >
            Download JSON
          </Button>
        </div>

        {/* Executive PDF Report */}
        <div style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--color-high)' }}>
            <FileText size={22} />
            <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>Executive PDF Report</span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Formatted executive report with executive metrics, top priority detections, and SOC playbooks.
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            icon={Download}
          >
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
