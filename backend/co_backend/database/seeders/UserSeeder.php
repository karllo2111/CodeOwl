<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Streak;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Admin User (local/dev only)
        if (app()->environment('local', 'testing')) {
            $admin = User::updateOrCreate(
                ['email' => 'admin@codeowl.dev'],
                [
                    'name' => 'CodeQuest Admin',
                    'username' => 'admin',
                    'password' => Hash::make('password'),
                    'total_xp' => 0,
                    'current_level' => 1,
                    'coins' => 0,
                    'streak_freezes' => 0,
                    'bio' => 'Lead instructor and platform architect at CodeQuest.',
                ]
            );
            $admin->syncRoles(['admin']);

            Streak::updateOrCreate(
                ['user_id' => $admin->id],
                [
                    'current_streak' => 0,
                    'longest_streak' => 0,
                    'last_activity_date' => null,
                    'streak_data' => [],
                ]
            );
        }

        // 2. Demo Learner (created only if SEED_DEMO_USERS=true, with zero progress)
        if (env('SEED_DEMO_USERS', false)) {
            $user = User::updateOrCreate(
                ['email' => 'karllo@codeowl.dev'],
                [
                    'name' => 'Karllo',
                    'username' => 'karllo',
                    'password' => Hash::make('password'),
                    'total_xp' => 0,
                    'current_level' => 1,
                    'coins' => 0,
                    'streak_freezes' => 0,
                    'bio' => 'Curious developer mastering JavaScript and full-stack software development.',
                ]
            );
            $user->syncRoles(['user']);

            Streak::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'current_streak' => 0,
                    'longest_streak' => 0,
                    'last_activity_date' => null,
                    'streak_data' => [],
                ]
            );
        }
    }
}
