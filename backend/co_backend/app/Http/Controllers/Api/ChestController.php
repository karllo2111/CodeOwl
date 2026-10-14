<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Chapter;
use App\Models\User;
use App\Services\ChestService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use InvalidArgumentException;

class ChestController extends Controller
{
    public function __construct(
        protected ChestService $chestService
    ) {}

    public function open(Request $request, int $chapterId): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $chapter = Chapter::findOrFail($chapterId);

        try {
            $result = $this->chestService->openChest($user, $chapter);
            return response()->json($result);
        } catch (InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 403);
        }
    }
}
