<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Achievement;
use Illuminate\Http\Request;
class AchievementController extends Controller {
    public function index(Request $request) { return response()->json($request->user()->achievements); }
    public function all() { return response()->json(Achievement::all()); }
}
