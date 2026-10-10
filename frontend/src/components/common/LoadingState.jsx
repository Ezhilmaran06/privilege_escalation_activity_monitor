import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Analyzing security logs...' }) {
  return (
    <div style={{
      padding: '48px 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px'
    }}>
      <Loader2 size={32} className="spin-animation" style={{ color: 'var(--color-primary)' }} />
      <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{message}</span>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-animation {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
