import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, X, CheckCircle, Database, AlertCircle } from 'lucide-react';
import Button from '../common/Button';

export default function FileDropzone({
  selectedFile,
  setSelectedFile,
  onAnalyze,
  onLoadDemo,
  isAnalyzing = false
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileError, setFileError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const validateAndSetFile = (file) => {
    setFileError(null);
    if (!file) return;

    const validExtensions = ['.csv', '.json'];
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!validExtensions.includes(ext)) {
      setFileError('Invalid file format. Please upload a CSV or JSON system audit log.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError('File exceeds maximum upload size of 10 MB.');
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Drop Area */}
      <div
        className={`dropzone ${isDragOver ? 'active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !selectedFile && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".csv,.json"
          style={{ display: 'none' }}
        />

        {!selectedFile ? (
          <>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: 'rgba(59, 130, 246, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)'
            }}>
              <UploadCloud size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                Drag and Drop Audit Log File
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                Supports RFC 4180 CSV and JSON event records up to 10 MB
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Browse Local Files
            </Button>
          </>
        ) : (
          <div style={{ width: '100%', maxWidth: 460, textAlign: 'left' }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <FileText size={22} style={{ color: 'var(--color-primary)' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>
                    {selectedFile.name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {formatFileSize(selectedFile.size)}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                style={{ color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
                title="Remove file"
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <Button
                variant="primary"
                onClick={onAnalyze}
                disabled={isAnalyzing}
                style={{ flex: 1 }}
              >
                {isAnalyzing ? 'Ingesting & Analyzing...' : 'Analyze Audit Logs'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setSelectedFile(null)}
                disabled={isAnalyzing}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {fileError && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          color: 'var(--color-critical)',
          fontSize: 13,
          padding: '8px 12px',
          background: 'rgba(239, 68, 68, 0.1)',
          borderRadius: 'var(--radius-sm)'
        }}>
          <AlertCircle size={16} />
          <span>{fileError}</span>
        </div>
      )}

      {/* Quick Load Synthetic Demo Dataset */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 18px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Database size={18} style={{ color: 'var(--color-medium)' }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
              Synthetic Benchmark Dataset
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              125 pre-configured events testing all 9 privilege escalation detection rules
            </div>
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={onLoadDemo}
          disabled={isAnalyzing}
        >
          Load Synthetic Logs
        </Button>
      </div>
    </div>
  );
}
