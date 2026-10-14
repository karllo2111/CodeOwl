<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Chapter extends Model
{
    protected $fillable = [
        'course_level_id',
        'title',
        'slug',
        'description',
        'sort_order',
        'mastery_threshold',
        'is_published',
        'icon',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'mastery_threshold' => 'integer',
        'is_published' => 'boolean',
    ];

    public function courseLevel(): BelongsTo
    {
        return $this->belongsTo(CourseLevel::class);
    }

    public function lessons(): HasMany
    {
        return $this->hasMany(Lesson::class);
    }

    public function chestOpenings(): HasMany
    {
        return $this->hasMany(ChestOpening::class);
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }
}
