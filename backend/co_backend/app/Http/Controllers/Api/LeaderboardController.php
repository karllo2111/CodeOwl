<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Services\LeaderboardService;
use Illuminate\Http\Request;
class LeaderboardController extends Controller {
    public function index(Request $request, LeaderboardService $service) { 
        return response()->json([
            'data' => $service->getLeaderboard($request->query('period', 'all_time'), $request->query('page', 1), 20)
        ]);
    }
}
