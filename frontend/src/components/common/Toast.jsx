import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onClose }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      zIndex: 200,
      maxWidth: 380
    }}>
      {toasts.map((t) => {
        const isSuccess = t.type === 'success';
        const isError = t.type === 'error';
        const Icon = isSuccess ? CheckCircle2 : (isError ? AlertCircle : Info);
        const iconColor = isSuccess ? 'var(--color-low)' : (isError ? 'var(--color-critical)' : 'var(--color-primary)');

        return (
          <div
            key={t.id}
            style={{
              background: 'var(--bg-elevated)',
              border: `1px solid ${iconColor}`,
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              boxShadow: 'var(--shadow-lg)',
              animation: 'slideIn 0.2s ease forwards'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon size={18} style={{ color: iconColor, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{t.message}</span>
            </div>
            <button
              onClick={() => onClose(t.id)}
              style={{ color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
