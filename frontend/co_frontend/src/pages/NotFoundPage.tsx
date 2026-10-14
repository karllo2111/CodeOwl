import React from 'react';
import { Link } from 'react-router-dom';
import { PipOwl } from '../components/mascot/PipOwl';
import { Button } from '../components/ui/Button';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => (
  <div
    className="min-h-screen flex flex-col items-center justify-center p-8 text-center"
    style={{ background: 'var(--bg)', color: 'var(--text)' }}
  >
    <PipOwl width={100} height={110} mood="sad" />

    <div className="mt-8 space-y-2">
      <h1 className="text-4xl font-bold" style={{ color: 'var(--text)' }}>404</h1>
      <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
        Halaman tidak ditemukan
      </h2>
      <p className="text-sm max-w-xs mx-auto" style={{ color: 'var(--text-muted)' }}>
        Sepertinya Pip nyasar. Halaman yang kamu cari tidak ada atau sudah dipindahkan.
      </p>
    </div>

    <div className="mt-8 flex items-center gap-3">
      <Link to="/">
        <Button variant="primary" size="md">
          <Home className="w-4 h-4 mr-1.5" />
          Ke Beranda
        </Button>
      </Link>
      <button
        onClick={() => window.history.back()}
        className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        style={{ color: 'var(--text-muted)' }}
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </button>
    </div>
  </div>
);
