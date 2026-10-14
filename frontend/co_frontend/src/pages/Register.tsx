import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Alert } from '../components/ui/Alert';
import { Input } from '../components/ui/Input';
import { PipOwl } from '../components/mascot/PipOwl';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await register({
        name,
        email,
        username: username.trim() || undefined,
        password,
        password_confirmation: passwordConfirmation,
      });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Pendaftaran gagal.');
    } finally {
      setLoading(false);
    }
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
              Daftar CodeQuest
            </h1>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Mulai belajar pemrograman secara terstruktur dan gratis
            </p>
          </div>
        </div>

        <Card className="p-6 space-y-5">
          {error && <Alert variant="error">{error}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <Input
              label="Nama Lengkap"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama kamu"
            />

            <Input
              label="Username (opsional)"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
            />

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
              placeholder="Minimal 8 karakter"
            />

            <Input
              label="Konfirmasi Kata Sandi"
              type="password"
              required
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="Ulangi kata sandi"
            />

            <Button type="submit" variant="primary" className="w-full justify-center pt-1" isLoading={loading}>
              Buat Akun
            </Button>
          </form>
        </Card>

        <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
          Sudah punya akun?{' '}
          <Link to="/login" className="font-semibold hover:underline" style={{ color: 'var(--accent)' }}>
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
};
