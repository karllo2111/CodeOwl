<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Achievement extends Model
{
    protected $fillable = [
        'slug',
        'title',
        'description',
        'icon',
        'category',
        'condition_type',
        'condition_value',
        'xp_reward',
        'is_active',
        'reward_cosmetic_id',
    ];

    protected $casts = [
        'condition_value' => 'integer',
        'xp_reward' => 'integer',
        'is_active' => 'boolean',
        'reward_cosmetic_id' => 'integer',
    ];

    public function rewardCosmetic(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(CosmeticItem::class, 'reward_cosmetic_id');
    }

    public function userAchievements(): HasMany
    {
        return $this->hasMany(UserAchievement::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_achievements')
            ->withPivot('earned_at')
            ->withTimestamps();
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
