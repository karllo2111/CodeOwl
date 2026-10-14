<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Streak;
use App\Models\UserProgress;
use App\Models\ChapterProgress;
use App\Models\LevelProgress;
use App\Models\UserAchievement;
use App\Models\UserCosmetic;
use App\Models\XpTransaction;
use App\Models\CoinTransaction;
use App\Models\ChestOpening;
use App\Models\ChallengeSubmission;
use App\Models\LeaderboardEntry;
use Illuminate\Support\Facades\DB;

class ResetUserProgress extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:reset-user-progress {user : Email or User ID to reset}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reset a user progress, XP, streak, and coins to honest zeros for testing';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $userIdOrEmail = $this->argument('user');

        $user = is_numeric($userIdOrEmail)
            ? User::find($userIdOrEmail)
            : User::where('email', $userIdOrEmail)->first();

        if (!$user) {
            $this->error("User not found: {$userIdOrEmail}");
            return Command::FAILURE;
        }

        $this->info("Resetting progress for user {$user->name} ({$user->email}, ID: {$user->id})...");

        DB::transaction(function () use ($user) {
            // 1. Reset user counters
            $user->update([
                'total_xp' => 0,
                'current_level' => 1,
                'coins' => 0,
                'streak_freezes' => 0,
                'equipped_frame_id' => null,
                'equipped_title_id' => null,
                'equipped_accent_id' => null,
            ]);

            // 2. Reset streak
            Streak::where('user_id', $user->id)->update([
                'current_streak' => 0,
                'longest_streak' => 0,
                'last_activity_date' => null,
                'streak_data' => null,
            ]);

            // 3. Delete progress records
            UserProgress::where('user_id', $user->id)->delete();
            ChapterProgress::where('user_id', $user->id)->delete();
            LevelProgress::where('user_id', $user->id)->delete();
            UserAchievement::where('user_id', $user->id)->delete();
            UserCosmetic::where('user_id', $user->id)->delete();
            XpTransaction::where('user_id', $user->id)->delete();
            CoinTransaction::where('user_id', $user->id)->delete();
            ChestOpening::where('user_id', $user->id)->delete();
            ChallengeSubmission::where('user_id', $user->id)->delete();
            LeaderboardEntry::where('user_id', $user->id)->delete();
        });

        $this->info("Successfully reset user {$user->email} progress to honest zeros.");
        return Command::SUCCESS;
    }
}
