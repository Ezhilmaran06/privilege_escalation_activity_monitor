import React from 'react';
import { AlertCircle, AlertTriangle, ShieldCheck, Flame } from 'lucide-react';

export default function SeverityBadge({ severity = 'Low' }) {
  const sevLower = severity.toLowerCase();

  const getIcon = () => {
    switch (sevLower) {
      case 'critical':
        return <Flame size={12} />;
      case 'high':
        return <AlertCircle size={12} />;
      case 'medium':
        return <AlertTriangle size={12} />;
      case 'low':
      default:
        return <ShieldCheck size={12} />;
    }
  };

  return (
    <span className={`severity-badge severity-${sevLower}`}>
      {getIcon()}
      <span>{severity}</span>
    </span>
  );
}
