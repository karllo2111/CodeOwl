<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
class StreakController extends Controller {
    public function show(Request $request) { return response()->json($request->user()->streak); }
}
