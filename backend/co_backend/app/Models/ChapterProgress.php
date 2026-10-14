<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChapterProgress extends Model
{
    protected $table = 'chapter_progress';

    protected $fillable = [
        'user_id',
        'chapter_id',
        'mastery_percentage',
        'theory_score',
        'coding_score',
        'debugging_score',
        'problem_solving_score',
        'status',
        'completed_at',
    ];

    protected $casts = [
        'mastery_percentage' => 'integer',
        'theory_score' => 'integer',
        'coding_score' => 'integer',
        'debugging_score' => 'integer',
        'problem_solving_score' => 'integer',
        'completed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function chapter(): BelongsTo
    {
        return $this->belongsTo(Chapter::class);
    }
}
