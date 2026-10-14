<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Skill;

class SkillTreeController extends Controller {
    public function show($courseSlug) {
        $course = Course::where('slug', $courseSlug)->first();
        if (!$course) {
            return response()->json(['data' => []]);
        }
        $skills = Skill::where('course_id', $course->id)
            ->with('prerequisites')
            ->orderBy('sort_order')
            ->get();
        return response()->json(['data' => $skills]);
    }
}
