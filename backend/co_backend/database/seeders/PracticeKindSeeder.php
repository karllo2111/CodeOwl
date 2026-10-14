<?php

namespace Database\Seeders;

use App\Models\PracticeKind;
use Illuminate\Database\Seeder;

class PracticeKindSeeder extends Seeder
{
    public function run(): void
    {
        $kinds = [
            [
                'kind' => 'practice',
                'label' => 'Latihan Interaktif',
                'description' => 'Latihan terpandu untuk mengasah pemahaman kode secara bertahap.',
                'sort' => 1,
                'enabled' => true,
            ],
            [
                'kind' => 'debug',
                'label' => 'Deteksi & Diagnosa Bug',
                'description' => 'Temukan letak kesalahan logika atau sintaks dan diagnosa penyebabnya.',
                'sort' => 2,
                'enabled' => true,
            ],
            [
                'kind' => 'fix',
                'label' => 'Perbaikan Kode Rusak',
                'description' => 'Perbaiki implementasi kode yang error agar lulus seluruh pengujian.',
                'sort' => 3,
                'enabled' => true,
            ],
            [
                'kind' => 'challenge',
                'label' => 'Tantangan Mandiri',
                'description' => 'Selesaikan instruksi algoritma dari awal tanpa bantuan boilerplate berlebih.',
                'sort' => 4,
                'enabled' => true,
            ],
            [
                'kind' => 'project',
                'label' => 'Proyek Capstone',
                'description' => 'Bangun aplikasi interaktif nyata dengan susunan multi-file HTML/CSS/JS.',
                'sort' => 5,
                'enabled' => true,
            ],
        ];

        foreach ($kinds as $item) {
            PracticeKind::updateOrCreate(
                ['kind' => $item['kind']],
                $item
            );
        }
    }
}
