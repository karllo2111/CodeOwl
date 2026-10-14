import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { coursesApi } from "../../api/courses";
import { progressApi } from "../../api/progress";
import { useUiStore } from "../../stores/uiStore";
import { useAuthStore } from "../../stores/authStore";
import type { Lesson, LessonContentItem } from "../../types/course";
import { Button } from "../../components/ui/Button";
import { Alert } from "../../components/ui/Alert";
import { ArrowLeft, ArrowRight, CheckCircle2, BookOpen } from "lucide-react";

import { useProgressStore } from "../../stores/progressStore";

export const TheoryPage: React.FC<{ lessonId?: number }> = ({ lessonId: propLessonId }) => {
  const { id } = useParams<{ id: string }>();
  const lessonId = propLessonId || Number(id);
  const { showXpPopup } = useUiStore();
  const { fetchUser } = useAuthStore();
  const { isLessonCompleted, completeLesson } = useProgressStore();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [contents, setContents] = useState<LessonContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(isLessonCompleted(lessonId));

  useEffect(() => {
    if (!lessonId) return;
    setCompleted(isLessonCompleted(lessonId));
    setLoading(true);
    Promise.all([coursesApi.getLesson(lessonId), coursesApi.getLessonContent(lessonId)])
      .then(([l, c]) => {
        setLesson(l);
        setContents(c || []);
      })
      .finally(() => setLoading(false));
  }, [lessonId, isLessonCompleted]);

  const [readingSeconds, setReadingSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setReadingSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleComplete = async () => {
    if (!lesson) return;
    setCompleting(true);
    try {
      await completeLesson(lesson.id);
      showXpPopup(lesson.xp_reward || 20);
      setCompleted(true);
      fetchUser();
    } finally {
      setCompleting(false);
    }
  };

  if (loading) return (
    <div className="p-16 text-center text-slate-500 text-sm">
      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-3" />
      Loading lesson documentation...
    </div>
  );
  if (!lesson) return <div className="p-8 text-center text-rose-400">Lesson not found.</div>;

  const headings = contents
    .filter((c) => c.block_type === 'text' && c.content?.title)
    .map((c) => ({ id: `section-${c.id}`, title: c.content.title }));

  return (
    <div className="min-h-full max-w-7xl mx-auto px-4 sm:px-8 py-8 font-sans">
      {/* Top Breadcrumb Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-8">
        <Link
          to={`/chapters/${lesson.chapter_id}`}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
          Back to Chapter
        </Link>
          <span className="text-xs font-medium text-[var(--accent)] num">
            +{lesson.xp_reward || 20} XP
          </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Article Content (8 cols) */}
        <article className="lg:col-span-9 space-y-8 max-w-[72ch]">
          <header className="space-y-3 pb-6 border-b border-white/[0.08]">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">{lesson.title}</h1>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span>{lesson.estimated_minutes || 5} min read</span>
              <span>·</span>
              <span className="text-amber-400 font-medium">Earn +{lesson.xp_reward || 20} XP</span>
              <span>·</span>
              <span className="font-mono text-slate-500">{readingSeconds}s elapsed</span>
            </div>
          </header>

          <div className="space-y-6 text-slate-300 leading-relaxed text-sm sm:text-base">
            {contents.map((item) => {
              if (item.block_type === 'text') {
                return (
                  <div key={item.id} id={`section-${item.id}`} className="space-y-3 pt-2">
                    {item.content.title && (
                      <h3 className="text-xl font-bold text-white tracking-tight">{item.content.title}</h3>
                    )}
                    <p className="whitespace-pre-line leading-relaxed text-slate-300">{item.content.body}</p>
                  </div>
                );
              }
              if (item.block_type === 'code') {
                return (
                  <div key={item.id} className="bezel-shell my-4">
                    <div className="bezel-core overflow-hidden">
                      {item.content.caption && (
                        <div className="px-4 py-2 bg-white/[0.02] border-b border-white/[0.06] text-xs text-slate-400 font-mono">
                          {item.content.caption}
                        </div>
                      )}
                      <pre className="p-4 sm:p-5 overflow-x-auto text-emerald-300/90 font-mono text-xs sm:text-sm bg-black/40">
                        <code>{item.content.code}</code>
                      </pre>
                    </div>
                  </div>
                );
              }
              if (item.block_type === 'callout') {
                return (
                  <div key={item.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                    <div className="text-xs font-semibold text-white flex items-center gap-2">
                      <span className="text-amber-400">💡</span> {item.content.title || 'Catatan'}
                    </div>
                    <div className="text-xs text-slate-300 leading-relaxed">{item.content.body}</div>
                  </div>
                );
              }
              return null;
            })}
          </div>

          <footer className="pt-8 border-t border-white/[0.08] flex items-center justify-between">
            <Link to={`/chapters/${lesson.chapter_id}`}>
              <Button variant="ghost" size="md">
                Kembali ke Bab
              </Button>
            </Link>

            {completed ? (
              <Link to={`/lessons/${lesson.id + 1}`}>
                <Button variant="success" size="md">
                  Lanjut ke Pelajaran Berikutnya
                  <ArrowRight className="w-4 h-4 ml-1.5" strokeWidth={1.5} />
                </Button>
              </Link>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={handleComplete}
                isLoading={completing}
              >
                Paham & Lanjut (+{lesson.xp_reward || 20} XP)
                <ArrowRight className="w-4 h-4 ml-1.5" strokeWidth={1.5} />
              </Button>
            )}
          </footer>
        </article>

        {/* Right Sticky TOC Sidebar (3 cols) */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-8 space-y-5 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <div className="text-[10px] font-semibold text-[var(--text-muted)]">
              On This Page
            </div>
            {headings.length > 0 ? (
              <ul className="space-y-2 text-xs">
                {headings.map((h) => (
                  <li key={h.id}>
                    <a
                      href={`#${h.id}`}
                      className="text-slate-400 hover:text-white transition-colors block truncate"
                    >
                      {h.title}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-xs text-slate-500">General Overview</div>
            )}

            <div className="pt-4 border-t border-white/[0.06] text-[11px] text-slate-500">
              Status: <span className={completed ? 'text-emerald-400 font-semibold' : 'text-amber-400'}>{completed ? 'Mastered' : 'Reading'}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
