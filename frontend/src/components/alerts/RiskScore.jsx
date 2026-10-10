import React from 'react';
import { getRiskClass } from '../../utils/formatters';

export default function RiskScore({ score }) {
  const riskClass = getRiskClass(score);

  return (
    <div className="risk-score-wrap">
      <span className={`risk-pill ${riskClass}`}>{score}</span>
      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>/100</span>
    </div>
  );
}
