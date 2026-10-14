<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\RankService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RankController extends Controller
{
    public function __construct(
        protected RankService $rankService
    ) {}

    public function show(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $rank = $this->rankService->getUserRank($user);

        return response()->json($rank);
    }
}
