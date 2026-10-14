<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Track extends Model
{
    protected $fillable = ['key', 'name', 'sort', 'glyph'];

    public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }
}
