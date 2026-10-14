<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\UpdateProfileRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        return response()->json($request->user()->load(['levelDefinition', 'streak']));
    }

    public function update(UpdateProfileRequest $request): JsonResponse
    {
        $user = $request->user();
        $user->update($request->validated());

        return response()->json($user);
    }

    public function stats(Request $request): JsonResponse
    {
        $user = $request->user();
        
        return response()->json([
            'total_xp' => $user->total_xp,
            'level' => $user->levelDefinition,
            'challenges_completed' => $user->submissions()->where('status', 'passed')->count(),
            'bugs_fixed' => $user->submissions()->whereHas('activity.lesson', function($q) {
                $q->where('type', 'debug');
            })->where('status', 'passed')->count(),
            'streak' => $user->streak
        ]);
    }
}
