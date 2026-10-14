<?php

namespace App\Services;

use App\Models\User;
use App\Models\XpTransaction;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class RankService
{
    /**
     * Get user rank (weekly and allTime).
     * If user has no XP in the respective window, returns null.
     */
    public function getUserRank(User $user): array
    {
        $cacheKey = "user_rank_{$user->id}";

        return Cache::remember($cacheKey, 300, function () use ($user) {
            return [
                'weekly' => $this->getWeeklyRank($user),
                'allTime' => $this->getAllTimeRank($user),
            ];
        });
    }

    /**
     * Compute weekly rank position and total participant count.
     */
    protected function getWeeklyRank(User $user): ?array
    {
        $startOfWeek = Carbon::now()->startOfWeek(Carbon::MONDAY);

        // Calculate weekly XP for this user
        $userWeeklyXp = (int) XpTransaction::where('user_id', $user->id)
            ->where('created_at', '>=', $startOfWeek)
            ->sum('amount');

        if ($userWeeklyXp <= 0) {
            return null; // Unranked
        }

        // Subquery of all users with weekly XP > 0
        $weeklySums = DB::table('xp_transactions')
            ->select('user_id', DB::raw('SUM(amount) as total_amount'))
            ->where('created_at', '>=', $startOfWeek)
            ->groupBy('user_id');

        // Total count of ranked users
        $totalRanked = DB::table($weeklySums, 'w')->count();

        // Count users with higher weekly XP, or same weekly XP and earlier user id
        $higherCount = DB::table($weeklySums, 'w')
            ->where(function ($query) use ($userWeeklyXp, $user) {
                $query->where('w.total_amount', '>', $userWeeklyXp)
                    ->orWhere(function ($q) use ($userWeeklyXp, $user) {
                        $q->where('w.total_amount', '=', $userWeeklyXp)
                            ->where('w.user_id', '<', $user->id);
                    });
            })
            ->count();

        return [
            'position' => $higherCount + 1,
            'of' => $totalRanked,
            'xp' => $userWeeklyXp,
        ];
    }

    /**
     * Compute all-time rank position and total participant count.
     */
    protected function getAllTimeRank(User $user): ?array
    {
        if ($user->total_xp <= 0) {
            return null; // Unranked
        }

        $totalRanked = User::where('total_xp', '>', 0)->count();

        $higherCount = User::where('total_xp', '>', $user->total_xp)
            ->orWhere(function ($query) use ($user) {
                $query->where('total_xp', '=', $user->total_xp)
                    ->where('id', '<', $user->id);
            })
            ->count();

        return [
            'position' => $higherCount + 1,
            'of' => $totalRanked,
            'xp' => $user->total_xp,
        ];
    }
}
