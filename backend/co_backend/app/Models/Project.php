<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Project extends Model
{
    use HasSlug;

    protected $fillable = [
        'course_id',
        'title',
        'slug',
        'description',
        'difficulty',
        'xp_reward',
        'is_published',
    ];

    protected $casts = [
        'xp_reward' => 'integer',
        'is_published' => 'boolean',
    ];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug');
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function projectRequirements(): HasMany
    {
        return $this->hasMany(ProjectRequirement::class);
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }
}
