import React, { useState } from 'react';
import { UploadCloud, Database, Download, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import FileDropzone from '../components/upload/FileDropzone';
import LogPreview from '../components/upload/LogPreview';
import UploadProgress from '../components/upload/UploadProgress';
import Button from '../components/common/Button';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { logService } from '../services/logService';
import { useApp } from '../context/AppContext';

export default function UploadLogs() {
  const { isDemoMode, setDatasetName, refreshData, showToast, loadDemo } = useApp();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [normalizedLogs, setNormalizedLogs] = useState([]);
  const [processingStats, setProcessingStats] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleAnalyzeUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(10);

    try {
      if (isDemoMode) {
        // Read file in browser for demo mode
        const reader = new FileReader();
        reader.onload = async (e) => {
          setUploadProgress(70);
          setDatasetName(selectedFile.name);
          setUploadProgress(100);
          showToast(`Loaded ${selectedFile.name} into Demo Workspace.`, 'success');
          setIsUploading(false);
        };
        reader.readAsText(selectedFile);
      } else {
        // Real upload to FastAPI backend
        setUploadProgress(40);
        const uploadRes = await logService.uploadLogs(selectedFile, (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        });

        // Trigger analysis
        const analyzeRes = await logService.analyzeLogs();
        setDatasetName(selectedFile.name);

        // Fetch preview
        const logsRes = await logService.getLogs({ page: 1, page_size: 15 });
        setNormalizedLogs(logsRes.items || []);
        setProcessingStats({
          total_records: uploadRes.total_records,
          accepted_records: uploadRes.accepted_records,
          rejected_records: uploadRes.rejected_records,
          duplicate_records: uploadRes.duplicate_records,
          success_rate: uploadRes.success_rate
        });

        await refreshData();
        showToast(`Analyzed ${uploadRes.accepted_records} events from ${selectedFile.name}.`, 'success');
      }
    } catch (err) {
      showToast(`Upload/Analysis failed: ${err.message}`, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const downloadSampleTemplate = (type) => {
    let content = '';
    let filename = '';
    let mime = '';

    if (type === 'csv') {
      filename = 'sample_audit_template.csv';
      mime = 'text/csv';
      content = `event_id,timestamp,actor,action,target_user,source_ip,previous_role,new_role,status,resource
EVT-001,2026-10-10T09:00:00Z,admin_user,login,admin_user,10.0.0.1,user,user,success,/login
EVT-002,2026-10-10T10:15:00Z,charlie_dev,role_elevation,charlie_dev,10.0.0.1,user,admin,success,IAM:RoleAssignment
EVT-003,2026-10-10T11:20:00Z,attacker_svc,create_user,backdoor_admin,10.0.0.5,,administrator,success,ActiveDirectory:Users
EVT-004,2026-10-10T11:45:00Z,operator_jim,add_member,david_contractor,10.10.1.50,contractor,Domain Admins,success,Domain Admins
`;
    } else {
      filename = 'sample_audit_template.json';
      mime = 'application/json';
      content = JSON.stringify({
        events: [
          {
            event_id: "EVT-J01",
            timestamp: "2026-10-10T09:00:00Z",
            username: "admin_user",
            activity: "login",
            target: "admin_user",
            ip_address: "10.0.0.1",
            from_role: "user",
            to_role: "user",
            outcome: "success"
          },
          {
            event_id: "EVT-J02",
            timestamp: "2026-10-10T10:15:00Z",
            username: "charlie_dev",
            activity: "role_elevation",
            target: "charlie_dev",
            ip_address: "10.0.0.1",
            from_role: "user",
            to_role: "admin",
            outcome: "success"
          }
        ]
      }, null, 2);
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename}`, 'info');
  };

  const handleClearData = () => {
    setSelectedFile(null);
    setNormalizedLogs([]);
    setProcessingStats(null);
    setShowClearConfirm(false);
    showToast('Upload workspace reset.', 'info');
  };

  return (
    <div>
      <PageHeader
        title="Ingest System Audit Logs"
        subtitle="Upload CSV or JSON authentication and privilege event streams for multi-rule anomaly analysis"
        actions={
          <div style={{ display: 'flex', gap: 10 }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => downloadSampleTemplate('csv')}
              icon={Download}
            >
              Sample CSV
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => downloadSampleTemplate('json')}
              icon={Download}
            >
              Sample JSON
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowClearConfirm(true)}
              icon={Trash2}
            >
              Reset Session
            </Button>
          </div>
        }
      />

      {/* Dropzone Container */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        marginBottom: 24
      }}>
        <FileDropzone
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          onAnalyze={handleAnalyzeUpload}
          onLoadDemo={loadDemo}
          isAnalyzing={isUploading}
        />

        {isUploading && (
          <UploadProgress
            progress={uploadProgress}
            statusText="Normalizing canonical event schema and correlating detection heuristics..."
          />
        )}
      </div>

      {/* Normalized Logs Ingestion Table */}
      {normalizedLogs.length > 0 && (
        <LogPreview events={normalizedLogs} stats={processingStats} />
      )}

      {/* Clear Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        title="Clear Current Session Data"
        message="This will reset the uploaded audit file workspace and clear pending file previews. Continue?"
        confirmText="Clear Workspace"
        isDanger={true}
        onConfirm={handleClearData}
        onCancel={() => setShowClearConfirm(false)}
      />
    </div>
  );
}
