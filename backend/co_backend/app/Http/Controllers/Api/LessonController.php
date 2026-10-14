<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Http\Resources\LessonResource;
use App\Http\Resources\LessonContentResource;

class LessonController extends Controller
{
    public function show(Lesson $lesson)
    {
        $lesson->load(['contentBlocks', 'activity']);
        return new LessonResource($lesson);
    }

    public function content(Lesson $lesson)
    {
        return LessonContentResource::collection($lesson->contentBlocks()->orderBy('sort_order')->get());
    }
}
