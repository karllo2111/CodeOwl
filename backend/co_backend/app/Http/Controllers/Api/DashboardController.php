<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Chapter;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\User;
use App\Models\UserProgress;
use App\Services\ProgressService;
use App\Services\RankService;
use App\Services\StreakService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(
        protected StreakService $streakService,
        protected RankService $rankService,
        protected ProgressService $progressService
    ) {}

    public function show(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        // 1. Resume target (exact unfinished lesson)
        $resumeTarget = $this->findResumeTarget($user);

        // 2. Week strip and streak
        $weekStrip = $this->streakService->getWeekStrip($user);
        $streak = $user->streak;

        // 3. User rank
        $rank = $this->rankService->getUserRank($user);

        // 4. Onboarding checklist
        $checklist = $this->getOnboardingChecklist($user);

        // 5. Recent achievements (last 3)
        $recentAchievements = $user->achievements()
            ->orderByPivot('earned_at', 'desc')
            ->take(3)
            ->get(['achievements.id', 'achievements.title', 'achievements.description', 'achievements.icon', 'achievements.xp_reward']);

        // 6. User courses with real progress
        $courses = Course::published()->ordered()->with('levels.chapters')->get()->map(function ($course) use ($user) {
            $totalLessons = $course->chapters->flatMap->lessons->where('is_published', true)->count();
            $completedLessons = UserProgress::where('user_id', $user->id)
                ->whereIn('lesson_id', $course->chapters->flatMap->lessons->pluck('id'))
                ->where('status', 'completed')
                ->count();

            $percent = $totalLessons > 0 ? (int) round(($completedLessons / $totalLessons) * 100) : 0;

            return [
                'id' => $course->id,
                'title' => $course->title,
                'slug' => $course->slug,
                'description' => $course->description,
                'progress_percent' => $percent,
                'total_lessons' => $totalLessons,
                'completed_lessons' => $completedLessons,
            ];
        });

        return response()->json([
            'resume_target' => $resumeTarget,
            'streak' => [
                'current' => $streak?->current_streak ?? 0,
                'longest' => $streak?->longest_streak ?? 0,
                'freezes_available' => (int) $user->streak_freezes,
                'week_strip' => $weekStrip,
            ],
            'stats' => [
                'level' => (int) $user->current_level,
                'current_level' => (int) $user->current_level,
                'total_xp' => (int) $user->total_xp,
                'coins' => (int) $user->coins,
                'rank_weekly' => $rank['weekly'],
                'rank_all_time' => $rank['allTime'],
            ],
            'onboarding_checklist' => $checklist,
            'recent_achievements' => $recentAchievements,
            'courses' => $courses,
            'needs_practice' => [], // Populated when diagnostic data available
        ]);
    }

    protected function findResumeTarget(User $user): ?array
    {
        $firstCourse = Course::published()->ordered()->first();
        if (!$firstCourse) {
            return null;
        }

        $allLessons = Lesson::whereHas('chapter.courseLevel.course', function ($q) use ($firstCourse) {
            $q->where('id', $firstCourse->id);
        })
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->with(['chapter.courseLevel'])
            ->get();

        $completedIds = UserProgress::where('user_id', $user->id)
            ->where('status', 'completed')
            ->pluck('lesson_id')
            ->toArray();

        // First lesson not yet completed
        $nextLesson = $allLessons->first(fn($l) => !in_array($l->id, $completedIds));
        if (!$nextLesson) {
            return null;
        }

        $chapter = $nextLesson->chapter;
        $chapterLessons = $allLessons->where('chapter_id', $chapter->id);
        $totalInChapter = $chapterLessons->count();
        $completedInChapter = $chapterLessons->filter(fn($l) => in_array($l->id, $completedIds))->count();
        $remainingInChapter = max(0, $totalInChapter - $completedInChapter);

        return [
            'lesson_id' => $nextLesson->id,
            'lesson_title' => $nextLesson->title,
            'lesson_type' => $nextLesson->type,
            'chapter_id' => $chapter->id,
            'chapter_title' => $chapter->title,
            'course_slug' => $firstCourse->slug,
            'course_title' => $firstCourse->title,
            'remaining_in_chapter' => $remainingInChapter,
            'chapter_progress_percent' => $totalInChapter > 0 ? (int) round(($completedInChapter / $totalInChapter) * 100) : 0,
        ];
    }

    protected function getOnboardingChecklist(User $user): ?array
    {
        $hasLesson = UserProgress::where('user_id', $user->id)->where('status', 'completed')->exists();
        $hasPractice = UserProgress::where('user_id', $user->id)
            ->whereHas('lesson', fn($q) => $q->where('type', 'practice'))
            ->where('status', 'completed')
            ->exists();
        $hasDebug = UserProgress::where('user_id', $user->id)
            ->whereHas('lesson', fn($q) => $q->where('type', 'debug'))
            ->where('status', 'completed')
            ->exists();
        $hasReview = UserProgress::where('user_id', $user->id)
            ->whereHas('lesson', fn($q) => $q->whereIn('type', ['chapter_review', 'level_review']))
            ->where('status', 'completed')
            ->exists();
        $hasStreak = ($user->streak?->current_streak ?? 0) >= 1;

        $items = [
            ['id' => 'account', 'title' => 'Akun dibuat', 'completed' => true],
            ['id' => 'first_lesson', 'title' => 'Selesaikan materi teori pertama', 'completed' => $hasLesson],
            ['id' => 'first_practice', 'title' => 'Selesaikan latihan kode pertama', 'completed' => $hasPractice],
            ['id' => 'first_debug', 'title' => 'Temukan dan perbaiki bug pertama', 'completed' => $hasDebug],
            ['id' => 'first_review', 'title' => 'Lulus ujian review bab', 'completed' => $hasReview],
            ['id' => 'first_streak', 'title' => 'Mulai rekor streak hari pertama', 'completed' => $hasStreak],
        ];

        $allDone = collect($items)->every(fn($i) => $i['completed']);
        return $allDone ? null : $items;
    }
}
