import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Accept': 'application/json'
  }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'Network connection failed or server is unreachable.';
    if (error.response) {
      message = error.response.data?.detail || error.response.data?.message || `Server error (${error.response.status})`;
    } else if (error.request) {
      message = 'No response from PrivilegeGuard backend. Verify backend is running on http://127.0.0.1:8000.';
    }
    return Promise.reject(new Error(message));
  }
);

export default api;
