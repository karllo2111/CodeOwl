import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useParams, Link } from "react-router-dom";
import { useAuthStore } from "./stores/authStore";
import { useProgressStore } from "./stores/progressStore";
import { coursesApi } from "./api/courses";
import type { Lesson } from "./types/course";
import { Lock, ArrowLeft, ArrowRight, ShieldAlert } from "lucide-react";
import { Button } from "./components/ui/Button";
import { Toaster } from "react-hot-toast";

// Layout
import { AppLayout } from "./components/layout/AppLayout";

// Pages
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { CourseList } from "./pages/courses/CourseList";
import { CourseDetail } from "./pages/courses/CourseDetail";
import { ChapterDetail } from "./pages/courses/ChapterDetail";
import { TheoryPage } from "./pages/learn/TheoryPage";
import { WorkspacePage } from "./pages/learn/WorkspacePage";
import { PlaygroundPage } from "./pages/PlaygroundPage";
import { ProfilePage } from "./pages/profile/ProfilePage";
import { AchievementsPage } from "./pages/profile/AchievementsPage";
import { LeaderboardPage } from "./pages/LeaderboardPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { ChapterReviewPage } from "./pages/learn/ChapterReviewPage";
import { ProjectWorkspacePage } from "./pages/learn/ProjectWorkspacePage";

import { UiShowcase } from "./pages/dev/UiShowcase";
import { PracticeHub } from "./pages/practice/PracticeHub";
import { NotFoundPage } from "./pages/NotFoundPage";


// Dynamic lesson dispatcher with STRICT sequential prerequisite guard
const LessonDispatcher: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const lessonId = Number(id);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [chapterLessons, setChapterLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  const { isLessonCompleted, fetchProgress } = useProgressStore();

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  useEffect(() => {
    if (!lessonId) return;
    setLoading(true);
    coursesApi
      .getLesson(lessonId)
      .then((l) => {
        setLesson(l);
        return coursesApi.getChapterLessons(l.chapter_id);
      })
      .then((lessons) => {
        setChapterLessons(lessons || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [lessonId]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span>Memuat konten materi...</span>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="h-full flex items-center justify-center text-rose-400">
        Pelajaran tidak ditemukan.
      </div>
    );
  }

  // Strict Sequential Check:
  // Lesson must not be skipped. If there is a previous lesson in this chapter, it must be completed.
  const sorted = [...chapterLessons].sort((a, b) => a.sort_order - b.sort_order);
  const currentIndex = sorted.findIndex((l) => l.id === lesson.id);

  if (currentIndex > 0) {
    const prevLesson = sorted[currentIndex - 1];
    const prevCompleted = isLessonCompleted(prevLesson.id);

    if (!prevCompleted) {
      return (
        <div className="h-full flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 shadow-sm">
            <Lock className="w-8 h-8 text-slate-400" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-slate-100">Materi Masih Terkunci</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Anda tidak dapat melewati materi. Selesaikan <strong>"{prevLesson.title}"</strong> terlebih dahulu untuk membuka pelajaran ini.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full justify-center">
            <Link to={`/lessons/${prevLesson.id}`} className="w-full sm:w-auto">
              <Button variant="primary" size="md" className="w-full">
                Buka Pelajaran Sebelumnya
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>

            <Link to={`/chapters/${lesson.chapter_id}`} className="w-full sm:w-auto">
              <Button variant="secondary" size="md" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Lihat Roadmap Bab
              </Button>
            </Link>
          </div>
        </div>
      );
    }
  }

  // Pure theory lessons use the clean documentation reader view
  if (lesson.type === "theory") {
    return <TheoryPage lessonId={lesson.id} />;
  }

  // Reviews use the exam assessment suite
  if (lesson.type === "chapter_review" || lesson.type === "level_review") {
    return <ChapterReviewPage />;
  }

  // Projects use the multi-file workspace
  if (lesson.type === "project") {
    return <ProjectWorkspacePage />;
  }

  // Interactive coding lessons use the workspace
  return <WorkspacePage lessonId={lesson.id} />;
};

export default function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--surface)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-control)',
            fontSize: '13px',
          },
        }}
      />
      <Routes>
        {/* Standalone Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main App Layout */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/:slug" element={<CourseDetail />} />
          <Route path="/chapters/:id" element={<ChapterDetail />} />
          <Route path="/lessons/:id" element={<LessonDispatcher />} />
          <Route path="/review/:id" element={<ChapterReviewPage />} />
          <Route path="/projects/:id" element={<ProjectWorkspacePage />} />
          <Route path="/playground" element={<PlaygroundPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/practice" element={<PracticeHub />} />
          <Route path="/dev/ui" element={<UiShowcase />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}
