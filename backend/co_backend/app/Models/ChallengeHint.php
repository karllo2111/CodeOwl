<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChallengeHint extends Model
{
    protected $fillable = [
        'activity_id',
        'hint_type',
        'content',
        'xp_penalty',
        'sort_order',
    ];

    protected $casts = [
        'xp_penalty' => 'integer',
        'sort_order' => 'integer',
    ];

    public function activity(): BelongsTo
    {
        return $this->belongsTo(Activity::class);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }
}
