<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Chapter;
use App\Http\Resources\ChapterResource;
use App\Http\Resources\LessonResource;

class ChapterController extends Controller
{
    public function show(Chapter $chapter)
    {
        $chapter->loadCount('lessons');
        return new ChapterResource($chapter);
    }

    public function lessons(Chapter $chapter)
    {
        $lessons = $chapter->lessons()->orderBy('sort_order')->get();
        return LessonResource::collection($lessons);
    }
}
