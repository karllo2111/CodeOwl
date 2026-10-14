<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserCosmetic extends Model
{
    protected $fillable = [
        'user_id',
        'cosmetic_item_id',
        'acquired_at',
    ];

    protected function casts(): array
    {
        return [
            'acquired_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function cosmeticItem(): BelongsTo
    {
        return $this->belongsTo(CosmeticItem::class);
    }
}
