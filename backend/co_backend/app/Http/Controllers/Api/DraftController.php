<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\ActivityDraft;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DraftController extends Controller
{
    /**
     * Get saved draft for an activity.
     */
    public function show(Request $request, int $activityId): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $draft = ActivityDraft::where('user_id', $user->id)
            ->where('activity_id', $activityId)
            ->first();

        return response()->json([
            'draft' => $draft ? [
                'code' => $draft->code,
                'updated_at' => $draft->updated_at,
            ] : null,
        ]);
    }

    /**
     * Save or update draft for an activity.
     */
    public function update(Request $request, int $activityId): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $request->validate([
            'code' => 'required|string',
        ]);

        $activity = Activity::findOrFail($activityId);

        $draft = ActivityDraft::updateOrCreate(
            [
                'user_id' => $user->id,
                'activity_id' => $activity->id,
            ],
            [
                'code' => $request->input('code'),
            ]
        );

        return response()->json([
            'message' => 'Tersimpan',
            'updated_at' => $draft->updated_at,
        ]);
    }
}
