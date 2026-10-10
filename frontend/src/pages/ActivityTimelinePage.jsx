import React, { useState, useEffect } from 'react';
import PageHeader from '../components/layout/PageHeader';
import ActivityChart from '../components/dashboard/ActivityChart';
import ActivityTimeline from '../components/timeline/ActivityTimeline';
import LoadingState from '../components/common/LoadingState';
import { alertService } from '../services/alertService';
import { useApp } from '../context/AppContext';

export default function ActivityTimelinePage() {
  const { isDemoMode, summary, alerts } = useApp();
  const [timelineItems, setTimelineItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadTimeline() {
      if (isDemoMode) {
        // Build timeline from alerts
        const items = alerts.map((a) => ({
          timestamp: a.timestamp,
          actor: a.actor,
          action: a.action,
          severity: a.severity,
          risk_score: a.risk_score,
          rule_name: a.rule_name,
          alert_id: a.alert_id,
          target_user: a.target_user,
          source_ip: a.source_ip,
          is_alert: true,
          explanation: a.explanation
        }));
        items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setTimelineItems(items);
        return;
      }

      setLoading(true);
      try {
        const res = await alertService.getTimeline();
        setTimelineItems(res.timeline || []);
      } catch (err) {
        console.warn('Timeline API failed, using active alerts:', err);
        const fallback = alerts.map((a) => ({
          timestamp: a.timestamp,
          actor: a.actor,
          action: a.action,
          severity: a.severity,
          risk_score: a.risk_score,
          rule_name: a.rule_name,
          alert_id: a.alert_id,
          target_user: a.target_user,
          source_ip: a.source_ip,
          is_alert: true,
          explanation: a.explanation
        }));
        setTimelineItems(fallback);
      } finally {
        setLoading(false);
      }
    }

    loadTimeline();
  }, [isDemoMode, alerts]);

  return (
    <div>
      <PageHeader
        title="Chronological Activity Timeline"
        subtitle="Temporal correlation of administrative actions, authentication milestones, and elevated risk transitions"
      />

      {/* Velocity Trend Chart */}
      <div style={{ marginBottom: 24 }}>
        <ActivityChart data={summary?.timeline_overview || []} />
      </div>

      {/* Chronological Event Stream */}
      {loading ? (
        <LoadingState message="Reconstructing temporal activity stream..." />
      ) : (
        <ActivityTimeline items={timelineItems} />
      )}
    </div>
  );
}
