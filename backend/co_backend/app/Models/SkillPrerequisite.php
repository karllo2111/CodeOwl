<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SkillPrerequisite extends Model
{
    protected $fillable = [
        'skill_id',
        'prerequisite_skill_id',
    ];

    public function skill(): BelongsTo
    {
        return $this->belongsTo(Skill::class, 'skill_id');
    }

    public function prerequisiteSkill(): BelongsTo
    {
        return $this->belongsTo(Skill::class, 'prerequisite_skill_id');
    }
}
