import test from 'node:test';
import assert from 'node:assert/strict';

import { getRiskClass, formatDate } from '../utils/formatters.js';
import { MOCK_ALERTS, MOCK_SUMMARY, MOCK_USER_RISKS } from '../utils/mockData.js';
import { SEVERITIES, INVESTIGATION_STATUSES, NAV_ITEMS } from '../utils/constants.js';

test('Risk scoring classification tiers match requirements', () => {
  assert.equal(getRiskClass(95), 'critical');
  assert.equal(getRiskClass(75), 'high');
  assert.equal(getRiskClass(50), 'medium');
  assert.equal(getRiskClass(20), 'low');
});

test('Navigation routes are fully defined', () => {
  assert.equal(NAV_ITEMS.length, 8);
  const paths = NAV_ITEMS.map((n) => n.path);
  assert.ok(paths.includes('/'));
  assert.ok(paths.includes('/upload'));
  assert.ok(paths.includes('/detections'));
  assert.ok(paths.includes('/timeline'));
  assert.ok(paths.includes('/users'));
  assert.ok(paths.includes('/reports'));
  assert.ok(paths.includes('/help'));
  assert.ok(paths.includes('/about'));
});

test('Severity list and investigation statuses match schema', () => {
  assert.deepEqual(SEVERITIES, ['Critical', 'High', 'Medium', 'Low']);
  assert.ok(INVESTIGATION_STATUSES.includes('New'));
  assert.ok(INVESTIGATION_STATUSES.includes('Under Investigation'));
  assert.ok(INVESTIGATION_STATUSES.includes('Reviewed'));
  assert.ok(INVESTIGATION_STATUSES.includes('False Positive'));
});

test('Mock summary integrity matches specification', () => {
  assert.equal(MOCK_SUMMARY.total_events, 125);
  assert.equal(MOCK_SUMMARY.suspicious_alerts, 9);
  assert.equal(MOCK_SUMMARY.critical_high_alerts, 5);
  assert.equal(MOCK_SUMMARY.processing_success_rate, 100.0);
  assert.equal(MOCK_SUMMARY.severity_distribution.Critical, 2);
  assert.equal(MOCK_SUMMARY.severity_distribution.High, 3);
});

test('All 9 cyber detection rules are covered in mock dataset', () => {
  const ruleIds = MOCK_ALERTS.map((a) => a.rule_id);
  for (let i = 1; i <= 9; i++) {
    const expectedId = `RULE-00${i}`;
    assert.ok(ruleIds.includes(expectedId), `Missing mock test case for ${expectedId}`);
  }
});

test('User risk analysis data is well-formed', () => {
  assert.ok(MOCK_USER_RISKS.length >= 8);
  const topUser = MOCK_USER_RISKS[0];
  assert.equal(topUser.actor, 'infiltrator_x');
  assert.equal(topUser.highest_risk_score, 95);
  assert.equal(topUser.highest_severity, 'Critical');
});

test('Help Desk documentation data structures are comprehensive', async () => {
  const { DETECTION_RULES_REFERENCE, COMMON_SCENARIOS, TROUBLESHOOTING_ITEMS, FAQS, GLOSSARY_TERMS, WORKFLOW_STEPS, USE_CASES, USER_PERSONAS } = await import('../data/helpContent.js');
  assert.equal(DETECTION_RULES_REFERENCE.length, 9);
  assert.equal(COMMON_SCENARIOS.length, 6);
  assert.equal(TROUBLESHOOTING_ITEMS.length, 11);
  assert.equal(FAQS.length, 16);
  assert.equal(GLOSSARY_TERMS.length, 20);
  assert.equal(WORKFLOW_STEPS.length, 8);
  assert.equal(USE_CASES.length, 6);
  assert.equal(USER_PERSONAS.length, 6);
});
