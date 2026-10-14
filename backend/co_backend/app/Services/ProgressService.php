<?php

namespace App\Services;

use App\Models\Chapter;
use App\Models\ChapterProgress;
use App\Models\Lesson;
use App\Models\User;
use App\Models\UserProgress;

class ProgressService
{
    /**
     * Mark a lesson as completed for the user and recalculate chapter mastery.
     */
    public function completeLesson(User $user, Lesson $lesson, ?int $score = 100): UserProgress
    {
        $progress = UserProgress::updateOrCreate(
            [
                'user_id' => $user->id,
                'lesson_id' => $lesson->id,
            ],
            [
                'status' => 'completed',
                'score' => $score ?? 100,
                'completed_at' => now(),
            ]
        );

        if ($lesson->chapter) {
            $this->calculateChapterMastery($user, $lesson->chapter);
        }

        return $progress;
    }

    /**
     * Calculate and persist mastery status for a chapter.
     */
    public function calculateChapterMastery(User $user, Chapter $chapter): ChapterProgress
    {
        $lessons = $chapter->lessons()->where('is_published', true)->get();
        $totalLessons = $lessons->count();

        if ($totalLessons === 0) {
            return ChapterProgress::updateOrCreate(
                ['user_id' => $user->id, 'chapter_id' => $chapter->id],
                [
                    'mastery_percentage' => 100,
                    'status' => 'mastered',
                    'completed_at' => now(),
                ]
            );
        }

        $completedCount = UserProgress::where('user_id', $user->id)
            ->whereIn('lesson_id', $lessons->pluck('id'))
            ->where('status', 'completed')
            ->count();

        $percentage = (int) round(($completedCount / $totalLessons) * 100);
        $threshold = $chapter->mastery_threshold ?? 80;
        $isMastered = $percentage >= $threshold;

        return ChapterProgress::updateOrCreate(
            ['user_id' => $user->id, 'chapter_id' => $chapter->id],
            [
                'mastery_percentage' => $percentage,
                'status' => $isMastered ? 'mastered' : ($percentage > 0 ? 'in_progress' : 'unstarted'),
                'completed_at' => $isMastered ? now() : null,
            ]
        );
    }

    /**
     * Check if a chapter is mastered by user.
     */
    public function isChapterMastered(User $user, Chapter $chapter): bool
    {
        $progress = ChapterProgress::where('user_id', $user->id)
            ->where('chapter_id', $chapter->id)
            ->first();

        if ($progress && $progress->status === 'mastered') {
            return true;
        }

        $fresh = $this->calculateChapterMastery($user, $chapter);
        return $fresh->status === 'mastered';
    }
}
