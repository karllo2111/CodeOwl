<?php
namespace App\Services;
use App\Models\User;
use App\Models\Activity;
class HintService {
    public function getNextHint(?User $user, Activity $activity, int $alreadyUnlockedCount = 0) {
        $hints = $activity->challengeHints()->orderBy('sort_order')->get();
        if ($hints->isEmpty()) {
            return [
                'id' => 1,
                'hint_type' => 'direction',
                'content' => 'Review the instructions carefully and test each variable or function output step by step.',
                'xp_penalty' => 5,
            ];
        }

        $hint = $hints->get($alreadyUnlockedCount) ?? $hints->last();

        return [
            'id' => $hint->id,
            'hint_type' => $hint->hint_type,
            'content' => $hint->content,
            'xp_penalty' => $hint->xp_penalty ?? 10,
        ];
    }
}
