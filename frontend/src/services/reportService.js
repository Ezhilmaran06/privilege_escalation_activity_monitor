import api from './api';

export const reportService = {
  getSummary: async () => {
    const res = await api.get('/reports/summary');
    return res.data;
  },

  exportReport: async (format = 'csv', severity = null) => {
    const params = { format };
    if (severity) params.severity = severity;

    const res = await api.get('/reports/export', {
      params,
      responseType: format === 'json' ? 'json' : 'blob'
    });

    // Create file download in browser
    const blob = format === 'json' ? new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' }) : res.data;
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const ext = format === 'pdf' ? 'pdf' : (format === 'json' ? 'json' : 'csv');
    link.setAttribute('download', `privilege_guard_report.${ext}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    return true;
  }
};
