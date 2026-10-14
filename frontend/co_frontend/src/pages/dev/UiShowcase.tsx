import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { IconButton } from '../../components/ui/IconButton';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Checkbox } from '../../components/ui/Checkbox';
import { Switch } from '../../components/ui/Switch';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { Tabs } from '../../components/ui/Tabs';
import { Badge } from '../../components/ui/Badge';
import { DifficultyLabel } from '../../components/ui/DifficultyLabel';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Avatar } from '../../components/ui/Avatar';
import { Stat } from '../../components/ui/Stat';
import { PageHeader } from '../../components/ui/PageHeader';
import { Section } from '../../components/ui/Section';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { Spinner } from '../../components/ui/Spinner';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Drawer } from '../../components/ui/Drawer';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { Kbd } from '../../components/ui/Kbd';
import { useThemeStore } from '../../stores/themeStore';
import { Sun, Moon, Play, Check } from 'lucide-react';

export const UiShowcase: React.FC = () => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useThemeStore();

  const [inputVal, setInputVal] = useState('');
  const [checked, setChecked] = useState(false);
  const [switched, setSwitched] = useState(true);
  const [segment, setSegment] = useState<'a' | 'b' | 'c'>('a');
  const [activeTab, setActiveTab] = useState('tab1');
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-10">
      <PageHeader
        title="Living Style Guide"
        description="Komponen UI CodeQuest v3 — tokens semantic, 6px/10px radii, tanpa slop dekoratif."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              onClick={toggleTheme}
            >
              Mode: {resolvedTheme} ({theme})
            </Button>
          </div>
        }
      />

      <Breadcrumb
        items={[
          { label: 'Beranda', to: '/' },
          { label: 'Dev Area', to: '/dev/ui' },
          { label: 'Komponen UI' },
        ]}
      />

      {/* 1. BUTTONS */}
      <Section title="Tombol (Button & IconButton)">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" size="md">Primary</Button>
            <Button variant="secondary" size="md">Secondary</Button>
            <Button variant="ghost" size="md">Ghost</Button>
            <Button variant="danger" size="md">Danger</Button>
            <Button variant="primary" size="md" icon={<Play className="w-3.5 h-3.5" />}>With Icon</Button>
            <Button variant="primary" size="md" loading>Loading</Button>
            <Button variant="primary" size="md" disabled>Disabled</Button>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="md">Medium</Button>
            <Button variant="primary" size="lg">Large</Button>
            <IconButton icon={<Check className="w-4 h-4" />} aria-label="Selesai" />
          </div>
        </div>
      </Section>

      {/* 2. FORM CONTROLS */}
      <Section title="Form Controls">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          <Input
            label="Email"
            placeholder="you@example.com"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            hint="Gunakan email aktif Anda."
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error="Kata sandi minimal 8 karakter"
          />
          <Select
            label="Pilih Jalur Belajar"
            options={[
              { value: 'js', label: 'JavaScript' },
              { value: 'python', label: 'Python' },
            ]}
          />
          <div className="flex flex-col gap-3 justify-center pt-2">
            <Checkbox
              label="Ingat sesi saya"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
            <Switch
              label="Sembunyikan profil publik"
              checked={switched}
              onChange={setSwitched}
            />
          </div>
        </div>
      </Section>

      {/* 3. NAVIGATION & TABS */}
      <Section title="Segment & Tabs">
        <div className="space-y-4">
          <SegmentedControl
            options={[
              { value: 'a', label: 'Semua Latihan' },
              { value: 'b', label: 'Belum Selesai' },
              { value: 'c', label: 'Sudah Selesai' },
            ]}
            value={segment}
            onChange={setSegment}
          />

          <Tabs
            tabs={[
              { id: 'tab1', label: 'Overview', count: 12 },
              { id: 'tab2', label: 'Kurikulum', count: 6 },
              { id: 'tab3', label: 'Pencapaian' },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>
      </Section>

      {/* 4. STATUS & LABELS */}
      <Section title="Badge & Difficulty (Status Only)">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="neutral">Netral</Badge>
          <Badge variant="success">Lulus</Badge>
          <Badge variant="warning">Sedang Ditinjau</Badge>
          <Badge variant="danger">Gagal</Badge>
          <DifficultyLabel difficulty="easy" />
          <DifficultyLabel difficulty="normal" />
          <DifficultyLabel difficulty="hard" />
          <Kbd>Ctrl + Enter</Kbd>
        </div>
      </Section>

      {/* 5. METRICS & PROGRESS */}
      <Section title="Stats, Progress & Avatar">
        <div className="space-y-6">
          <div className="flex items-center gap-8">
            <Stat value="1,240 XP" label="Total Poin XP" size="md" />
            <Stat value="12 Hari" label="Streak Konsisten" size="md" />
            <Stat value="Level 4" label="Tingkat Akun" size="md" />
          </div>

          <div className="space-y-2 max-w-md">
            <div className="text-xs text-[var(--text-muted)]">Progress Bab: 65%</div>
            <ProgressBar value={65} variant="accent" />
          </div>

          <div className="flex items-center gap-4">
            <Avatar name="Admin" size="sm" />
            <Avatar
              name="Karllo"
              size="md"
              frame={{ borderWidth: 2, borderColor: '#16a34a', borderStyle: 'solid' }}
            />
            <Avatar
              name="Master"
              size="lg"
              frame={{ borderWidth: 2, borderColor: '#2563eb', borderStyle: 'solid', padding: 2 }}
            />
          </div>
        </div>
      </Section>

      {/* 6. ALERTS & CARDS */}
      <Section title="Alert & Cards">
        <div className="space-y-4">
          <Alert variant="info" title="Informasi Singkat">
            Ini adalah pemberitahuan faktual tanpa teks marketing.
          </Alert>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="p-4 space-y-2" hoverable>
              <h4 className="text-sm font-semibold text-[var(--text)]">Entitas Berulang (Card)</h4>
              <p className="text-xs text-[var(--text-muted)]">
                Digunakan hanya untuk daftar kursus, baris pencapaian, atau item toko. Single container level.
              </p>
            </Card>

            <Card className="p-4 space-y-2">
              <h4 className="text-sm font-semibold text-[var(--text)]">Loading Skeletons</h4>
              <div className="space-y-2 pt-1">
                <Skeleton height={14} className="w-3/4" />
                <Skeleton height={12} className="w-1/2" />
              </div>
            </Card>
          </div>
        </div>
      </Section>

      {/* 7. DIALOGS & OVERLAYS */}
      <Section title="Overlays (Modal, Confirm, Drawer)">
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => setModalOpen(true)}>Buka Modal</Button>
          <Button variant="secondary" size="sm" onClick={() => setConfirmOpen(true)}>Buka Dialog Konfirmasi</Button>
          <Button variant="secondary" size="sm" onClick={() => setDrawerOpen(true)}>Buka Panel Drawer</Button>
        </div>

        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Detail Materi">
          <p className="text-xs text-[var(--text-muted)]">Isi dialog modal yang bersih dan terstruktur.</p>
        </Modal>

        <ConfirmDialog
          isOpen={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={() => setConfirmOpen(false)}
          title="Beli Streak Freeze?"
          description="Anda akan menggunakan 100 koin untuk membeli 1x pelindung streak."
          confirmLabel="Beli Sekarang"
        />

        <Drawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title="Bab 1: Variabel & Tipe Data"
          description="Pelajari cara menyimpan data di memori komputer."
          footer={
            <Button variant="primary" size="md" className="w-full">
              Lanjutkan Pelajaran
            </Button>
          }
        >
          <div className="space-y-3">
            <div className="p-3 bg-[var(--surface-2)] rounded-[var(--radius-control)]">
              <div className="font-semibold text-xs text-[var(--text)]">1.1 Apa itu Variabel?</div>
              <div className="text-[11px] text-[var(--text-muted)]">Teori dasar · 5 menit</div>
            </div>
            <div className="p-3 bg-[var(--surface-2)] rounded-[var(--radius-control)]">
              <div className="font-semibold text-xs text-[var(--text)]">1.2 Deklarasi Let & Const</div>
              <div className="text-[11px] text-[var(--text-muted)]">Latihan · 8 menit</div>
            </div>
          </div>
        </Drawer>
      </Section>
    </div>
  );
};
