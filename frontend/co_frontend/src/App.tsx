import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useParams, Link } from "react-router-dom";
import { useAuthStore } from "./stores/authStore";
import { useProgressStore } from "./stores/progressStore";
import { coursesApi } from "./api/courses";
import type { Lesson } from "./types/course";
import { Lock, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "./components/ui/Button";
import { Toaster } from "react-hot-toast";
import { ROUTES, linkTo } from "./routes";

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
import { ShopPage } from "./pages/shop/ShopPage";
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
      <div className="h-full flex items-center justify-center text-[var(--text-muted)]">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          <span>Memuat materi...</span>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="h-full flex items-center justify-center text-[var(--text-muted)]">
        Materi tidak ditemukan.
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
          <div className="w-16 h-16 rounded-[var(--radius-card)] bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)]">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-semibold text-[var(--text)]">Materi Masih Terkunci</h2>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Selesaikan <strong className="text-[var(--text)]">"{prevLesson.title}"</strong> terlebih dahulu untuk membuka materi ini.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full justify-center">
            <Link to={linkTo.lesson(prevLesson.id)} className="w-full sm:w-auto">
              <Button variant="primary" size="md" className="w-full">
                Buka Materi Sebelumnya
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>

            <Link to={linkTo.chapter(lesson.chapter_id)} className="w-full sm:w-auto">
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

  if (lesson.type === "theory") {
    return <TheoryPage lessonId={lesson.id} />;
  }

  if (lesson.type === "chapter_review" || lesson.type === "level_review") {
    return <ChapterReviewPage />;
  }

  if (lesson.type === "project") {
    return <ProjectWorkspacePage />;
  }

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
        {/* Standalone 404 — outside AppLayout so no shell renders */}
        <Route path="*" element={<NotFoundPage />} />

        {/* Standalone Auth Routes */}
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />

        {/* Legacy redirects — keep old URLs working */}
        <Route path="/login" element={<Navigate to={ROUTES.LOGIN} replace />} />
        <Route path="/register" element={<Navigate to={ROUTES.REGISTER} replace />} />
        <Route path="/courses" element={<Navigate to={ROUTES.CURRICULUM} replace />} />
        <Route path="/courses/:slug" element={<RedirectCourseSlug />} />
        <Route path="/chapters/:id" element={<RedirectChapterId />} />
        <Route path="/lessons/:id" element={<RedirectLessonId />} />
        <Route path="/projects/:id" element={<RedirectProjectId />} />
        <Route path="/profile" element={<Navigate to={ROUTES.PROFILE} replace />} />
        <Route path="/leaderboard" element={<Navigate to={ROUTES.LEADERBOARD} replace />} />
        <Route path="/practice" element={<Navigate to={ROUTES.PRACTICE} replace />} />
        <Route path="/shop" element={<Navigate to={ROUTES.SHOP} replace />} />
        <Route path="/achievements" element={<Navigate to={ROUTES.PROFILE} replace />} />

        {/* Main App Layout */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />

          {/* Kurikulum */}
          <Route path={ROUTES.CURRICULUM} element={<CourseList />} />
          <Route path={ROUTES.COURSE_DETAIL} element={<CourseDetail />} />
          <Route path={ROUTES.CHAPTER_DETAIL} element={<ChapterDetail />} />
          <Route path={ROUTES.LESSON} element={<LessonDispatcher />} />
          <Route path={ROUTES.REVIEW} element={<ChapterReviewPage />} />
          <Route path={ROUTES.PROJECT_WORKSPACE} element={<ProjectWorkspacePage />} />

          {/* Latihan */}
          <Route path={ROUTES.PRACTICE} element={<PracticeHub />} />
          <Route path={ROUTES.PRACTICE_QUESTIONS} element={<PracticeHub />} />
          <Route path={ROUTES.PRACTICE_DEBUG} element={<PracticeHub />} />
          <Route path={ROUTES.PRACTICE_FIX} element={<PracticeHub />} />
          <Route path={ROUTES.PRACTICE_CHALLENGES} element={<PracticeHub />} />
          <Route path={ROUTES.PRACTICE_PROJECTS} element={<PracticeHub />} />

          {/* Other pages */}
          <Route path={ROUTES.PLAYGROUND} element={<PlaygroundPage />} />
          <Route path={ROUTES.LEADERBOARD} element={<LeaderboardPage />} />
          <Route path={ROUTES.SHOP} element={<ShopPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          <Route path={ROUTES.ADMIN} element={<AdminDashboard />} />
          <Route path={ROUTES.DEV_UI} element={<UiShowcase />} />
        </Route>
      </Routes>
    </>
  );
}

// ── Redirect helpers for legacy parameterised paths ──────────────────────────

function RedirectCourseSlug() {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={linkTo.course(slug ?? '')} replace />;
}

function RedirectChapterId() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={linkTo.chapter(id ?? '')} replace />;
}

function RedirectLessonId() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={linkTo.lesson(id ?? '')} replace />;
}

function RedirectProjectId() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={linkTo.project(id ?? '')} replace />;
}
