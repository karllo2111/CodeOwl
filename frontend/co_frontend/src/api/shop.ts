import { apiClient } from './client';

export interface ShopItem {
  id: number;
  name: string;
  slot: 'booster' | 'frame' | 'title' | 'accent';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  price_coins: number | null;
  unlock_type: 'shop' | 'achievement' | 'level' | 'chest';
  unlock_ref: string | null;
  data: any;
  status: 'available' | 'owned' | 'equipped' | 'cant_afford' | 'locked' | 'max_held';
  is_owned: boolean;
  is_equipped: boolean;
  lock_reason: string | null;
  coins_needed: number;
}

export interface ShopResponse {
  balance: number;
  items: ShopItem[];
}

export const shopApi = {
  get: async (): Promise<ShopResponse> => {
    const res = await apiClient.get('/shop');
    return res.data;
  },

  purchase: async (id: number): Promise<{ message: string; balance: number; streak_freezes?: number; item_id?: number }> => {
    const res = await apiClient.post(`/shop/${id}/purchase`);
    return res.data;
  },

  equip: async (id: number): Promise<{ message: string; equipped: any }> => {
    const res = await apiClient.post(`/cosmetics/${id}/equip`);
    return res.data;
  },

  unequip: async (id: number): Promise<{ message: string; equipped: any }> => {
    const res = await apiClient.post(`/cosmetics/${id}/unequip`);
    return res.data;
  },
};
