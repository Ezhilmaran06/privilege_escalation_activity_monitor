import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function TopUsersChart({ data = [] }) {
  const chartData = data.slice(0, 5).map((d) => ({
    user: d.user,
    count: d.alert_count
  }));

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">Top Affected Identities</h3>
          <span className="chart-subtitle">Users with most associated threat alerts</span>
        </div>
      </div>

      <div style={{ width: '100%', height: 240 }}>
        {chartData.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: 13 }}>
            No user alerts recorded
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <XAxis type="number" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
              <YAxis type="category" dataKey="user" stroke="var(--text-secondary)" fontSize={11} tickLine={false} width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: 12
                }}
              />
              <Bar dataKey="count" name="Alerts" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#EF4444' : '#F97316'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
