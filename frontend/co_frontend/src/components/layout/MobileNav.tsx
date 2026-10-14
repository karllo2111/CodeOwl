import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Code2, Trophy, User as UserIcon } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const items = [
    { to: '/', label: 'Beranda', icon: LayoutDashboard },
    { to: '/courses', label: 'Belajar', icon: BookOpen },
    { to: '/practice', label: 'Latihan', icon: Code2 },
    { to: '/leaderboard', label: 'Peringkat', icon: Trophy },
    { to: '/profile', label: 'Profil', icon: UserIcon },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-[var(--surface)] border-t border-[var(--border)] flex items-center justify-around z-50 px-2 select-none">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-14 h-full gap-0.5 text-[10px] font-medium transition-colors ${
                isActive ? 'text-[var(--accent)] font-semibold' : 'text-[var(--text-muted)]'
              }`
            }
          >
            <Icon className="w-4 h-4" strokeWidth={1.75} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
