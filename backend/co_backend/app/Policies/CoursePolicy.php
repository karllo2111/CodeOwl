<?php
namespace App\Policies;
use App\Models\User;
use App\Models\Course;
class CoursePolicy {
    public function viewAny(?User $user) { return true; }
    public function view(?User $user, Course $course) { return $course->is_published || ($user && $user->hasRole(['admin', 'content_editor'])); }
    public function create(User $user) { return $user->hasRole(['admin', 'content_editor']); }
    public function update(User $user, Course $course) { return $user->hasRole(['admin', 'content_editor']); }
    public function delete(User $user, Course $course) { return $user->hasRole(['admin', 'content_editor']); }
}
