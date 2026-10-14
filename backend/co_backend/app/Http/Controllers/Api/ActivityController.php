<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Http\Requests\RunCodeRequest;
use App\Services\CodeExecutionService;
use App\Http\Resources\ActivityResource;

class ActivityController extends Controller
{
    public function show(Activity $activity)
    {
        $activity->load(['visibleTests']); // Exclude hidden/solution
        return new ActivityResource($activity);
    }

    public function run(Activity $activity, RunCodeRequest $request, CodeExecutionService $executionService)
    {
        $result = $executionService->execute(
            $request->code,
            $request->language ?? $activity->language,
            $activity->time_limit_seconds ?? 10
        );
        
        return response()->json(['data' => $result]);
    }
}
