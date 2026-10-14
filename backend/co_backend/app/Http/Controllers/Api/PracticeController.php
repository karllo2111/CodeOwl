<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\PracticeKind;
use App\Models\Track;
use App\Models\User;
use App\Models\UserProgress;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PracticeController extends Controller
{
    /**
     * Get enabled practice kinds that have available items for the track.
     */
    public function kinds(Request $request): JsonResponse
    {
        $trackKey = $request->query('track');
        $track = $trackKey ? Track::where('key', $trackKey)->first() : null;

        $query = PracticeKind::where('enabled', true)->orderBy('sort');
        $kinds = $query->get();

        // Calculate count of available items for each kind
        $result = $kinds->map(function (PracticeKind $pk) use ($track, $request) {
            $user = $request->user();

            $actQuery = Activity::whereHas('lesson', function ($q) use ($pk, $track) {
                $q->where('type', $pk->kind)->where('is_published', true);
                if ($track) {
                    $q->whereHas('chapter.courseLevel.course', fn($cq) => $cq->where('track_id', $track->id));
                }
            })->orWhere(function ($q) use ($pk) {
                $q->where('in_practice_bank', true);
            });

            $totalCount = $actQuery->count();

            $solvedCount = 0;
            if ($user) {
                $solvedCount = UserProgress::where('user_id', $user->id)
                    ->where('status', 'completed')
                    ->whereHas('lesson', fn($q) => $q->where('type', $pk->kind))
                    ->count();
            }

            return [
                'id' => $pk->id,
                'kind' => $pk->kind,
                'label' => $pk->label,
                'description' => $pk->description,
                'total_available' => $totalCount,
                'solved_count' => $solvedCount,
            ];
        })->filter(fn($k) => $k['total_available'] > 0)->values();

        return response()->json([
            'kinds' => $result,
        ]);
    }

    /**
     * Filterable table of practice activities.
     */
    public function list(Request $request, string $kind): JsonResponse
    {
        /** @var User|null $user */
        $user = $request->user();

        $trackKey = $request->query('track');
        $difficulty = $request->query('difficulty');
        $status = $request->query('status'); // unsolved, in_progress, solved
        $search = $request->query('q');

        $track = $trackKey ? Track::where('key', $trackKey)->first() : null;

        $query = Activity::with(['lesson.chapter.courseLevel.course'])
            ->where(function ($base) use ($kind, $track) {
                $base->whereHas('lesson', function ($q) use ($kind, $track) {
                    $q->where('type', $kind)->where('is_published', true);
                    if ($track) {
                        $q->whereHas('chapter.courseLevel.course', fn($cq) => $cq->where('track_id', $track->id));
                    }
                })->orWhere(function ($q) {
                    $q->where('in_practice_bank', true);
                });
            });

        if ($difficulty) {
            $query->whereHas('lesson', fn($q) => $q->where('difficulty', $difficulty));
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('instructions', 'like', "%{$search}%")
                    ->orWhereHas('lesson', fn($lq) => $lq->where('title', 'like', "%{$search}%"));
            });
        }

        $items = $query->paginate(15);

        // Map status for current user
        $completedLessonIds = $user ? UserProgress::where('user_id', $user->id)
            ->where('status', 'completed')
            ->pluck('lesson_id')
            ->toArray() : [];

        $mappedItems = $items->getCollection()->map(function (Activity $act) use ($completedLessonIds) {
            $isSolved = in_array($act->lesson_id, $completedLessonIds);

            return [
                'id' => $act->id,
                'lesson_id' => $act->lesson_id,
                'title' => $act->lesson?->title ?? "Latihan #{$act->id}",
                'difficulty' => $act->lesson?->difficulty ?? 'easy',
                'chapter_title' => $act->lesson?->chapter?->title ?? 'Umum',
                'xp_reward' => $isSolved ? 0 : ($act->xp_reward ?? 50),
                'status' => $isSolved ? 'solved' : 'unsolved',
                'language' => $act->language ?? 'javascript',
            ];
        });

        // Filter by status if requested
        if ($status && in_array($status, ['solved', 'unsolved'])) {
            $mappedItems = $mappedItems->filter(fn($item) => $item['status'] === $status)->values();
        }

        return response()->json([
            'data' => $mappedItems,
            'current_page' => $items->currentPage(),
            'last_page' => $items->lastPage(),
            'total' => $items->total(),
        ]);
    }
}
