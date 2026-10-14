import { apiClient } from './client';
import type { User, UserStats, AuthResponse } from '../types/user';

export const authApi = {
  async register(data: { name: string; email: string; username?: string; password: string; password_confirmation: string }) {
    const res = await apiClient.post<AuthResponse>('/register', data);
    return res.data;
  },

  async login(data: { email: string; password: string }) {
    const res = await apiClient.post<AuthResponse>('/login', data);
    return res.data;
  },

  async logout() {
    await apiClient.post('/logout');
  },

  async getUser() {
    const res = await apiClient.get<{ data: User }>('/user');
    return res.data.data;
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
