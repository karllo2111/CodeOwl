<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class XpTransaction extends Model
{
    const UPDATED_AT = null;

    protected $fillable = [
        'user_id',
        'source_type',
        'source_id',
        'amount',
        'metadata',
    ];

    protected $casts = [
        'amount' => 'integer',
        'metadata' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeForSource($query, $type, $id = null)
    {
        $query = $query->where('source_type', $type);
        if ($id !== null) {
            $query->where('source_id', $id);
        }
        return $query;
    }
}
