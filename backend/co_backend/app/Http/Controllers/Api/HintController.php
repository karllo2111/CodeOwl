<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Services\HintService;
use Illuminate\Http\Request;
class HintController extends Controller {
    public function requestHint(Activity $activity, Request $request, HintService $service) {
        $user = $request->user();
        $unlockedCount = (int) $request->input('unlocked_count', 0);
        $hint = $service->getNextHint($user, $activity, $unlockedCount);
        return response()->json(['data' => $hint]);
    }
}
