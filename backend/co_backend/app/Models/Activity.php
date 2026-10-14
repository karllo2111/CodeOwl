<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Activity extends Model
{
    protected $fillable = [
        'lesson_id',
        'instructions',
        'starter_code',
        'solution_code',
        'language',
        'time_limit_seconds',
        'max_attempts',
        'xp_reward',
        'xp_penalty_per_hint',
        'in_practice_bank',
    ];

    protected $casts = [
        'time_limit_seconds' => 'integer',
        'max_attempts' => 'integer',
        'xp_reward' => 'integer',
        'xp_penalty_per_hint' => 'integer',
        'in_practice_bank' => 'boolean',
    ];

    public function drafts(): HasMany
    {
        return $this->hasMany(ActivityDraft::class);
    }

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    public function challengeTests(): HasMany
    {
        return $this->hasMany(ChallengeTest::class);
    }

    public function challengeHints(): HasMany
    {
        return $this->hasMany(ChallengeHint::class);
    }

    public function challengeSubmissions(): HasMany
    {
        return $this->hasMany(ChallengeSubmission::class);
    }
}
