import api from '../utils/api';
export const fetchReports = (year) => api.get('/reports', { params: { year }});
