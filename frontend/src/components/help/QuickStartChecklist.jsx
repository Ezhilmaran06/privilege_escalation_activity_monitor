import React, { useState } from 'react';
import { QUICK_START_CHECKLIST } from '../../data/helpContent';
import { Check, Sparkles, RotateCcw, ArrowRight } from 'lucide-react';
import Button from '../common/Button';

export default function QuickStartChecklist({ onStartTour }) {
  const [completed, setCompleted] = useState([1]); // First step completed by default

  const toggleStep = (id) => {
    setCompleted((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const resetChecklist = () => {
    setCompleted([]);
  };

  const percent = Math.round((completed.length / QUICK_START_CHECKLIST.length) * 100);

  return (
    <div className="checklist-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={18} style={{ color: 'var(--color-primary)' }} />
            <span>Interactive SOC Analyst Quick Start Checklist</span>
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Follow these 8 fundamental steps to master audit log triage and incident investigation.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          {onStartTour && (
            <Button variant="primary" size="sm" onClick={onStartTour} icon={Sparkles}>
              Start Guided Walkthrough
            </Button>
          )}
          <button
            onClick={resetChecklist}
            style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}
            title="Reset checklist progress"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, fontSize: 12, color: 'var(--text-muted)' }}>
        <span>Progress: {completed.length} of {QUICK_START_CHECKLIST.length} completed</span>
        <strong style={{ color: percent === 100 ? 'var(--color-low)' : 'var(--color-primary)' }}>{percent}% Complete</strong>
      </div>

      <div className="checklist-progress-bar">
        <div className="checklist-progress-fill" style={{ width: `${percent}%` }} />
      </div>

      <div className="checklist-items">
        {QUICK_START_CHECKLIST.map((item) => {
          const isDone = completed.includes(item.id);
          return (
            <div
              key={item.id}
              className={`checklist-item ${isDone ? 'done' : ''}`}
              onClick={() => toggleStep(item.id)}
            >
              <div className="checklist-checkbox">
                {isDone && <Check size={12} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: isDone ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  {item.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
