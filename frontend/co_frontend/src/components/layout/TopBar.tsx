import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../ui/Button';
import { Breadcrumb, type BreadcrumbItem } from '../ui/Breadcrumb';
import { Flame } from 'lucide-react';

export const TopBar: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();

  // Generate breadcrumb items based on current pathname
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const path = location.pathname;
    if (path === '/') return [{ label: 'Dashboard' }];
    if (path.startsWith('/courses')) return [{ label: 'Beranda', to: '/' }, { label: 'Kurikulum' }];
    if (path.startsWith('/practice')) return [{ label: 'Beranda', to: '/' }, { label: 'Latihan' }];
    if (path.startsWith('/playground')) return [{ label: 'Beranda', to: '/' }, { label: 'Playground' }];
    if (path.startsWith('/leaderboard')) return [{ label: 'Beranda', to: '/' }, { label: 'Peringkat' }];
    if (path.startsWith('/shop')) return [{ label: 'Beranda', to: '/' }, { label: 'Toko' }];
    if (path.startsWith('/profile')) return [{ label: 'Beranda', to: '/' }, { label: 'Profil' }];
    if (path.startsWith('/admin')) return [{ label: 'Beranda', to: '/' }, { label: 'Admin CMS' }];
    if (path.startsWith('/dev/ui')) return [{ label: 'Beranda', to: '/' }, { label: 'Style Guide UI' }];
    return [{ label: 'Beranda', to: '/' }, { label: 'Halaman' }];
  };

  return (
    <header className="h-14 border-b border-[var(--border)] bg-[var(--surface)] px-5 flex items-center justify-between shrink-0 z-20 select-none">
      <div className="flex items-center min-w-0">
        <Breadcrumb items={getBreadcrumbs()} />
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {isAuthenticated && user ? (
          <div className="flex items-center gap-3">
            {/* Show real streak if active */}
            {(user.streak ?? 0) > 0 && (
              <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--warning)] px-2.5 py-1 rounded-[var(--radius-control)] bg-[var(--surface-2)]">
                <Flame className="w-3.5 h-3.5 text-[var(--warning)]" strokeWidth={1.75} />
                <span>{user.streak} hari</span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="secondary" size="sm">
                Masuk
              </Button>
            </Link>
            <Link to="/register">
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
