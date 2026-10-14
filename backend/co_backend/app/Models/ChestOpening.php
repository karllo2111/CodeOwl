<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChestOpening extends Model
{
    protected $fillable = [
        'user_id',
        'chapter_id',
        'coins',
        'cosmetic_item_id',
        'opened_at',
    ];

    protected function casts(): array
    {
        return [
            'coins' => 'integer',
            'opened_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function chapter(): BelongsTo
    {
        return $this->belongsTo(Chapter::class);
    }

    public function cosmeticItem(): BelongsTo
    {
        return $this->belongsTo(CosmeticItem::class);
    }
}
