<?php

namespace App\Services;

use App\Models\User;
use App\Models\XpTransaction;

class XpService
{
    public function awardXp(User $user, string $sourceType, int $sourceId, int $amount, ?array $metadata = null): ?XpTransaction
    {
        if ($amount <= 0) return null;

        $exists = XpTransaction::where([
            'user_id' => $user->id,
            'source_type' => $sourceType,
            'source_id' => $sourceId,
        ])->exists();

        if ($exists) {
            return null; // Already awarded
        }

        $transaction = XpTransaction::create([
            'user_id' => $user->id,
            'source_type' => $sourceType,
            'source_id' => $sourceId,
            'amount' => $amount,
            'metadata' => $metadata
        ]);

        $user->increment('total_xp', $amount);
        $this->checkLevelUp($user);

        return $transaction;
    }

    protected function checkLevelUp(User $user)
    {
        // Simple level logic, depends on LevelDefinition logic
        $currentXp = $user->total_xp;
        $newLevel = \App\Models\LevelDefinition::where('xp_required', '<=', $currentXp)
            ->orderByDesc('xp_required')
            ->first();

        if ($newLevel && $user->level_id !== $newLevel->id) {
            $user->update(['level_id' => $newLevel->id]);
        }
    }
}
