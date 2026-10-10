import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Toast from '../common/Toast';
import AlertDetails from '../alerts/AlertDetails';
import UserDetails from '../users/UserDetails';
import { useApp } from '../../context/AppContext';

export default function AppLayout() {
  const { toasts, removeToast, selectedAlert, setSelectedAlert, selectedUser, setSelectedUser } = useApp();

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Topbar />
        <main className="page-container">
          <Outlet />
        </main>
      </div>

      {/* Global Alerts Drawer */}
      {selectedAlert && (
        <AlertDetails
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
        />
      )}

      {/* Global User Details Drawer */}
      {selectedUser && (
        <UserDetails
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {/* Toast Notifications */}
      <Toast toasts={toasts} onClose={removeToast} />
    </div>
  );
}
