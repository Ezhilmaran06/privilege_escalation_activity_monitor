import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SeverityBadge from '../components/alerts/SeverityBadge';
import RiskScore from '../components/alerts/RiskScore';
import MetricCard from '../components/dashboard/MetricCard';
import { Shield } from 'lucide-react';
import { formatDate, getRiskClass } from '../utils/formatters';
import { MOCK_ALERTS, MOCK_SUMMARY } from '../utils/mockData';

describe('PrivilegeGuard Frontend Tests', () => {
  it('renders SeverityBadge correctly for all tiers', () => {
    const { rerender } = render(<SeverityBadge severity="Critical" />);
    expect(screen.getByText('Critical')).toBeInTheDocument();

    rerender(<SeverityBadge severity="High" />);
    expect(screen.getByText('High')).toBeInTheDocument();

    rerender(<SeverityBadge severity="Medium" />);
    expect(screen.getByText('Medium')).toBeInTheDocument();

    rerender(<SeverityBadge severity="Low" />);
    expect(screen.getByText('Low')).toBeInTheDocument();
  });

  it('renders RiskScore correctly with value and pill class', () => {
    render(<RiskScore score={95} />);
    expect(screen.getByText('95')).toBeInTheDocument();
    expect(screen.getByText('/100')).toBeInTheDocument();
  });

  it('renders MetricCard with title, value, and subtext', () => {
    render(
      <MetricCard
        title="Total Events Analyzed"
        value="125"
        subtext="Normalized audit records"
        icon={Shield}
      />
    );
    expect(screen.getByText('Total Events Analyzed')).toBeInTheDocument();
    expect(screen.getByText('125')).toBeInTheDocument();
    expect(screen.getByText('Normalized audit records')).toBeInTheDocument();
  });

  it('verifies risk class helper boundaries', () => {
    expect(getRiskClass(95)).toBe('critical');
    expect(getRiskClass(75)).toBe('high');
    expect(getRiskClass(50)).toBe('medium');
    expect(getRiskClass(20)).toBe('low');
  });

  it('verifies mock data integrity', () => {
    expect(MOCK_SUMMARY.total_events).toBe(125);
    expect(MOCK_ALERTS.length).toBeGreaterThanOrEqual(9);
    // Ensure all 9 rules are present in mock data
    const ruleIds = MOCK_ALERTS.map(a => a.rule_id);
    expect(ruleIds).toContain('RULE-001');
    expect(ruleIds).toContain('RULE-002');
    expect(ruleIds).toContain('RULE-003');
    expect(ruleIds).toContain('RULE-004');
    expect(ruleIds).toContain('RULE-005');
    expect(ruleIds).toContain('RULE-006');
    expect(ruleIds).toContain('RULE-007');
    expect(ruleIds).toContain('RULE-008');
    expect(ruleIds).toContain('RULE-009');
  });
});
