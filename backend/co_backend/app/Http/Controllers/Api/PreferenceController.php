<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PreferenceController extends Controller
{
    public function update(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $validated = $request->validate([
            'theme' => 'nullable|string|in:system,light,dark',
            'sidebar_collapsed' => 'nullable|boolean',
            'last_track_id' => 'nullable|exists:tracks,id',
            'leaderboard_opt_out' => 'nullable|boolean',
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Preferensi berhasil diperbarui.',
            'preferences' => [
                'theme' => $user->theme,
                'sidebar_collapsed' => $user->sidebar_collapsed,
                'last_track_id' => $user->last_track_id,
                'leaderboard_opt_out' => $user->leaderboard_opt_out,
            ],
        ]);
    }
}
