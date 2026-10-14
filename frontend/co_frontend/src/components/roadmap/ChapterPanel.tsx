import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { RoadmapGlyph } from './RoadmapGlyphs';
import { apiClient } from '../../api/client';
import toast from 'react-hot-toast';
import { ArrowRight, CheckCircle2, Lock, Gift, Sparkles } from 'lucide-react';
import { linkTo } from '../../routes';

export interface LessonSummary {
  id: number;
  title: string;
  type: string;
  difficulty?: string;
  estimated_minutes?: number | null;
  xp_reward?: number;
  is_completed?: boolean;
  is_locked?: boolean;
}

export interface ChapterDetails {
  id: number;
  title: string;
  description: string | null;
  sort_order: number;
  mastery_percentage: number;
  mastery_threshold: number;
  is_mastered: boolean;
  lessons: LessonSummary[];
  chest_opened?: boolean;
  chest_reward_coins?: number;
}

export interface ChapterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  chapter: ChapterDetails | null;
  onChestOpened?: (chapterId: number, coins: number) => void;
}

export const ChapterPanel: React.FC<ChapterPanelProps> = ({
  isOpen,
  onClose,
  chapter,
  onChestOpened,
}) => {
  const [openingChest, setOpeningChest] = useState(false);
  const [chestResult, setChestResult] = useState<{ coins: number; cosmetic?: any } | null>(null);

  if (!chapter) return null;

  // Find next actionable lesson
  const nextLesson = chapter.lessons.find((l) => !l.is_completed && !l.is_locked)
    || chapter.lessons[0];

  const handleOpenChest = async () => {
    if (!chapter.is_mastered || chapter.chest_opened) return;
    setOpeningChest(true);
    try {
      const res = await apiClient.post(`/chests/${chapter.id}/open`);
      setChestResult(res.data);
      toast.success(`Selamat! Anda mendapatkan ${res.data.coins} koin!`);
      if (onChestOpened) {
        onChestOpened(chapter.id, res.data.coins);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal membuka peti hadiah.');
    } finally {
      setOpeningChest(false);
    }
  };

  const getStageLabel = (type: string) => {
    switch (type) {
      case 'theory':
        return 'Pondasi Teori';
      case 'practice':
        return 'Latihan Terpandu';
      case 'debug':
        return 'Diagnosa Bug';
      case 'fix':
        return 'Perbaikan Kode';
      case 'challenge':
        return 'Tantangan Mandiri';
      case 'chapter_review':
        return 'Ujian Evaluasi Bab';
      case 'project':
        return 'Proyek Capstone';
      default:
        return 'Aktivitas';
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={chapter.title}
      description={chapter.description ?? undefined}
      footer={
        nextLesson && (
          <Link to={linkTo.lesson(nextLesson.id)} className="block w-full">
            <Button
              variant="primary"
              size="md"
              className="w-full justify-center"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Lanjutkan: {nextLesson.title}
            </Button>
          </Link>
        )
      }
    >
      <div className="space-y-6">
        {/* Mastery progress box */}
        <div className="p-4 rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--surface-2)] space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[var(--text)]">Tingkat Penguasaan</span>
            <span className="font-medium text-[var(--text-muted)]">
              {chapter.mastery_percentage}% / {chapter.mastery_threshold}% Target
            </span>
          </div>
          <ProgressBar
            value={chapter.mastery_percentage}
            variant={chapter.is_mastered ? 'success' : 'accent'}
          />
        </div>

        {/* Mystery Chest Section */}
        <div className="p-4 rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--surface)] space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[var(--radius-control)] bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--warning)] shrink-0">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[var(--text)]">Peti Hadiah Bab</h4>
              <p className="text-[11px] text-[var(--text-muted)]">
                Buka untuk mendapatkan 40–100 koin dan kosmetik langka.
              </p>
            </div>
          </div>

          {chestResult || chapter.chest_opened ? (
            <div className="p-2.5 bg-[var(--surface-2)] rounded-[var(--radius-control)] text-xs text-[var(--success)] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                Peti telah dibuka! ({chestResult?.coins || chapter.chest_reward_coins || 50} Koin dikreditkan ke dompet)
              </span>
            </div>
          ) : chapter.is_mastered ? (
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              loading={openingChest}
              onClick={handleOpenChest}
              icon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Buka Peti Misteri Sekarang
            </Button>
          ) : (
            <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Selesaikan minimal {chapter.mastery_threshold}% materi untuk membuka peti.</span>
            </div>
          )}
        </div>

        {/* Lesson Stages List */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-[var(--text)] border-b border-[var(--border)] pb-1.5">
            Daftar Materi & Latihan ({chapter.lessons.length})
          </h4>

          <div className="space-y-2">
            {chapter.lessons.map((lesson) => {
              const isDone = lesson.is_completed;
              const isLocked = lesson.is_locked;

              return (
                <div
                  key={lesson.id}
                  className={`p-3 rounded-[var(--radius-control)] border transition-colors flex items-center justify-between gap-3 ${
                    isDone
                      ? 'border-[var(--border)] bg-[var(--surface-2)]/60'
                      : isLocked
                      ? 'border-[var(--border)]/60 bg-[var(--surface-2)]/30 opacity-70'
                      : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
                      ) : isLocked ? (
                        <Lock className="w-4 h-4 text-[var(--text-muted)]" />
                      ) : (
                        <RoadmapGlyph name={lesson.type} size={16} className="text-[var(--accent)]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-[var(--text)] truncate">
                        {lesson.title}
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)]">
                        {getStageLabel(lesson.type)} · {lesson.estimated_minutes || 5} mnt
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {isDone ? (
                      <span className="text-xs text-[var(--success)] font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Selesai
                      </span>
                    ) : isLocked ? (
                      <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" />
                        Terkunci
                      </span>
                    ) : (
                      <Link to={linkTo.lesson(lesson.id)}>
                        <Button variant="secondary" size="sm">
                          Mulai
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Drawer>
  );
};
