<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CosmeticItem extends Model
{
    protected $fillable = [
        'name',
        'slot',
        'rarity',
        'price_coins',
        'unlock_type',
        'unlock_ref',
        'data',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price_coins' => 'integer',
            'data' => 'array',
            'is_active' => 'boolean',
        ];
    }

    public function userCosmetics(): HasMany
    {
        return $this->hasMany(UserCosmetic::class);
    }
}
