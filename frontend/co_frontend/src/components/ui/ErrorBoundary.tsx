import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { PipOwl } from '../mascot/PipOwl';
import { Button } from './Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex flex-col items-center justify-center p-6 text-center select-none"
          style={{ background: 'var(--bg)', color: 'var(--text)' }}
        >
          <PipOwl width={80} height={90} mood="sad" />
          <div className="mt-6 space-y-2 max-w-sm">
            <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
              Terjadi Kesalahan
            </h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Aplikasi mengalami kendala saat memuat tampilan ini. Jangan khawatir, progres belajarmu tetap aman.
            </p>
            {this.state.error?.message && (
              <p
                className="text-[11px] font-mono p-2 rounded border mt-2 break-all text-left"
                style={{
                  background: 'var(--surface-2)',
                  borderColor: 'var(--border)',
                  color: 'var(--danger)',
                }}
              >
                {this.state.error.message}
              </p>
            )}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <Button variant="primary" size="sm" onClick={this.handleReload}>
              Muat Ulang
            </Button>
            <Button variant="secondary" size="sm" onClick={this.handleGoHome}>
              Ke Beranda
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
