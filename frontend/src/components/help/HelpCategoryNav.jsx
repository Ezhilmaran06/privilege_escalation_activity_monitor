import React from 'react';
import {
  LayoutGrid,
  Sparkles,
  Shield,
  Building2,
  GitMerge,
  Compass,
  Layers,
  Cpu,
  FileSearch,
  Wrench,
  HelpCircle,
  Lock,
  BookMarked,
  Code
} from 'lucide-react';
import { HELP_CATEGORIES } from '../../data/helpContent';

const CATEGORY_ICONS = {
  LayoutGrid,
  Sparkles,
  Shield,
  Building2,
  GitMerge,
  Compass,
  Layers,
  Cpu,
  FileSearch,
  Wrench,
  HelpCircle,
  Lock,
  BookMarked,
  Code
};

export default function HelpCategoryNav({ activeCategory, setActiveCategory }) {
  return (
    <div className="help-category-bar">
      {HELP_CATEGORIES.map((cat) => {
        const Icon = CATEGORY_ICONS[cat.icon] || LayoutGrid;
        const isActive = activeCategory === cat.id;

        return (
          <button
            key={cat.id}
            className={`help-category-btn ${isActive ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            <Icon size={15} />
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
