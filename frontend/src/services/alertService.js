import api from './api';

export const alertService = {
  getAlerts: async (params = {}) => {
    const res = await api.get('/alerts', { params });
    return res.data;
  },

  getAlert: async (alertId) => {
    const res = await api.get(`/alerts/${alertId}`);
    return res.data;
  },

  updateStatus: async (alertId, newStatus, notes = '') => {
    const res = await api.patch(`/alerts/${alertId}/status`, {
      investigation_status: newStatus,
      analyst_notes: notes
    });
    return res.data;
  },

  getTimeline: async () => {
    const res = await api.get('/timeline');
    return res.data;
  },

  getUserRisks: async () => {
    const res = await api.get('/users/risk');
    return res.data;
  }
};
