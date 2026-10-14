<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CosmeticItem;
use App\Models\User;
use App\Models\UserCosmetic;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CosmeticController extends Controller
{
    /**
     * Get user inventory of owned cosmetics.
     */
    public function inventory(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $cosmetics = $user->cosmetics()->get()->map(function (CosmeticItem $item) use ($user) {
            $isEquipped = ($item->slot === 'frame' && $user->equipped_frame_id === $item->id)
                || ($item->slot === 'title' && $user->equipped_title_id === $item->id)
                || ($item->slot === 'accent' && $user->equipped_accent_id === $item->id);

            return [
                'id' => $item->id,
                'name' => $item->name,
                'slot' => $item->slot,
                'rarity' => $item->rarity,
                'data' => $item->data,
                'is_equipped' => $isEquipped,
                'acquired_at' => $item->pivot->acquired_at ?? null,
            ];
        });

        return response()->json([
            'items' => $cosmetics,
            'equipped' => [
                'frame' => $user->equippedFrame,
                'title' => $user->equippedTitle,
                'accent' => $user->equippedAccent,
            ],
        ]);
    }

    /**
     * Equip a cosmetic item.
     */
    public function equip(Request $request, int $id): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $item = CosmeticItem::findOrFail($id);

        // Verify user owns the item
        $owns = UserCosmetic::where('user_id', $user->id)
            ->where('cosmetic_item_id', $item->id)
            ->exists();

        if (!$owns) {
            return response()->json(['message' => 'Anda belum memiliki item ini.'], 403);
        }

        if ($item->slot === 'frame') {
            $user->equipped_frame_id = $item->id;
        } elseif ($item->slot === 'title') {
            $user->equipped_title_id = $item->id;
        } elseif ($item->slot === 'accent') {
            $user->equipped_accent_id = $item->id;
        } else {
            return response()->json(['message' => 'Slot tidak dapat dipasang.'], 422);
        }

        $user->save();

        return response()->json([
            'message' => "Berhasil memasang {$item->name}!",
            'equipped' => [
                'frame' => $user->fresh()->equippedFrame,
                'title' => $user->fresh()->equippedTitle,
                'accent' => $user->fresh()->equippedAccent,
            ],
        ]);
    }

    /**
     * Unequip a cosmetic item by id.
     */
    public function unequip(Request $request, int $id): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $item = CosmeticItem::findOrFail($id);

        if ($item->slot === 'frame' && $user->equipped_frame_id === $item->id) {
            $user->equipped_frame_id = null;
        } elseif ($item->slot === 'title' && $user->equipped_title_id === $item->id) {
            $user->equipped_title_id = null;
        } elseif ($item->slot === 'accent' && $user->equipped_accent_id === $item->id) {
            $user->equipped_accent_id = null;
        }

        $user->save();

        return response()->json([
            'message' => "Berhasil melepas {$item->name}.",
            'equipped' => [
                'frame' => $user->fresh()->equippedFrame,
                'title' => $user->fresh()->equippedTitle,
                'accent' => $user->fresh()->equippedAccent,
            ],
        ]);
    }
}
