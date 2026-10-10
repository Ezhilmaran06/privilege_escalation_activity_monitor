export const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || 'http://127.0.0.1:8000/api';

export const SEVERITIES = ['Critical', 'High', 'Medium', 'Low'];

export const SEVERITY_COLORS = {
  Critical: '#EF4444',
  High: '#F97316',
  Medium: '#F59E0B',
  Low: '#22C55E'
};

export const INVESTIGATION_STATUSES = [
  'New',
  'Under Investigation',
  'Reviewed',
  'False Positive'
];

export const NAV_ITEMS = [
  { path: '/', label: 'Overview Dashboard', icon: 'LayoutDashboard' },
  { path: '/upload', label: 'Upload Audit Logs', icon: 'UploadCloud' },
  { path: '/detections', label: 'Threat Detections', icon: 'ShieldAlert' },
  { path: '/timeline', label: 'Activity Timeline', icon: 'Clock' },
  { path: '/users', label: 'User Risk Analysis', icon: 'Users' },
  { path: '/reports', label: 'Reports & Export', icon: 'FileText' },
  { path: '/help', label: 'Help Desk & User Guide', icon: 'BookOpen' },
  { path: '/about', label: 'About the System', icon: 'Info' }
];
