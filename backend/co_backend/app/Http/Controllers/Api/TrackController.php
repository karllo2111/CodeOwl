<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Track;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TrackController extends Controller
{
    public function index(): JsonResponse
    {
        $tracks = Track::orderBy('sort')->withCount('courses')->get();

        return response()->json([
            'data' => $tracks,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'key' => 'required|string|unique:tracks,key',
            'name' => 'required|string',
            'sort' => 'integer',
            'glyph' => 'nullable|string',
        ]);

        $track = Track::create($validated);
        return response()->json($track, 201);
    }

    public function update(Request $request, Track $track): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string',
            'sort' => 'sometimes|integer',
            'glyph' => 'nullable|string',
        ]);

        $track->update($validated);
        return response()->json($track);
    }

    public function destroy(Track $track): JsonResponse
    {
        $track->delete();
        return response()->json(['message' => 'Track berhasil dihapus.']);
    }
}
