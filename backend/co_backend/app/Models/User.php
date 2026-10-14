<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable([
    'name',
    'email',
    'password',
    'username',
    'avatar',
    'bio',
    'total_xp',
    'current_level',
    'coins',
    'streak_freezes',
    'theme',
    'last_track_id',
    'sidebar_collapsed',
    'equipped_frame_id',
    'equipped_title_id',
    'equipped_accent_id',
    'leaderboard_opt_out',
])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'total_xp' => 'integer',
            'current_level' => 'integer',
            'coins' => 'integer',
            'streak_freezes' => 'integer',
            'sidebar_collapsed' => 'boolean',
            'leaderboard_opt_out' => 'boolean',
        ];
    }

    public function userProgress(): HasMany
    {
        return $this->hasMany(UserProgress::class);
    }

    public function progress(): HasMany
    {
        return $this->hasMany(UserProgress::class);
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(ChallengeSubmission::class);
    }

    public function chapterProgress(): HasMany
    {
        return $this->hasMany(ChapterProgress::class);
    }

    public function levelProgress(): HasMany
    {
        return $this->hasMany(LevelProgress::class);
    }

    public function xpTransactions(): HasMany
    {
        return $this->hasMany(XpTransaction::class);
    }

    public function streak(): HasOne
    {
        return $this->hasOne(Streak::class);
    }

    public function levelDefinition(): BelongsTo
    {
        return $this->belongsTo(LevelDefinition::class, 'current_level', 'level');
    }

    public function achievements(): BelongsToMany
    {
        return $this->belongsToMany(Achievement::class, 'user_achievements')
            ->withPivot('earned_at');
    }

    public function userCosmetics(): HasMany
    {
        return $this->hasMany(UserCosmetic::class);
    }

    public function cosmetics(): BelongsToMany
    {
        return $this->belongsToMany(CosmeticItem::class, 'user_cosmetics')
            ->withPivot('acquired_at')
            ->withTimestamps();
    }

    public function equippedFrame(): BelongsTo
    {
        return $this->belongsTo(CosmeticItem::class, 'equipped_frame_id');
    }

    public function equippedTitle(): BelongsTo
    {
        return $this->belongsTo(CosmeticItem::class, 'equipped_title_id');
    }

    public function equippedAccent(): BelongsTo
    {
        return $this->belongsTo(CosmeticItem::class, 'equipped_accent_id');
    }

    public function coinTransactions(): HasMany
    {
        return $this->hasMany(CoinTransaction::class);
    }

    public function drafts(): HasMany
    {
        return $this->hasMany(ActivityDraft::class);
    }

    public function chestOpenings(): HasMany
    {
        return $this->hasMany(ChestOpening::class);
    }

    public function lastTrack(): BelongsTo
    {
        return $this->belongsTo(Track::class, 'last_track_id');
    }
}
