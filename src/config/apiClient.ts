import axios from 'axios';
import { AuthService } from '../services/AuthService';
import { TokenService } from '../services/TokenServices';

declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BACKEND_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await AuthService.refreshAccessToken();
        console.log('newAccessToken', newAccessToken);

        if (newAccessToken) {
          TokenService.setAccessToken(newAccessToken); // store it
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }
      } catch (err) {
        console.error('Refresh token failed');
        TokenService.removeAccessToken();
        localStorage.removeItem('user');
        window.location.href = '/signin';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
