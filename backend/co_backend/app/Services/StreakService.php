<?php

namespace App\Services;

use App\Models\Streak;
use App\Models\User;
use App\Models\XpTransaction;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class StreakService
{
    /**
     * Record qualifying activity for a user (e.g. completed lesson or passed submission).
     */
    public function recordActivity(User $user, ?Carbon $date = null): Streak
    {
        $today = $date ? $date->copy() : Carbon::now();
        $todayStr = $today->toDateString();

        return DB::transaction(function () use ($user, $today, $todayStr) {
            /** @var Streak $streak */
            $streak = Streak::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'current_streak' => 0,
                    'longest_streak' => 0,
                    'last_activity_date' => null,
                    'streak_data' => [],
                ]
            );

            $lastDate = $streak->last_activity_date ? Carbon::parse($streak->last_activity_date) : null;
            $history = is_array($streak->streak_data) ? $streak->streak_data : [];

            // If already recorded today
            if ($lastDate && $lastDate->isSameDay($today)) {
                return $streak;
            }

            if (!$lastDate) {
                // First ever activity
                $streak->current_streak = 1;
                $history[$todayStr] = 'done';
            } else {
                $daysDiff = (int) $lastDate->copy()->startOfDay()->diffInDays($today->copy()->startOfDay(), false);

                if ($daysDiff === 1) {
                    // Consecutive day
                    $streak->current_streak += 1;
                    $history[$todayStr] = 'done';
                } elseif ($daysDiff === 2) {
                    // Missed exactly 1 day
                    $yesterdayStr = $today->copy()->subDay()->toDateString();
                    if ($user->streak_freezes > 0) {
                        // Consume 1 freeze
                        $user->decrement('streak_freezes');
                        $history[$yesterdayStr] = 'freeze_used';
                        $history[$todayStr] = 'done';
                        $streak->current_streak += 1;
                    } else {
                        // Reset
                        $history[$yesterdayStr] = 'missed';
                        $history[$todayStr] = 'done';
                        $streak->current_streak = 1;
                    }
                } else {
                    // Missed more than 1 day
                    $history[$todayStr] = 'done';
                    $streak->current_streak = 1;
                }
            }

            if ($streak->current_streak > $streak->longest_streak) {
                $streak->longest_streak = $streak->current_streak;
            }

            $streak->last_activity_date = $todayStr;
            $streak->streak_data = $history;
            $streak->save();

            // Freeze award: 1 freeze per 7 consecutive days (max 2 held)
            if ($streak->current_streak > 0 && $streak->current_streak % 7 === 0) {
                if ($user->streak_freezes < 2) {
                    $user->increment('streak_freezes');
                }
            }

            // Milestone XP bonuses (3, 7, 14, 30 days)
            $this->checkMilestones($user, $streak->current_streak);

            return $streak;
        });
    }

    /**
     * Award idempotent milestone bonuses for streak achievements.
     */
    protected function checkMilestones(User $user, int $currentStreak): void
    {
        $milestones = [
            3 => 30,
            7 => 70,
            14 => 150,
            30 => 350,
        ];

        if (isset($milestones[$currentStreak])) {
            $bonus = $milestones[$currentStreak];
            $exists = XpTransaction::where('user_id', $user->id)
                ->where('source_type', 'streak_milestone')
                ->where('source_id', $currentStreak)
                ->exists();

            if (!$exists) {
                XpTransaction::create([
                    'user_id' => $user->id,
                    'amount' => $bonus,
                    'source_type' => 'streak_milestone',
                    'source_id' => $currentStreak,
                    'metadata' => ['streak_days' => $currentStreak, 'reason' => "Streak milestone: {$currentStreak} hari berturut-turut"],
                ]);
                $user->increment('total_xp', $bonus);
            }
        }
    }

    /**
     * Get Monday-Sunday strip for the current week.
     * Distinct states: 'done', 'freeze_used', 'missed', 'upcoming'. Plus 'is_today'.
     */
    public function getWeekStrip(User $user, ?Carbon $date = null): array
    {
        $now = $date ? $date->copy() : Carbon::now();
        $todayStr = $now->toDateString();
        $startOfWeek = $now->copy()->startOfWeek(Carbon::MONDAY);

        $streak = $user->streak;
        $history = ($streak && is_array($streak->streak_data)) ? $streak->streak_data : [];

        $strip = [];
        for ($i = 0; $i < 7; $i++) {
            $day = $startOfWeek->copy()->addDays($i);
            $dayStr = $day->toDateString();
            $isToday = $day->isSameDay($now);
            $isPast = $day->isBefore($now, true) && !$isToday;
            $isFuture = $day->isAfter($now, true);

            $dayLabel = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'][$i];

            if (isset($history[$dayStr])) {
                $state = $history[$dayStr] === 'freeze_used' ? 'freeze_used' : 'done';
            } elseif ($isPast) {
                $state = 'missed';
            } elseif ($isToday) {
                $state = isset($history[$dayStr]) ? 'done' : 'upcoming';
            } else {
                $state = 'upcoming';
            }

            $strip[] = [
                'day' => $dayLabel,
                'date' => $dayStr,
                'state' => $state,
                'is_today' => $isToday,
            ];
        }

        return $strip;
    }
}
