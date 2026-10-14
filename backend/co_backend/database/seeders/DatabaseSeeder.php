<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            LevelDefinitionSeeder::class,
            TrackSeeder::class,
            PracticeKindSeeder::class,
            AchievementSeeder::class,
            CosmeticSeeder::class,
            UserSeeder::class,
            JavaScriptCourseSeeder::class,
        ]);
    }
}
