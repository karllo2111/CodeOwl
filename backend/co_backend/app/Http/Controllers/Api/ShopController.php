<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CosmeticItem;
use App\Models\User;
use App\Models\UserCosmetic;
use App\Services\CoinService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ShopController extends Controller
{
    public function __construct(
        protected CoinService $coinService
    ) {}

    /**
     * Get catalog items with current user state.
     */
    public function index(Request $request): JsonResponse
    {
        /** @var User|null $user */
        $user = $request->user();

        $ownedIds = $user ? UserCosmetic::where('user_id', $user->id)->pluck('cosmetic_item_id')->toArray() : [];
        $balance = $user ? (int) $user->coins : 0;
        $userFreezes = $user ? (int) $user->streak_freezes : 0;

        $items = CosmeticItem::where('is_active', true)->get()->map(function (CosmeticItem $item) use ($user, $ownedIds, $balance, $userFreezes) {
            $isOwned = in_array($item->id, $ownedIds);
            $isEquipped = false;

            if ($user) {
                if ($item->slot === 'frame' && $user->equipped_frame_id === $item->id) $isEquipped = true;
                if ($item->slot === 'title' && $user->equipped_title_id === $item->id) $isEquipped = true;
                if ($item->slot === 'accent' && $user->equipped_accent_id === $item->id) $isEquipped = true;
            }

            // Determine status
            $status = 'available';
            $lockReason = null;
            $coinsNeeded = 0;

            if ($item->slot === 'booster') {
                if ($userFreezes >= 2) {
                    $status = 'max_held';
                    $lockReason = 'Kapasitas maksimal tercapai (2/2 Tersimpan).';
                } elseif ($balance < ($item->price_coins ?? 0)) {
                    $status = 'cant_afford';
                    $coinsNeeded = ($item->price_coins ?? 0) - $balance;
                }
            } elseif ($isOwned) {
                $status = $isEquipped ? 'equipped' : 'owned';
            } elseif ($item->unlock_type !== 'shop') {
                $status = 'locked';
                $lockReason = $this->formatUnlockReason($item);
            } elseif ($balance < ($item->price_coins ?? 0)) {
                $status = 'cant_afford';
                $coinsNeeded = ($item->price_coins ?? 0) - $balance;
            }

            return [
                'id' => $item->id,
                'name' => $item->name,
                'slot' => $item->slot,
                'rarity' => $item->rarity,
                'price_coins' => $item->price_coins,
                'unlock_type' => $item->unlock_type,
                'unlock_ref' => $item->unlock_ref,
                'data' => $item->data,
                'status' => $status,
                'is_owned' => $isOwned,
                'is_equipped' => $isEquipped,
                'lock_reason' => $lockReason,
                'coins_needed' => $coinsNeeded,
            ];
        });

        return response()->json([
            'balance' => $balance,
            'items' => $items,
        ]);
    }

    /**
     * Purchase a cosmetic item or booster with row locking and idempotency.
     */
    public function purchase(Request $request, int $id): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $item = CosmeticItem::where('id', $id)->where('is_active', true)->firstOrFail();

        // 1. If not a shop item
        if ($item->unlock_type !== 'shop' && $item->slot !== 'booster') {
            return response()->json([
                'message' => 'Item ini tidak tersedia untuk dibeli di toko. Syarat: ' . $this->formatUnlockReason($item),
            ], 422);
        }

        $price = (int) $item->price_coins;

        return DB::transaction(function () use ($user, $item, $price) {
            /** @var User $lockedUser */
            $lockedUser = User::where('id', $user->id)->lockForUpdate()->firstOrFail();

            // Check booster specific rules
            if ($item->slot === 'booster') {
                if ($lockedUser->streak_freezes >= 2) {
                    return response()->json([
                        'message' => 'Anda sudah memiliki jumlah maksimal Streak Freeze (2/2).',
                    ], 422);
                }

                if ($lockedUser->coins < $price) {
                    return response()->json([
                        'message' => 'Saldo koin tidak mencukupi.',
                    ], 422);
                }

                // Deduct coins
                $this->coinService->spendCoins(
                    $lockedUser,
                    $price,
                    "Membeli Booster: {$item->name}",
                    'booster_purchase',
                    $item->id
                );

                $lockedUser->increment('streak_freezes');

                return response()->json([
                    'message' => 'Berhasil membeli Streak Freeze!',
                    'balance' => (int) $lockedUser->coins,
                    'streak_freezes' => (int) $lockedUser->streak_freezes,
                ]);
            }

            // Normal cosmetic item: check already owned
            $alreadyOwned = UserCosmetic::where('user_id', $lockedUser->id)
                ->where('cosmetic_item_id', $item->id)
                ->exists();

            if ($alreadyOwned) {
                return response()->json([
                    'message' => 'Item ini sudah Anda miliki.',
                ], 422);
            }

            if ($lockedUser->coins < $price) {
                return response()->json([
                    'message' => 'Saldo koin tidak mencukupi.',
                ], 422);
            }

            // Deduct coins
            $this->coinService->spendCoins(
                $lockedUser,
                $price,
                "Membeli Kosmetik: {$item->name}",
                'cosmetic_purchase',
                $item->id
            );

            // Add to user cosmetics
            UserCosmetic::create([
                'user_id' => $lockedUser->id,
                'cosmetic_item_id' => $item->id,
                'acquired_at' => now(),
            ]);

            return response()->json([
                'message' => "Berhasil membeli {$item->name}!",
                'balance' => (int) $lockedUser->coins,
                'item_id' => $item->id,
            ]);
        });
    }

    protected function formatUnlockReason(CosmeticItem $item): string
    {
        return match ($item->unlock_type) {
            'achievement' => "Dapatkan pencapaian: {$item->unlock_ref}",
            'level' => "Capai Level {$item->unlock_ref}",
            'chest' => "Ditemukan secara acak di Peti Hadiah Bab",
            default => "Persyaratan khusus",
        };
    }
}
