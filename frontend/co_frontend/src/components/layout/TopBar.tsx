import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../ui/Button';
import { Breadcrumb, type BreadcrumbItem } from '../ui/Breadcrumb';
import { Flame } from 'lucide-react';

import { ROUTES } from '../../routes';
import { Coins } from 'lucide-react';

export const TopBar: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();

  // Generate breadcrumb items based on current pathname
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const path = location.pathname;
    if (path === '/') return [{ label: 'Dashboard' }];
    if (path.startsWith(ROUTES.CURRICULUM) || path.startsWith('/courses')) return [{ label: 'Beranda', to: '/' }, { label: 'Kurikulum' }];
    if (path.startsWith(ROUTES.PRACTICE) || path.startsWith('/practice')) return [{ label: 'Beranda', to: '/' }, { label: 'Latihan' }];
    if (path.startsWith(ROUTES.PLAYGROUND)) return [{ label: 'Beranda', to: '/' }, { label: 'Playground' }];
    if (path.startsWith(ROUTES.LEADERBOARD) || path.startsWith('/leaderboard')) return [{ label: 'Beranda', to: '/' }, { label: 'Peringkat' }];
    if (path.startsWith(ROUTES.SHOP) || path.startsWith('/shop')) return [{ label: 'Beranda', to: '/' }, { label: 'Toko' }];
    if (path.startsWith(ROUTES.PROFILE) || path.startsWith('/profile')) return [{ label: 'Beranda', to: '/' }, { label: 'Profil' }];
    if (path.startsWith(ROUTES.ADMIN)) return [{ label: 'Beranda', to: '/' }, { label: 'Admin CMS' }];
    if (path.startsWith(ROUTES.DEV_UI)) return [{ label: 'Beranda', to: '/' }, { label: 'Style Guide UI' }];
    if (path.startsWith('/bab/')) return [{ label: 'Beranda', to: '/' }, { label: 'Kurikulum', to: ROUTES.CURRICULUM }, { label: 'Bab' }];
    if (path.startsWith('/materi/')) return [{ label: 'Beranda', to: '/' }, { label: 'Kurikulum', to: ROUTES.CURRICULUM }, { label: 'Materi' }];
    return [{ label: 'Beranda', to: '/' }, { label: 'Halaman' }];
  };

  return (
    <header className="h-14 border-b border-[var(--border)] bg-[var(--surface)] px-5 flex items-center justify-between shrink-0 z-20 select-none">
      <div className="flex items-center min-w-0">
        <Breadcrumb items={getBreadcrumbs()} />
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {isAuthenticated && user ? (
          <div className="flex items-center gap-2.5">
            {/* Coins indicator */}
            <Link
              to={ROUTES.SHOP}
              className="flex items-center gap-1.5 text-xs font-medium text-[var(--text)] px-2.5 py-1 rounded-[var(--radius-control)] bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-colors"
            >
              <Coins className="w-3.5 h-3.5 text-[var(--warning)]" strokeWidth={1.75} />
              <span className="num font-semibold">{user.coins ?? 0}</span>
            </Link>

            {/* Streak indicator */}
            {(user.streak ?? 0) > 0 && (
              <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--warning)] px-2.5 py-1 rounded-[var(--radius-control)] bg-[var(--surface-2)] border border-[var(--border)]">
                <Flame className="w-3.5 h-3.5 text-[var(--warning)]" strokeWidth={1.75} />
                <span className="num font-semibold">{user.streak} hari</span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to={ROUTES.LOGIN}>
              <Button variant="secondary" size="sm">
                Masuk
              </Button>
            </Link>
            <Link to={ROUTES.REGISTER}>
              <Button variant="primary" size="sm">
                Daftar
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
