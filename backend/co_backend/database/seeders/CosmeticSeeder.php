<?php

namespace Database\Seeders;

use App\Models\Achievement;
use App\Models\CosmeticItem;
use Illuminate\Database\Seeder;

class CosmeticSeeder extends Seeder
{
    public function run(): void
    {
        // 1. BOOSTER (Consumable)
        CosmeticItem::updateOrCreate(
            ['name' => 'Streak Freeze', 'slot' => 'booster'],
            [
                'rarity' => 'common',
                'price_coins' => 100,
                'unlock_type' => 'shop',
                'data' => [
                    'description' => 'Melindungi rekor streak Anda dari reset jika melewatkan satu hari.',
                    'max_held' => 2,
                ],
                'is_active' => true,
            ]
        );

        // 2. FRAMES (>= 12 frames, clean CSS geometric border definitions, no glow)
        $frames = [
            ['name' => 'Minimal Slate', 'rarity' => 'common', 'price' => 50, 'unlock' => 'shop', 'ref' => null, 'css' => ['borderWidth' => 2, 'borderColor' => '#94a3b8', 'borderStyle' => 'solid']],
            ['name' => 'Hairline Iron', 'rarity' => 'common', 'price' => 60, 'unlock' => 'shop', 'ref' => null, 'css' => ['borderWidth' => 1, 'borderColor' => '#64748b', 'borderStyle' => 'solid']],
            ['name' => 'Forest Green', 'rarity' => 'common', 'price' => 75, 'unlock' => 'shop', 'ref' => null, 'css' => ['borderWidth' => 2, 'borderColor' => '#16a34a', 'borderStyle' => 'solid']],
            ['name' => 'Bronze Crest', 'rarity' => 'uncommon', 'price' => 120, 'unlock' => 'shop', 'ref' => null, 'css' => ['borderWidth' => 2, 'borderColor' => '#d97706', 'borderStyle' => 'solid', 'padding' => 2]],
            ['name' => 'Cobalt Ring', 'rarity' => 'uncommon', 'price' => 140, 'unlock' => 'shop', 'ref' => null, 'css' => ['borderWidth' => 2, 'borderColor' => '#2563eb', 'borderStyle' => 'solid']],
            ['name' => 'Amethyst Circuit', 'rarity' => 'uncommon', 'price' => 160, 'unlock' => 'shop', 'ref' => null, 'css' => ['borderWidth' => 2, 'borderColor' => '#9333ea', 'borderStyle' => 'dashed']],
            ['name' => 'Double Steel', 'rarity' => 'rare', 'price' => 220, 'unlock' => 'shop', 'ref' => null, 'css' => ['borderWidth' => 3, 'borderColor' => '#475569', 'borderStyle' => 'double']],
            ['name' => 'Silver Edge', 'rarity' => 'rare', 'price' => 250, 'unlock' => 'shop', 'ref' => null, 'css' => ['borderWidth' => 2, 'borderColor' => '#cbd5e1', 'borderStyle' => 'solid', 'padding' => 2]],
            ['name' => 'Gold Standard', 'rarity' => 'epic', 'price' => 400, 'unlock' => 'shop', 'ref' => null, 'css' => ['borderWidth' => 3, 'borderColor' => '#eab308', 'borderStyle' => 'solid', 'padding' => 2]],
            ['name' => 'Obsidian Double', 'rarity' => 'epic', 'price' => 450, 'unlock' => 'shop', 'ref' => null, 'css' => ['borderWidth' => 3, 'borderColor' => '#1e293b', 'borderStyle' => 'solid', 'outerBorder' => '#64748b']],
            ['name' => 'Ember', 'rarity' => 'legendary', 'price' => null, 'unlock' => 'achievement', 'ref' => 'boss-slayer', 'css' => ['borderWidth' => 3, 'borderColor' => '#ea580c', 'borderStyle' => 'solid', 'padding' => 2]],
            ['name' => 'Architect Titanium', 'rarity' => 'legendary', 'price' => 800, 'unlock' => 'shop', 'ref' => null, 'css' => ['borderWidth' => 3, 'borderColor' => '#38bdf8', 'borderStyle' => 'solid', 'outerBorder' => '#0284c7']],
            ['name' => 'Chamber Vault', 'rarity' => 'rare', 'price' => null, 'unlock' => 'chest', 'ref' => null, 'css' => ['borderWidth' => 2, 'borderColor' => '#10b981', 'borderStyle' => 'dashed', 'padding' => 2]],
        ];

        foreach ($frames as $f) {
            CosmeticItem::updateOrCreate(
                ['name' => $f['name'], 'slot' => 'frame'],
                [
                    'rarity' => $f['rarity'],
                    'price_coins' => $f['price'],
                    'unlock_type' => $f['unlock'],
                    'unlock_ref' => $f['ref'],
                    'data' => $f['css'],
                    'is_active' => true,
                ]
            );
        }

        // 3. TITLES (>= 25 titles)
        $titles = [
            ['name' => 'Novice Coder', 'rarity' => 'common', 'price' => 30, 'unlock' => 'shop', 'ref' => null],
            ['name' => 'Syntax Seeker', 'rarity' => 'common', 'price' => 40, 'unlock' => 'shop', 'ref' => null],
            ['name' => 'Variable Vanguard', 'rarity' => 'common', 'price' => 50, 'unlock' => 'shop', 'ref' => null],
            ['name' => 'Loop Runner', 'rarity' => 'common', 'price' => 60, 'unlock' => 'shop', 'ref' => null],
            ['name' => 'Logic Builder', 'rarity' => 'common', 'price' => 70, 'unlock' => 'shop', 'ref' => null],
            ['name' => 'Bug Hunter', 'rarity' => 'uncommon', 'price' => null, 'unlock' => 'achievement', 'ref' => 'bug-hunter'],
            ['name' => 'Consistent', 'rarity' => 'uncommon', 'price' => null, 'unlock' => 'achievement', 'ref' => 'streak-7'],
            ['name' => 'Chapter Master', 'rarity' => 'rare', 'price' => null, 'unlock' => 'achievement', 'ref' => 'first-chapter-master'],
            ['name' => 'Array Artisan', 'rarity' => 'uncommon', 'price' => 90, 'unlock' => 'shop', 'ref' => null],
            ['name' => 'Function Crafter', 'rarity' => 'uncommon', 'price' => 100, 'unlock' => 'shop', 'ref' => null],
            ['name' => 'Scope Sentinel', 'rarity' => 'uncommon', 'price' => 110, 'unlock' => 'shop', 'ref' => null],
            ['name' => 'Debug Detective', 'rarity' => 'uncommon', 'price' => 120, 'unlock' => 'shop', 'ref' => null],
            ['name' => 'Clean Coder', 'rarity' => 'rare', 'price' => 150, 'unlock' => 'shop', 'ref' => null],
            ['name' => 'Refactor Knight', 'rarity' => 'rare', 'price' => 180, 'unlock' => 'shop', 'ref' => null],
            ['name' => 'Algorithmist', 'rarity' => 'rare', 'price' => 200, 'unlock' => 'shop', 'ref' => null],
            ['name' => 'Builder', 'rarity' => 'rare', 'price' => null, 'unlock' => 'level', 'ref' => '10'],
            ['name' => 'Problem Solver', 'rarity' => 'epic', 'price' => null, 'unlock' => 'level', 'ref' => '20'],
            ['name' => 'Code Master', 'rarity' => 'legendary', 'price' => null, 'unlock' => 'level', 'ref' => '30'],
            ['name' => 'Async Voyager', 'rarity' => 'rare', 'price' => 220, 'unlock' => 'shop', 'ref' => null],
            ['name' => 'DOM Whisperer', 'rarity' => 'rare', 'price' => 240, 'unlock' => 'shop', 'ref' => null],
            ['name' => 'Fullstack Pioneer', 'rarity' => 'epic', 'price' => 300, 'unlock' => 'shop', 'ref' => null],
            ['name' => 'Terminal Sage', 'rarity' => 'epic', 'price' => 350, 'unlock' => 'shop', 'ref' => null],
            ['name' => 'System Architect', 'rarity' => 'epic', 'price' => 400, 'unlock' => 'shop', 'ref' => null],
            ['name' => 'Bug Slayer Prime', 'rarity' => 'legendary', 'price' => 500, 'unlock' => 'shop', 'ref' => null],
            ['name' => 'The Pragmatic', 'rarity' => 'legendary', 'price' => 600, 'unlock' => 'shop', 'ref' => null],
            ['name' => 'Relic Hunter', 'rarity' => 'rare', 'price' => null, 'unlock' => 'chest', 'ref' => null],
        ];

        foreach ($titles as $t) {
            CosmeticItem::updateOrCreate(
                ['name' => $t['name'], 'slot' => 'title'],
                [
                    'rarity' => $t['rarity'],
                    'price_coins' => $t['price'],
                    'unlock_type' => $t['unlock'],
                    'unlock_ref' => $t['ref'],
                    'is_active' => true,
                ]
            );
        }

        // 4. ACCENT COLORS (6 vetted WCAG AA presets)
        $accents = [
            ['name' => 'Indigo Blue', 'rarity' => 'common', 'price' => 80, 'data' => ['light' => '#3F5BD9', 'dark' => '#8DA2FF']],
            ['name' => 'Emerald Green', 'rarity' => 'common', 'price' => 80, 'data' => ['light' => '#177A4B', 'dark' => '#4CC38A']],
            ['name' => 'Amber Gold', 'rarity' => 'uncommon', 'price' => 120, 'data' => ['light' => '#A15C07', 'dark' => '#E3A94B']],
            ['name' => 'Rose Crimson', 'rarity' => 'uncommon', 'price' => 120, 'data' => ['light' => '#C4314B', 'dark' => '#F17A8C']],
            ['name' => 'Amethyst Violet', 'rarity' => 'rare', 'price' => 180, 'data' => ['light' => '#7C3AED', 'dark' => '#A78BFA']],
            ['name' => 'Cyan Horizon', 'rarity' => 'rare', 'price' => 180, 'data' => ['light' => '#0284C7', 'dark' => '#38BDF8']],
        ];

        foreach ($accents as $a) {
            CosmeticItem::updateOrCreate(
                ['name' => $a['name'], 'slot' => 'accent'],
                [
                    'rarity' => $a['rarity'],
                    'price_coins' => $a['price'],
                    'unlock_type' => 'shop',
                    'data' => $a['data'],
                    'is_active' => true,
                ]
            );
        }

        // 5. Connect achievements to cosmetic reward IDs
        $this->linkAchievementRewards();
    }

    protected function linkAchievementRewards(): void
    {
        $bugHunterTitle = CosmeticItem::where('name', 'Bug Hunter')->where('slot', 'title')->first();
        if ($bugHunterTitle) {
            Achievement::where('slug', 'bug-hunter')->update(['reward_cosmetic_id' => $bugHunterTitle->id]);
        }

        $emberFrame = CosmeticItem::where('name', 'Ember')->where('slot', 'frame')->first();
        if ($emberFrame) {
            Achievement::where('slug', 'boss-slayer')->update(['reward_cosmetic_id' => $emberFrame->id]);
        }

        $consistentTitle = CosmeticItem::where('name', 'Consistent')->where('slot', 'title')->first();
        if ($consistentTitle) {
            Achievement::where('slug', 'streak-7')->update(['reward_cosmetic_id' => $consistentTitle->id]);
        }

        $masterTitle = CosmeticItem::where('name', 'Chapter Master')->where('slot', 'title')->first();
        if ($masterTitle) {
            Achievement::where('slug', 'first-chapter-master')->update(['reward_cosmetic_id' => $masterTitle->id]);
        }
    }
}
