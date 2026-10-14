import { apiClient } from './client';
import type { User, UserStats, AuthResponse } from '../types/user';

export const authApi = {
  async csrfCookie() {
    try {
      await apiClient.get('/sanctum/csrf-cookie', { baseURL: '' });
    } catch {}
  },

  async register(data: { name: string; email: string; username?: string; password: string; password_confirmation: string }) {
    await this.csrfCookie();
    const res = await apiClient.post<AuthResponse>('/register', data);
    return res.data;
  },

  async login(data: { email: string; password: string; remember?: boolean }) {
    await this.csrfCookie();
    const res = await apiClient.post<AuthResponse>('/login', data);
    return res.data;
  },

  async logout() {
    await apiClient.post('/logout');
  },

  async getUser(): Promise<User> {
    const res = await apiClient.get<any>('/users/me');
    return res.data.data ?? res.data;
  },

  async updateProfile(data: Partial<User>) {
    const res = await apiClient.put<{ data: User }>('/user', data);
    return res.data.data;
  },

  async getStats() {
    const res = await apiClient.get<{ data: UserStats }>('/user/stats');
    return res.data.data;
  },
};
