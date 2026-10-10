import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { SEVERITY_COLORS } from '../../utils/constants';

export default function SeverityChart({ data }) {
  const chartData = [
    { name: 'Critical', value: data?.Critical || 0 },
    { name: 'High', value: data?.High || 0 },
    { name: 'Medium', value: data?.Medium || 0 },
    { name: 'Low', value: data?.Low || 0 }
  ].filter((item) => item.value > 0);

  const total = chartData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">Severity Distribution</h3>
          <span className="chart-subtitle">Alert breakdown by risk tier</span>
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)' }}>
          Total: {total}
        </span>
      </div>

      <div style={{ width: '100%', height: 240 }}>
        {total === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: 13 }}>
            No alerts generated
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={SEVERITY_COLORS[entry.name] || '#3B82F6'}
                    stroke="var(--bg-card)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: 12
                }}
              />
              <Legend
                verticalAlign="bottom"
                formatter={(val) => <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{val}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
