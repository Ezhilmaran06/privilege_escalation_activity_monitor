import React from 'react';

export default function MetricCard({
  title,
  value,
  subtext,
  icon: Icon,
  iconColor = 'var(--color-primary)',
  accentColor = null
}) {
  return (
    <div
      className="metric-card"
      style={accentColor ? { borderTop: `3px solid ${accentColor}` } : {}}
    >
      <div className="metric-header">
        <span className="metric-title">{title}</span>
        <div className="metric-icon-wrap" style={{ color: iconColor }}>
          <Icon size={18} />
        </div>
      </div>
      <div className="metric-value">{value}</div>
      {subtext && <div className="metric-sub">{subtext}</div>}
    </div>
  );
}
