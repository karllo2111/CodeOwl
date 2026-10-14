<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ChallengeSubmission extends Model
{
    protected $fillable = [
        'user_id',
        'activity_id',
        'submitted_code',
        'language',
        'status',
        'tests_passed',
        'tests_total',
        'execution_time_ms',
        'memory_used_kb',
        'output',
        'error_output',
    ];

    protected $casts = [
        'tests_passed' => 'integer',
        'tests_total' => 'integer',
        'execution_time_ms' => 'integer',
        'memory_used_kb' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function activity(): BelongsTo
    {
        return $this->belongsTo(Activity::class);
    }

    public function codeExecution(): HasOne
    {
        return $this->hasOne(CodeExecution::class, 'submission_id');
    }
}
