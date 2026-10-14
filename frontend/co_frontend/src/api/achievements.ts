import { apiClient } from './client';
import type { Achievement, StreakData, XpInfo, XpTransaction, LeaderboardEntry } from '../types/gamification';

export const achievementsApi = {
  async getUserAchievements() {
    const res = await apiClient.get<{ data: Achievement[] }>('/user/achievements');
    return res.data.data;
  },

  async getAllAchievements() {
    const res = await apiClient.get<{ data: Achievement[] }>('/achievements');
    return res.data.data;
  },

  async getStreak() {
    const res = await apiClient.get<{ data: StreakData }>('/user/streak');
    return res.data.data;
  },

  async getXpInfo() {
    const res = await apiClient.get<{ data: XpInfo }>('/user/xp');
    return res.data.data;
  },

  async getXpHistory() {
    const res = await apiClient.get<{ data: XpTransaction[] }>('/user/xp/history');
    return res.data.data;
  },

  async getLeaderboard(period = 'weekly') {
    const res = await apiClient.get<{ data: LeaderboardEntry[] }>(`/leaderboard?period=${period}`);
    return res.data.data;
  },
};
