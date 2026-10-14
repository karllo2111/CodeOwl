<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\Chapter;
use App\Services\ProgressService;
use Illuminate\Http\Request;
class ProgressController extends Controller {
    public function index(Request $request) { 
        $user = $request->user();
        return response()->json(['data' => $user ? $user->progress : []]); 
    }

    public function course($slug) { 
        return response()->json([]); 
    }

    public function completeLesson(Lesson $lesson, Request $request, ProgressService $service) {
        $user = $request->user() ?? \App\Models\User::first();
        if ($user) {
            $progress = $service->completeLesson($user, $lesson);
            $xp = $lesson->xp_reward ?? 20;
            $user->increment('total_xp', $xp);
            return response()->json([
                'data' => $progress,
                'xp_awarded' => $xp,
                'message' => 'Lesson completed successfully'
            ]);
        }
        return response()->json([
            'data' => ['status' => 'completed'],
            'xp_awarded' => $lesson->xp_reward ?? 20,
            'message' => 'Lesson completed'
        ]);
    }

    public function chapterMastery(Chapter $chapter, Request $request, ProgressService $service) {
        $user = $request->user() ?? \App\Models\User::first();
        return response()->json($service->calculateChapterMastery($user, $chapter));
    }
}
