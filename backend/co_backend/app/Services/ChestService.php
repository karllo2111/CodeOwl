<?php

namespace App\Services;

use App\Models\Chapter;
use App\Models\ChestOpening;
use App\Models\CosmeticItem;
use App\Models\User;
use App\Models\UserCosmetic;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class ChestService
{
    public function __construct(
        protected ProgressService $progressService,
        protected CoinService $coinService
    ) {}

    /**
     * Open a mystery chest for a chapter.
     * Idempotent: if already opened, returns existing record.
     */
    public function openChest(User $user, Chapter $chapter): array
    {
        // 1. Check if already opened (Idempotent)
        $existing = ChestOpening::with('cosmeticItem')
            ->where('user_id', $user->id)
            ->where('chapter_id', $chapter->id)
            ->first();

        if ($existing) {
            return [
                'already_opened' => true,
                'coins' => $existing->coins,
                'cosmetic' => $existing->cosmeticItem,
                'opened_at' => $existing->opened_at,
            ];
        }

        // 2. Must be mastered
        if (!$this->progressService->isChapterMastered($user, $chapter)) {
            throw new InvalidArgumentException("Peti hadiah hanya dapat dibuka setelah menyelesaikan Bab dengan tingkat penguasaan minimal 80%.");
        }

        return DB::transaction(function () use ($user, $chapter) {
            // Re-check inside transaction with lock
            $existing = ChestOpening::where('user_id', $user->id)
                ->where('chapter_id', $chapter->id)
                ->lockForUpdate()
                ->first();

            if ($existing) {
                return [
                    'already_opened' => true,
                    'coins' => $existing->coins,
                    'cosmetic' => $existing->cosmeticItem,
                    'opened_at' => $existing->opened_at,
                ];
            }

            // Random coins within [40, 100]
            $coinsAwarded = random_int(40, 100);

            // 10% chance to award an unowned cosmetic from 'chest' pool
            $cosmeticAwarded = null;
            $roll = random_int(1, 100);
            if ($roll <= 10) {
                $ownedIds = UserCosmetic::where('user_id', $user->id)->pluck('cosmetic_item_id');
                $cosmeticAwarded = CosmeticItem::where('unlock_type', 'chest')
                    ->where('is_active', true)
                    ->whereNotIn('id', $ownedIds)
                    ->inRandomOrder()
                    ->first();

                if ($cosmeticAwarded) {
                    UserCosmetic::create([
                        'user_id' => $user->id,
                        'cosmetic_item_id' => $cosmeticAwarded->id,
                        'acquired_at' => now(),
                    ]);
                }
            }

            // Create record
            $opening = ChestOpening::create([
                'user_id' => $user->id,
                'chapter_id' => $chapter->id,
                'coins' => $coinsAwarded,
                'cosmetic_item_id' => $cosmeticAwarded?->id,
                'opened_at' => now(),
            ]);

            // Add coins via CoinService
            $this->coinService->addCoins(
                $user,
                $coinsAwarded,
                "Membuka Peti Bab: {$chapter->title}",
                'chest_opening',
                $opening->id
            );

            return [
                'already_opened' => false,
                'coins' => $coinsAwarded,
                'cosmetic' => $cosmeticAwarded,
                'opened_at' => $opening->opened_at,
            ];
        });
    }
}
