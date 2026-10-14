<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PracticeKind extends Model
{
    protected $fillable = ['kind', 'label', 'description', 'sort', 'enabled'];

    protected function casts(): array
    {
        return [
            'enabled' => 'boolean',
            'sort' => 'integer',
        ];
    }
}
