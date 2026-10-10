import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function HelpAccordion({ title, children, defaultOpen = false, icon: Icon = null, badge = null }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="accordion-item">
      <div className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="accordion-title">
          {Icon && <Icon size={18} style={{ color: 'var(--color-primary)' }} />}
          <span>{title}</span>
          {badge && <span className="badge-implemented">{badge}</span>}
        </div>
        <div style={{ color: 'var(--text-muted)' }}>
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>
      {isOpen && <div className="accordion-body">{children}</div>}
    </div>
  );
}
