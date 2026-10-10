import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';

const TOUR_STEPS = [
  {
    step: 1,
    title: "1. Overview Dashboard",
    route: "/",
    content: "The Overview Dashboard displays the high-level health of your system access. You can instantly monitor Total Events, Suspicious Activities, and Critical/High Alert counts, alongside Recharts visualizations of severity distributions and velocity spikes.",
    tip: "Look at the 5 Metric Cards at the top of the dashboard for quick health triage."
  },
  {
    step: 2,
    title: "2. Upload & Ingest Audit Logs",
    route: "/upload",
    content: "The Ingest page allows you to drag and drop RFC 4180 CSV files or structured JSON audit logs (up to 10 MB). You can also load the pre-configured 125-event Synthetic Benchmark Dataset with a single click to test all 9 rules.",
    tip: "Check the Live Normalization table to see how heterogeneous fields map into canonical schema."
  },
  {
    step: 3,
    title: "3. Investigate Threat Detections",
    route: "/detections",
    content: "The Threat Detections table correlates suspicious events using the 9 rules. You can filter by severity, search by actor or IP, and click 'Details' on any alert to open the side-drawer investigation panel with complete risk calculation math.",
    tip: "Use the drawer's status controls to transition alerts from 'New' to 'Under Investigation' or 'Reviewed'."
  },
  {
    step: 4,
    title: "4. Chronological Activity Timeline",
    route: "/timeline",
    content: "The Activity Timeline reconstructs the exact temporal sequence of audit events. This is essential for spotting kill-chain patterns, such as multiple authentication failures followed immediately by a role escalation.",
    tip: "Filter by severity or actor to trace lateral movement and session hijacking attempts."
  },
  {
    step: 5,
    title: "5. User Risk Profiling",
    route: "/users",
    content: "User Risk Analysis aggregates alerts by identity. It prioritizes actors with high alert counts and elevated scores to help security analysts prioritize which employee or service account to investigate first.",
    tip: "Remember: User risk profiles are an investigation prioritization tool, not proof of malicious intent."
  },
  {
    step: 6,
    title: "6. Reports & Compliance Export",
    route: "/reports",
    content: "Export your findings in multiple industry-standard formats: Threat Alerts CSV for spreadsheet triage, Audit JSON for SIEM ingestion, or professional executive PDF reports generated with ReportLab.",
    tip: "You can apply severity filters before exporting to generate executive reports focusing on Critical threats."
  }
];

export default function GuidedTour({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && currentIdx < TOUR_STEPS.length - 1) setCurrentIdx((p) => p + 1);
      if (e.key === 'ArrowLeft' && currentIdx > 0) setCurrentIdx((p) => p - 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIdx, onClose]);

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentIdx];
  const isFirst = currentIdx === 0;
  const isLast = currentIdx === TOUR_STEPS.length - 1;

  const handleNavigate = () => {
    navigate(currentStep.route);
    onClose();
  };

  return (
    <div className="tour-backdrop" onClick={onClose}>
      <div className="tour-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="tour-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Sparkles size={18} style={{ color: 'var(--color-primary)' }} />
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
              Guided Walkthrough ({currentIdx + 1} of {TOUR_STEPS.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
            title="Close walkthrough (Esc)"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="tour-body">
          <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
            {currentStep.title}
          </h4>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 14 }}>
            {currentStep.content}
          </p>
          <div style={{
            background: 'var(--bg-main)',
            borderLeft: '3px solid var(--color-primary)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: 12,
            color: 'var(--text-muted)'
          }}>
            <strong>SOC Tip:</strong> {currentStep.tip}
          </div>
        </div>

        {/* Footer */}
        <div className="tour-footer">
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              variant="secondary"
              size="sm"
              disabled={isFirst}
              onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
              icon={ChevronLeft}
            >
              Prev
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={isLast}
              onClick={() => setCurrentIdx((p) => Math.min(TOUR_STEPS.length - 1, p + 1))}
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </Button>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <Button
              variant="primary"
              size="sm"
              onClick={handleNavigate}
            >
              Go to this Page
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
