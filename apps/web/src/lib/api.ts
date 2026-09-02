import axios, { AxiosError, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ─── Request Interceptor — attach JWT token ──────────────────
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('govsetu_access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor — unwrap & handle errors ──────────
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Unwrap the { success, data, timestamp } envelope
    if (response.data && response.data.success !== undefined) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  async (error: AxiosError) => {
    // DEMO MOCK: Intercept failures and return mock data to allow UI exploration without DB
    if (error.config) {
      console.warn('[Mock API] Intercepted failed request:', error.config.method, error.config.url);
      
      if (error.config.url?.includes('/auth/login')) {
         let email = 'officer@smartcity.gov.in';
         let role = 'ADMIN';
         if (error.config.data) {
           try {
             const reqData = JSON.parse(error.config.data);
             if (reqData.email) email = reqData.email;
             if (email.includes('founder') || email.includes('startup')) {
               role = 'STARTUP_USER';
             }
           } catch (e) {}
         }
         return Promise.resolve({
           data: {
             user: { 
               id: 'demo-user-1', 
               email: email, 
               firstName: role === 'STARTUP_USER' ? 'Startup' : 'Demo', 
               lastName: role === 'STARTUP_USER' ? 'Founder' : 'User', 
               role: role, 
               organizationId: 'mock-org-id' 
             },
             accessToken: 'mock-token',
             refreshToken: 'mock-refresh'
           }
         });
      }
      
      if (error.config.url?.includes('/analytics')) {
        return Promise.resolve({
          data: {
            challenges: { active: 12, completed: 45, total: 57, published: 23, byStatus: { PUBLISHED: 23, EVALUATION: 10, PILOT: 5, COMPLETED: 19 } },
            applications: { total: 140, pendingReview: 45, shortlisted: 20, selected: 10 },
            pilots: { active: 5, completed: 12, total: 17 },
            procurement: { totalValueLakh: 1250 },
            users: { total: 450 }
          }
        });
      }
      
      if (error.config.method?.toUpperCase() === 'GET') {
        return Promise.resolve({ data: [] });
      }
      
      return Promise.resolve({ data: { success: true } });
    }

    if (error.response?.status === 401) {
      // Try refresh token
      const refreshToken = localStorage.getItem('govsetu_refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
          const { accessToken } = res.data.data ?? res.data;
          localStorage.setItem('govsetu_access_token', accessToken);
          // Retry original request
          if (error.config) {
            error.config.headers!.Authorization = `Bearer ${accessToken}`;
            return apiClient(error.config);
          }
        } catch {
          // Refresh failed — clear auth and redirect
          localStorage.removeItem('govsetu_access_token');
          localStorage.removeItem('govsetu_refresh_token');
          localStorage.removeItem('govsetu_user');
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
      } else {
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  },
);

// ─── Typed helpers ───────────────────────────────────────────
export const api = {
  get: <T>(url: string, params?: object) =>
    apiClient.get<T, AxiosResponse<T>>(url, { params }).then((r) => r.data),

  post: <T>(url: string, data?: object) =>
    apiClient.post<T, AxiosResponse<T>>(url, data).then((r) => r.data),

  patch: <T>(url: string, data?: object) =>
    apiClient.patch<T, AxiosResponse<T>>(url, data).then((r) => r.data),

  put: <T>(url: string, data?: object) =>
    apiClient.put<T, AxiosResponse<T>>(url, data).then((r) => r.data),

  delete: <T>(url: string) =>
    apiClient.delete<T, AxiosResponse<T>>(url).then((r) => r.data),
};

export default api;
