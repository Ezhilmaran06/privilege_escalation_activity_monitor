import api from './api';

export const logService = {
  uploadLogs: async (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/logs/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress
    });
    return res.data;
  },

  analyzeLogs: async () => {
    const res = await api.post('/logs/analyze');
    return res.data;
  },

  getLogs: async (params = {}) => {
    const res = await api.get('/logs', { params });
    return res.data;
  },

  loadDemo: async () => {
    const res = await api.post('/demo/load');
    return res.data;
  }
};
