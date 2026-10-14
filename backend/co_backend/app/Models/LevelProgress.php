<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LevelProgress extends Model
{
    protected $table = 'level_progress';

    protected $fillable = [
        'user_id',
        'course_level_id',
        'mastery_percentage',
        'status',
        'completed_at',
    ];

    protected $casts = [
        'mastery_percentage' => 'integer',
        'completed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function courseLevel(): BelongsTo
    {
        return $this->belongsTo(CourseLevel::class);
    }
}
