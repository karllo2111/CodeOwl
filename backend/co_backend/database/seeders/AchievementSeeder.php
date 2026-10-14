<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Achievement;

class AchievementSeeder extends Seeder
{
    public function run(): void
    {
        $achievements = [
            [
                'slug' => 'first-code',
                'title' => 'First Spark',
                'description' => 'Write and run your first successful program.',
                'icon' => 'sparkles',
                'category' => 'learning',
                'condition_type' => 'first_code',
                'condition_value' => 1,
                'xp_reward' => 50,
                'is_active' => true,
            ],
            [
                'slug' => 'bug-hunter',
                'title' => 'Bug Hunter',
                'description' => 'Identify and fix 5 bugs in debugging exercises.',
                'icon' => 'bug',
                'category' => 'debugging',
                'condition_type' => 'bugs_fixed',
                'condition_value' => 5,
                'xp_reward' => 100,
                'is_active' => true,
            ],
            [
                'slug' => 'bug-slayer',
                'title' => 'Bug Slayer',
                'description' => 'Fix 20 broken implementations.',
                'icon' => 'shield-alert',
                'category' => 'debugging',
                'condition_type' => 'bugs_fixed',
                'condition_value' => 20,
                'xp_reward' => 300,
                'is_active' => true,
            ],
            [
                'slug' => 'challenge-rookie',
                'title' => 'Challenge Rookie',
                'description' => 'Solve 5 from-scratch challenges.',
                'icon' => 'swords',
                'category' => 'learning',
                'condition_type' => 'challenges_completed',
                'condition_value' => 5,
                'xp_reward' => 120,
                'is_active' => true,
            ],
            [
                'slug' => 'no-hint-master',
                'title' => 'Pure Instinct',
                'description' => 'Complete a challenge without requesting any hints.',
                'icon' => 'brain',
                'category' => 'learning',
                'condition_type' => 'no_hints',
                'condition_value' => 1,
                'xp_reward' => 150,
                'is_active' => true,
            ],
            [
                'slug' => 'streak-3',
                'title' => 'Heating Up',
                'description' => 'Maintain a 3-day learning streak.',
                'icon' => 'flame',
                'category' => 'consistency',
                'condition_type' => 'streak_days',
                'condition_value' => 3,
                'xp_reward' => 100,
                'is_active' => true,
            ],
            [
                'slug' => 'streak-7',
                'title' => 'Unstoppable Momentum',
                'description' => 'Maintain a 7-day learning streak.',
                'icon' => 'zap',
                'category' => 'consistency',
                'condition_type' => 'streak_days',
                'condition_value' => 7,
                'xp_reward' => 250,
                'is_active' => true,
            ],
            [
                'slug' => 'chapter-master',
                'title' => 'Chapter Scholar',
                'description' => 'Achieve 80%+ mastery in any chapter review.',
                'icon' => 'award',
                'category' => 'learning',
                'condition_type' => 'chapters_mastered',
                'condition_value' => 1,
                'xp_reward' => 200,
                'is_active' => true,
            ],
            [
                'slug' => 'project-architect',
                'title' => 'Project Architect',
                'description' => 'Build and pass all tests for your first full project.',
                'icon' => 'hammer',
                'category' => 'building',
                'condition_type' => 'projects_completed',
                'condition_value' => 1,
                'xp_reward' => 500,
                'is_active' => true,
            ],
        ];

        foreach ($achievements as $a) {
            Achievement::updateOrCreate(['slug' => $a['slug']], $a);
        }
    }
}
