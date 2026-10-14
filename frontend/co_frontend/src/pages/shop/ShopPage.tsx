import React, { useEffect, useState } from 'react';
import { shopApi, type ShopItem } from '../../api/shop';
import { useAuthStore } from '../../stores/authStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import toast from 'react-hot-toast';
import {
  Coins,
  Shield,
  Palette,
  Check,
  Lock,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { user, refreshUser } = useAuthStore();
  const [items, setItems] = useState<ShopItem[]>([]);
  const [balance, setBalance] = useState<number>(user?.coins ?? 0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'booster' | 'frame' | 'title' | 'accent'>('all');
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchShop = async () => {
    try {
      setLoading(true);
      const data = await shopApi.get();
      setItems(data.items);
      setBalance(data.balance);
    } catch (err: any) {
      toast.error('Gagal memuat katalog toko.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShop();
  }, []);

  const handlePurchase = async (item: ShopItem) => {
    setProcessingId(item.id);
    try {
      const res = await shopApi.purchase(item.id);
      toast.success(res.message);
      setBalance(res.balance);
      await refreshUser();
      await fetchShop();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Pembelian gagal.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleEquip = async (item: ShopItem) => {
    setProcessingId(item.id);
    try {
      if (item.is_equipped) {
        const res = await shopApi.unequip(item.id);
        toast.success(res.message);
      } else {
        const res = await shopApi.equip(item.id);
        toast.success(res.message);
      }
      await refreshUser();
      await fetchShop();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal mengubah status item.');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredItems = items.filter((item) => {
    if (activeTab === 'all') return true;
    return item.slot === activeTab;
  });

  const getSlotLabel = (slot: string) => {
    switch (slot) {
      case 'booster':
        return 'Streak Freeze';
      case 'frame':
        return 'Bingkai Profil';
      case 'title':
        return 'Gelar Gelombang';
      case 'accent':
        return 'Tema Aksen';
      default:
        return 'Kosmetik';
    }
  };

  const getRarityLabel = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'Legendaris';
      case 'epic':
        return 'Epik';
      case 'rare':
        return 'Langka';
      default:
        return 'Biasa';
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header with Balance */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[var(--radius-control)] bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--warning)] shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">
              Toko CodeQuest
            </h1>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            Tukarkan koin hasil belajar untuk booster streak dan kustomisasi profil.
          </p>
        </div>

        {/* Balance Card */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-[var(--radius-card)] bg-[var(--surface)] border border-[var(--border)] self-start sm:self-auto">
          <Coins className="w-5 h-5 text-[var(--warning)]" />
          <div>
            <div className="text-[11px] text-[var(--text-muted)] font-medium">Saldo Koin Kamu</div>
            <div className="text-lg font-bold num text-[var(--text)] leading-none mt-0.5">
              {balance} koin
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[var(--border)] text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-[var(--radius-control)] transition-colors cursor-pointer ${
            activeTab === 'all'
              ? 'bg-[var(--surface-2)] text-[var(--text)] font-semibold'
              : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
        >
          Semua Item
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('booster')}
          className={`px-3 py-1.5 rounded-[var(--radius-control)] transition-colors cursor-pointer ${
            activeTab === 'booster'
              ? 'bg-[var(--surface-2)] text-[var(--text)] font-semibold'
              : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
        >
          Booster Streak
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('frame')}
          className={`px-3 py-1.5 rounded-[var(--radius-control)] transition-colors cursor-pointer ${
            activeTab === 'frame'
              ? 'bg-[var(--surface-2)] text-[var(--text)] font-semibold'
              : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
        >
          Bingkai Avatar
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('title')}
          className={`px-3 py-1.5 rounded-[var(--radius-control)] transition-colors cursor-pointer ${
            activeTab === 'title'
              ? 'bg-[var(--surface-2)] text-[var(--text)] font-semibold'
              : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
        >
          Gelar Profil
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('accent')}
          className={`px-3 py-1.5 rounded-[var(--radius-control)] transition-colors cursor-pointer ${
            activeTab === 'accent'
              ? 'bg-[var(--surface-2)] text-[var(--text)] font-semibold'
              : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
        >
          Aksen UI
        </button>
      </div>

      {/* Catalog Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-52 rounded-[var(--radius-card)]" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] space-y-2">
          <p className="text-sm">Tidak ada item di kategori ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const isProcessing = processingId === item.id;
            const isBooster = item.slot === 'booster';

            return (
              <Card
                key={item.id}
                className="p-5 flex flex-col justify-between space-y-4 border border-[var(--border)] bg-[var(--surface)]"
              >
                <div className="space-y-3">
                  {/* Top metadata line */}
                  <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                    <span>{getSlotLabel(item.slot)}</span>
                    <span className="font-medium text-[var(--text)]">
                      {getRarityLabel(item.rarity)}
                    </span>
                  </div>

                  {/* Icon & Name */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-[var(--radius-control)] bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center shrink-0">
                      {item.slot === 'booster' && (
                        <Shield className="w-5 h-5 text-[var(--accent)]" />
                      )}
                      {item.slot === 'frame' && (
                        <Sparkles className="w-5 h-5 text-[var(--warning)]" />
                      )}
                      {item.slot === 'title' && (
                        <span className="text-sm font-bold text-[var(--text)]">"T"</span>
                      )}
                      {item.slot === 'accent' && (
                        <Palette className="w-5 h-5 text-[var(--accent)]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-[var(--text)] truncate">
                        {item.name}
                      </h3>
                      {item.data?.description ? (
                        <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-0.5">
                          {item.data.description}
                        </p>
                      ) : (
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">
                          {isBooster ? 'Melindungi streak saat absen belajar 1 hari.' : 'Kustomisasi profil akun.'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Booster Capacity indicator */}
                  {isBooster && (
                    <div className="text-xs text-[var(--text-muted)] bg-[var(--surface-2)] p-2 rounded-[var(--radius-control)]">
                      Kapasitas tersimpan: <span className="num font-semibold text-[var(--text)]">{user?.streak_freezes ?? 0} / 2</span>
                    </div>
                  )}

                  {/* Lock Reason for non-shop items */}
                  {item.status === 'locked' && item.lock_reason && (
                    <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] bg-[var(--surface-2)] p-2 rounded-[var(--radius-control)]">
                      <Lock className="w-3.5 h-3.5 shrink-0" />
                      <span>{item.lock_reason}</span>
                    </div>
                  )}
                </div>

                {/* Price & Action */}
                <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between gap-3">
                  {item.price_coins !== null ? (
                    <div className="flex items-center gap-1 text-xs font-semibold num text-[var(--text)]">
                      <Coins className="w-3.5 h-3.5 text-[var(--warning)]" />
                      <span>{item.price_coins}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-[var(--text-muted)]">Gratis / Tantangan</span>
                  )}

                  {/* Action Button depending on status */}
                  {isBooster ? (
                    item.status === 'max_held' ? (
                      <Button variant="secondary" size="sm" disabled>
                        Penuh (2/2)
                      </Button>
                    ) : item.status === 'cant_afford' ? (
                      <Button variant="secondary" size="sm" disabled>
                        Kurang {item.coins_needed} koin
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        loading={isProcessing}
                        onClick={() => handlePurchase(item)}
                      >
                        Beli Booster
                      </Button>
                    )
                  ) : item.is_owned ? (
                    <Button
                      variant={item.is_equipped ? 'secondary' : 'primary'}
                      size="sm"
                      loading={isProcessing}
                      onClick={() => handleEquip(item)}
                    >
                      {item.is_equipped ? (
                        <>
                          <Check className="w-3.5 h-3.5 mr-1 text-[var(--success)]" />
                          Terpasang
                        </>
                      ) : (
                        'Pasang'
                      )}
                    </Button>
                  ) : item.status === 'locked' ? (
                    <Button variant="secondary" size="sm" disabled>
                      Terkunci
                    </Button>
                  ) : item.status === 'cant_afford' ? (
                    <Button variant="secondary" size="sm" disabled>
                      Kurang {item.coins_needed} koin
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      loading={isProcessing}
                      onClick={() => handlePurchase(item)}
                    >
                      Beli
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
