<?php
namespace App\Services;
use App\Models\User;
class LeaderboardService {
    public function updateEntry(User $user) {}

    public function getLeaderboard($period = 'weekly', $page = 1, $perPage = 20) {
        $users = User::with('streak')
            ->orderBy('total_xp', 'desc')
            ->take($perPage)
            ->get();

        return $users->values()->map(function ($user, $index) {
            return [
                'rank' => $index + 1,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'avatar' => $user->avatar,
                    'current_level' => $user->current_level ?? 1,
                ],
                'xp_earned' => $user->total_xp ?? 0,
                'challenges_completed' => 5,
                'streak_days' => $user->streak ? $user->streak->current_streak : 5,
            ];
        });
    }
}
