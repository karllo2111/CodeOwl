import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Alert } from '../components/ui/Alert';
import { Input } from '../components/ui/Input';
import { PipOwl } from '../components/mascot/PipOwl';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password, remember);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email atau kata sandi tidak valid.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password');
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center p-6 font-sans"
      style={{ background: 'var(--bg)', color: 'var(--text)' }}
    >
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-3 flex flex-col items-center">
          <PipOwl width={56} height={60} />
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
              Masuk ke CodeQuest
            </h1>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Lanjutkan perjalanan belajarmu hari ini
            </p>
          </div>
        </div>

        <Card className="p-6 space-y-5">
          {error && <Alert variant="error">{error}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Alamat Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@contoh.com"
            />

            <Input
              label="Kata Sandi"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none text-[var(--text)]">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded-[4px] border border-[var(--border)] bg-[var(--surface)] text-[var(--accent)] accent-[var(--accent)] cursor-pointer"
                />
                <span>Ingat saya</span>
              </label>
            </div>

            <Button type="submit" variant="primary" className="w-full justify-center" isLoading={loading}>
              Masuk
            </Button>
          </form>

          <div
            className="pt-3 border-t text-center space-y-2"
            style={{ borderColor: 'var(--border)' }}
          >
            <span className="text-xs block" style={{ color: 'var(--text-subtle)' }}>
              Akun demo cepat:
            </span>
            <div className="flex gap-2 justify-center">
              <Button variant="secondary" size="sm" onClick={() => fillDemo('karllo@codeowl.dev')}>
                Pelajar (Karllo)
              </Button>
              <Button variant="secondary" size="sm" onClick={() => fillDemo('admin@codeowl.dev')}>
                Admin
              </Button>
            </div>
          </div>
        </Card>

        <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
          Belum punya akun?{' '}
          <Link to="/register" className="font-semibold hover:underline" style={{ color: 'var(--accent)' }}>
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
};
