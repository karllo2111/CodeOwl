<?php
namespace App\Policies;
use App\Models\User;
use App\Models\Lesson;
class LessonPolicy {
    public function view(?User $user, Lesson $lesson) { return true; }
    public function complete(User $user, Lesson $lesson) { return true; }
}
