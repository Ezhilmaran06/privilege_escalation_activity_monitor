import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

export default function ErrorMessage({ message, onRetry = null }) {
  return (
    <div style={{
      padding: '20px',
      borderRadius: 'var(--radius-md)',
      background: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      margin: '16px 0'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <AlertTriangle size={20} style={{ color: 'var(--color-critical)', flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: 600, color: 'var(--color-critical)', fontSize: 14 }}>Connection Alert</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{message}</div>
        </div>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} icon={RefreshCw}>
          Retry
        </Button>
      )}
    </div>
  );
}
