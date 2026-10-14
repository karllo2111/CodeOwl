<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Lesson extends Model
{
    protected $fillable = [
        'chapter_id',
        'title',
        'slug',
        'type',
        'sort_order',
        'xp_reward',
        'difficulty',
        'estimated_minutes',
        'is_published',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'xp_reward' => 'integer',
        'estimated_minutes' => 'integer',
        'is_published' => 'boolean',
    ];

    public function chapter(): BelongsTo
    {
        return $this->belongsTo(Chapter::class);
    }

    public function activity(): HasOne
    {
        return $this->hasOne(Activity::class);
    }

    public function lessonContents(): HasMany
    {
        return $this->hasMany(LessonContent::class);
    }

    public function contentBlocks(): HasMany
    {
        return $this->hasMany(LessonContent::class);
    }

    public function userProgress(): HasMany
    {
        return $this->hasMany(UserProgress::class);
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }

    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }
}
