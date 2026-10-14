import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Code2,
  Terminal,
  Trophy,
  ShoppingBag,
  User as UserIcon,
  ShieldCheck,
  ChevronDown,
  Sun,
  Moon,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { Avatar } from '../ui/Avatar';
import { IconButton } from '../ui/IconButton';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { resolvedTheme, toggleTheme } = useThemeStore();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [practiceOpen, setPracticeOpen] = useState(
    location.pathname.startsWith('/practice')
  );

  const isAdmin = user?.roles?.some((r) => r.name === 'admin');

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/courses', label: 'Kurikulum', icon: BookOpen },
    {
      to: '/practice',
      label: 'Latihan',
      icon: Code2,
      isGroup: true,
      subItems: [
        { to: '/practice/practice', label: 'Latihan Terpandu' },
        { to: '/practice/debug', label: 'Diagnosa Bug' },
        { to: '/practice/fix', label: 'Perbaikan Kode' },
        { to: '/practice/challenge', label: 'Tantangan Algoritma' },
        { to: '/practice/project', label: 'Proyek Nyata' },
      ],
    },
    { to: '/playground', label: 'Playground', icon: Terminal },
    { to: '/leaderboard', label: 'Peringkat', icon: Trophy },
    { to: '/shop', label: 'Toko', icon: ShoppingBag },
    { to: '/profile', label: 'Profil', icon: UserIcon },
  ];

  return (
    <aside
      className={`bg-[var(--surface)] border-r border-[var(--border)] flex flex-col h-screen shrink-0 select-none transition-all duration-200 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-[var(--radius-control)] bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center shrink-0 text-[var(--accent)]">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          {!collapsed && (
            <div className="min-w-0 truncate">
              <span className="font-semibold text-sm tracking-tight text-[var(--text)]">
                CodeQuest
              </span>
            </div>
          )}
        </div>

        <IconButton
          icon={collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          aria-label={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
          onClick={() => setCollapsed(!collapsed)}
          size="sm"
        />
      </div>

      {/* Nav List */}
      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        {navLinks.map((item) => {
          const Icon = item.icon;

          if (item.isGroup) {
            const isGroupActive = location.pathname.startsWith('/practice');

            if (collapsed) {
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  title={item.label}
                  className={({ isActive }) =>
                    `flex items-center justify-center w-10 h-10 mx-auto rounded-[var(--radius-control)] transition-colors ${
                      isActive
                        ? 'bg-[var(--surface-2)] text-[var(--accent)] font-semibold'
                        : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" strokeWidth={1.75} />
                </NavLink>
              );
            }

            return (
              <div key={item.to} className="space-y-1">
                <button
                  type="button"
                  onClick={() => setPracticeOpen(!practiceOpen)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-[var(--radius-control)] text-xs font-medium transition-colors cursor-pointer ${
                    isGroupActive
                      ? 'text-[var(--text)] font-semibold bg-[var(--surface-2)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" strokeWidth={1.75} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-150 ${
                      practiceOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {practiceOpen && (
                  <div className="pl-6 space-y-1">
                    <NavLink
                      to="/practice"
                      end
                      className={({ isActive }) =>
                        `block px-3 py-1.5 rounded-[var(--radius-control)] text-xs transition-colors ${
                          isActive
                            ? 'text-[var(--accent)] font-semibold bg-[var(--surface-2)]'
                            : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                        }`
                      }
                    >
                      Ringkasan Hub
                    </NavLink>
                    {item.subItems?.map((sub) => (
                      <NavLink
                        key={sub.to}
                        to={sub.to}
                        className={({ isActive }) =>
                          `block px-3 py-1.5 rounded-[var(--radius-control)] text-xs transition-colors ${
                            isActive
                              ? 'text-[var(--accent)] font-semibold bg-[var(--surface-2)]'
                              : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                          }`
                        }
                      >
                        {sub.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          if (collapsed) {
            return (
              <NavLink
                key={item.to}
                to={item.to}
                title={item.label}
                className={({ isActive }) =>
                  `flex items-center justify-center w-10 h-10 mx-auto rounded-[var(--radius-control)] transition-colors ${
                    isActive
                      ? 'bg-[var(--surface-2)] text-[var(--accent)] font-semibold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
                  }`
                }
              >
                <Icon className="w-4 h-4" strokeWidth={1.75} />
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-control)] text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[var(--surface-2)] text-[var(--text)] font-semibold border-l-2 border-[var(--accent)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        {isAdmin && !collapsed && (
          <div className="pt-4 border-t border-[var(--border)]">
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-control)] text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[var(--surface-2)] text-[var(--text)] font-semibold border-l-2 border-[var(--accent)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
                }`
              }
            >
              <ShieldCheck className="w-4 h-4 shrink-0" strokeWidth={1.75} />
              <span>Admin CMS</span>
            </NavLink>
          </div>
        )}
      </nav>

      {/* Footer Identity & Theme Controls */}
      <div className="p-3 border-t border-[var(--border)] bg-[var(--surface)]">
        {user ? (
          <div className="space-y-3">
            {!collapsed ? (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar name={user.name} size="sm" />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-[var(--text)] truncate">
                      {user.name}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] truncate">
                      Level {user.current_level} · {user.total_xp} XP
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <IconButton
                    icon={resolvedTheme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                    aria-label="Ubah tema"
                    onClick={toggleTheme}
                    size="sm"
                  />
                  <IconButton
                    icon={<LogOut className="w-3.5 h-3.5" />}
                    aria-label="Keluar"
                    onClick={logout}
                    size="sm"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Avatar name={user.name} size="sm" />
                <IconButton
                  icon={resolvedTheme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                  aria-label="Ubah tema"
                  onClick={toggleTheme}
                  size="sm"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between">
            {!collapsed && (
              <span className="text-xs text-[var(--text-muted)]">Mode Tamu</span>
            )}
            <IconButton
              icon={resolvedTheme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              aria-label="Ubah tema"
              onClick={toggleTheme}
              size="sm"
            />
          </div>
        )}
      </div>
    </aside>
  );
};
