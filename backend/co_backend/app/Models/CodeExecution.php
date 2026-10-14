<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CodeExecution extends Model
{
    protected $fillable = [
        'user_id',
        'submission_id',
        'language',
        'code',
        'output',
        'error_output',
        'exit_code',
        'execution_time_ms',
        'memory_used_kb',
        'status',
    ];

    protected $casts = [
        'exit_code' => 'integer',
        'execution_time_ms' => 'integer',
        'memory_used_kb' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function challengeSubmission(): BelongsTo
    {
        return $this->belongsTo(ChallengeSubmission::class, 'submission_id');
    }
}
