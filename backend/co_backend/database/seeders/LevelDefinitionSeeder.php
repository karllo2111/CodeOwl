<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LevelDefinition;

class LevelDefinitionSeeder extends Seeder
{
    public function run(): void
    {
        $levels = [
            ['level' => 1, 'title' => 'Novice Coder', 'min_xp' => 0, 'icon' => 'egg'],
            ['level' => 2, 'title' => 'Apprentice Script', 'min_xp' => 150, 'icon' => 'feather'],
            ['level' => 3, 'title' => 'Syntax Explorer', 'min_xp' => 400, 'icon' => 'compass'],
            ['level' => 4, 'title' => 'Bug Spotter', 'min_xp' => 800, 'icon' => 'search'],
            ['level' => 5, 'title' => 'Logic Tinkerer', 'min_xp' => 1350, 'icon' => 'tool'],
            ['level' => 6, 'title' => 'Loop Runner', 'min_xp' => 2050, 'icon' => 'repeat'],
            ['level' => 7, 'title' => 'Function Crafter', 'min_xp' => 2900, 'icon' => 'box'],
            ['level' => 8, 'title' => 'Array Navigator', 'min_xp' => 3900, 'icon' => 'layers'],
            ['level' => 9, 'title' => 'Object Architect', 'min_xp' => 5050, 'icon' => 'grid'],
            ['level' => 10, 'title' => 'Code Builder', 'min_xp' => 6400, 'icon' => 'cpu'],
            ['level' => 11, 'title' => 'Algorithm Scout', 'min_xp' => 8000, 'icon' => 'zap'],
            ['level' => 12, 'title' => 'Problem Solver', 'min_xp' => 10000, 'icon' => 'shield'],
            ['level' => 13, 'title' => 'DOM Whisperer', 'min_xp' => 12500, 'icon' => 'layout'],
            ['level' => 14, 'title' => 'Async Voyager', 'min_xp' => 15500, 'icon' => 'clock'],
            ['level' => 15, 'title' => 'Full-Stack Initiate', 'min_xp' => 19000, 'icon' => 'database'],
            ['level' => 16, 'title' => 'Clean Code Artisan', 'min_xp' => 23000, 'icon' => 'award'],
            ['level' => 17, 'title' => 'Refactor Wizard', 'min_xp' => 27500, 'icon' => 'sparkles'],
            ['level' => 18, 'title' => 'Frontend Explorer', 'min_xp' => 32500, 'icon' => 'globe'],
            ['level' => 19, 'title' => 'System Builder', 'min_xp' => 38000, 'icon' => 'server'],
            ['level' => 20, 'title' => 'Code Master', 'min_xp' => 45000, 'icon' => 'crown'],
        ];

        foreach ($levels as $l) {
            LevelDefinition::updateOrCreate(['level' => $l['level']], $l);
        }
    }
}
