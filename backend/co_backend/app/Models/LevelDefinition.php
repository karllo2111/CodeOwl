<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LevelDefinition extends Model
{
    protected $fillable = [
        'level',
        'title',
        'min_xp',
        'icon',
    ];

    protected $casts = [
        'level' => 'integer',
        'min_xp' => 'integer',
    ];

    public static function forXp(int $xp): self
    {
        return self::where('min_xp', '<=', $xp)
            ->orderByDesc('level')
            ->first() ?? self::first();
    }
}
