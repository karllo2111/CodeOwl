<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Http\Resources\CourseResource;
use App\Http\Resources\CourseLevelResource;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::where('is_published', true)
            ->withCount(['levels', 'chapters'])
            ->get();
            
        return CourseResource::collection($courses);
    }

    public function show($slug)
    {
        $course = Course::where('slug', $slug)
            ->with(['levels.chapters.lessons'])
            ->firstOrFail();
            
        return new CourseResource($course);
    }

    public function levels($slug)
    {
        $course = Course::where('slug', $slug)->firstOrFail();
        $levels = $course->levels()
            ->with(['chapters' => function ($q) {
                $q->orderBy('sort_order')->with(['lessons' => function ($l) {
                    $l->orderBy('sort_order');
                }]);
            }])
            ->orderBy('sort_order')
            ->get();
        
        return CourseLevelResource::collection($levels);
    }
}
