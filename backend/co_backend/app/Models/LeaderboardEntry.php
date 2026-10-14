<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeaderboardEntry extends Model
{
    protected $fillable = [
        'user_id',
        'period',
        'period_start',
        'xp_earned',
        'challenges_completed',
        'streak_days',
    ];

    protected $casts = [
        'period_start' => 'date',
        'xp_earned' => 'integer',
        'challenges_completed' => 'integer',
        'streak_days' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeForPeriod($query, string $period)
    {
        return $query->where('period', $period);
    }

    public function scopeCurrentWeek($query)
    {
        return $query->where('period', 'weekly')
            ->where('period_start', now()->startOfWeek()->toDateString());
    }

    public function scopeCurrentMonth($query)
    {
        return $query->where('period', 'monthly')
            ->where('period_start', now()->startOfMonth()->toDateString());
    }
}
