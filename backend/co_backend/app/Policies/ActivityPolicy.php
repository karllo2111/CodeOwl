<?php
namespace App\Policies;
use App\Models\User;
use App\Models\Activity;
class ActivityPolicy {
    public function view(User $user, Activity $activity) { return true; }
    public function submit(User $user, Activity $activity) { return true; }
    public function viewSolution(User $user, Activity $activity) { return $user->hasRole(['admin', 'content_editor']); }
}
