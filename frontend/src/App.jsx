import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import AppLayout from './components/layout/AppLayout';

import Dashboard from './pages/Dashboard';
import UploadLogs from './pages/UploadLogs';
import ThreatDetections from './pages/ThreatDetections';
import ActivityTimelinePage from './pages/ActivityTimelinePage';
import UserRiskAnalysis from './pages/UserRiskAnalysis';
import Reports from './pages/Reports';
import About from './pages/About';

import './styles/global.css';
import './styles/layout.css';
import './styles/components.css';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="upload" element={<UploadLogs />} />
            <Route path="detections" element={<ThreatDetections />} />
            <Route path="timeline" element={<ActivityTimelinePage />} />
            <Route path="users" element={<UserRiskAnalysis />} />
            <Route path="reports" element={<Reports />} />
            <Route path="about" element={<About />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
