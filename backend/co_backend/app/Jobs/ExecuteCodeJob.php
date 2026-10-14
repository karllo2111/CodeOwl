<?php
namespace App\Jobs;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\ChallengeSubmission;
use App\Services\TestEvaluationService;
use App\Services\ProgressService;
use App\Services\XpService;
use App\Services\AchievementService;
use App\Services\StreakService;
class ExecuteCodeJob implements ShouldQueue {
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    public function __construct(public ChallengeSubmission $submission) {}
    public function handle(TestEvaluationService $eval, ProgressService $prog, XpService $xp, AchievementService $achv, StreakService $streak) {
        $result = $eval->evaluate($this->submission->activity, $this->submission->submitted_code);
        $this->submission->update([
            'status' => $result['success'] ? 'passed' : 'failed',
            'tests_passed' => $result['tests_passed'],
            'tests_total' => $result['tests_total'],
            'output' => $result['output'],
            'error_output' => $result['error'],
        ]);
        if ($result['success']) {
            $prog->completeLesson($this->submission->user, $this->submission->activity->lesson);
            $xp->awardXp($this->submission->user, 'activity', $this->submission->activity->id, $this->submission->activity->xp_reward);
            $achv->checkAndAward($this->submission->user);
            $streak->recordActivity($this->submission->user);
        }
    }
}
