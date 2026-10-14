<?php

namespace Database\Seeders;

use App\Models\Track;
use Illuminate\Database\Seeder;

class TrackSeeder extends Seeder
{
    public function run(): void
    {
        Track::updateOrCreate(
            ['key' => 'javascript'],
            [
                'name' => 'JavaScript',
                'sort' => 1,
                'glyph' => 'terminal',
            ]
        );
    }
}
