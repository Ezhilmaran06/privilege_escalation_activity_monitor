import React from 'react';

export default function UploadProgress({ progress = 0, statusText = 'Uploading...' }) {
  return (
    <div style={{
      padding: '16px 20px',
      background: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-md)',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      margin: '16px 0'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{statusText}</span>
        <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{progress}%</span>
      </div>
      <div style={{
        height: 6,
        background: 'var(--bg-elevated)',
        borderRadius: 'var(--radius-full)',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: 'var(--color-primary)',
          transition: 'width 0.2s ease'
        }} />
      </div>
    </div>
  );
}
