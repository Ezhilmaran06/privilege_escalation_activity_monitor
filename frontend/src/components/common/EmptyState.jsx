import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function EmptyState({
  title = 'No Records Found',
  description = 'There are no items to display matching the current criteria.',
  icon: Icon = ShieldCheck,
  action = null
}) {
  return (
    <div style={{
      padding: '48px 24px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px'
    }}>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        background: 'rgba(59, 130, 246, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-primary)'
      }}>
        <Icon size={24} />
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</h3>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 400 }}>{description}</p>
      {action && <div style={{ marginTop: 8 }}>{action}</div>}
    </div>
  );
}
