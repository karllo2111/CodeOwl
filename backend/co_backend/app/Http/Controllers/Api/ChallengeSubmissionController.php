<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Http\Requests\SubmitCodeRequest;
use App\Jobs\ExecuteCodeJob;
use App\Services\TestEvaluationService;
use App\Services\ProgressService;
use App\Services\XpService;
use App\Services\AchievementService;
use App\Services\StreakService;

class ChallengeSubmissionController extends Controller {
    public function submit(
        Activity $activity, 
        SubmitCodeRequest $request,
        TestEvaluationService $eval,
        ProgressService $prog,
        XpService $xp,
        AchievementService $achv,
        StreakService $streak
    ) {
        $user = $request->user() ?? \App\Models\User::first();
        $result = $eval->evaluate($activity, $request->code);

        $submission = \App\Models\ChallengeSubmission::create([
            'user_id' => $user ? $user->id : 1,
            'activity_id' => $activity->id,
            'submitted_code' => $request->code,
            'language' => $request->language ?? $activity->language ?? 'javascript',
            'status' => $result['success'] ? 'passed' : 'failed',
            'tests_passed' => $result['tests_passed'] ?? 0,
            'tests_total' => $result['tests_total'] ?? 0,
            'execution_time_ms' => $result['executionTimeMs'] ?? 0,
            'output' => $result['output'] ?? '',
            'error_output' => $result['error'] ?? null,
        ]);

        if ($result['success'] && $user) {
            $prog->completeLesson($user, $activity->lesson);
            $xp->awardXp($user, 'activity', $activity->id, $activity->xp_reward ?? 50);
            $achv->checkAndAward($user);
            $streak->recordActivity($user);
        }

        $resData = $submission->toArray();
        $resData['test_results'] = $result['test_results'] ?? [];

        return response()->json([
            'data' => $resData,
            'message' => 'Submission processed'
        ]);
    }
}
