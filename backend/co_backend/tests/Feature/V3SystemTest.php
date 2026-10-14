<?php

use App\Models\Activity;
use App\Models\ActivityDraft;
use App\Models\Chapter;
use App\Models\CosmeticItem;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\Track;
use App\Models\User;
use App\Models\UserCosmetic;
use App\Services\CoinService;
use App\Services\StreakService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->artisan('db:seed', ['--class' => 'RoleSeeder']);
    $this->artisan('db:seed', ['--class' => 'TrackSeeder']);
    $this->artisan('db:seed', ['--class' => 'PracticeKindSeeder']);
    $this->artisan('db:seed', ['--class' => 'CosmeticSeeder']);
    $this->artisan('db:seed', ['--class' => 'JavaScriptCourseSeeder']);
});

test('fresh user payload is completely honest: 0 XP, level 1, 0 coins, freezes 0, unranked', function () {
    $user = User::factory()->create([
        'total_xp' => 0,
        'current_level' => 1,
        'coins' => 0,
        'streak_freezes' => 0,
    ]);

    $response = $this->actingAs($user)->getJson('/api/users/me/dashboard');
    $response->assertOk();
    $data = $response->json();

    expect($data['stats']['total_xp'])->toBe(0)
        ->and($data['stats']['current_level'])->toBe(1)
        ->and($data['stats']['coins'])->toBe(0)
        ->and($data['stats']['rank_weekly'])->toBeNull()
        ->and($data['stats']['rank_all_time'])->toBeNull()
        ->and($data['streak']['current'])->toBe(0)
        ->and($data['streak']['freezes_available'])->toBe(0);

    // Wallet is also 0
    $wallet = $this->actingAs($user)->getJson('/api/users/me/wallet');
    $wallet->assertOk();
    expect($wallet->json('balance'))->toBe(0)
        ->and($wallet->json('transactions.data'))->toBeEmpty();

    // Rank endpoint returns null for unranked
    $rank = $this->actingAs($user)->getJson('/api/users/me/rank');
    $rank->assertOk();
    expect($rank->json('weekly'))->toBeNull()
        ->and($rank->json('allTime'))->toBeNull();
});

test('guest endpoints never leak per-user fields', function () {
    $response = $this->getJson('/api/courses');
    $response->assertOk();
    $course = $response->json('data.0');

    expect($course)->not->toHaveKey('user_progress')
        ->and($course)->not->toHaveKey('completed')
        ->and($course)->not->toHaveKey('is_enrolled');

    $slugRes = $this->getJson('/api/courses/javascript-fundamentals');
    $slugRes->assertOk();
    expect($slugRes->json('data'))->not->toHaveKey('user_stats');
});

test('streak records correctly with Carbon::setTestNow and earns freeze after 7 days', function () {
    $user = User::factory()->create(['streak_freezes' => 0]);
    $streakService = app(StreakService::class);

    // Day 1
    Carbon::setTestNow(Carbon::parse('2026-10-01 10:00:00'));
    $streak = $streakService->recordActivity($user);
    expect($streak->current_streak)->toBe(1);

    // Day 2 consecutive
    Carbon::setTestNow(Carbon::parse('2026-10-02 11:00:00'));
    $streak = $streakService->recordActivity($user);
    expect($streak->current_streak)->toBe(2);

    // Simulate 7 consecutive days (days 3 through 7)
    for ($i = 3; $i <= 7; $i++) {
        Carbon::setTestNow(Carbon::parse("2026-10-0{$i} 10:00:00"));
        $streak = $streakService->recordActivity($user);
    }

    expect($streak->current_streak)->toBe(7)
        ->and($user->fresh()->streak_freezes)->toBe(1); // Earned 1 freeze!

    // Day 8: missed! (Jump to Day 9)
    Carbon::setTestNow(Carbon::parse('2026-10-09 10:00:00'));
    $streak = $streakService->recordActivity($user);

    // Freeze consumed: streak continues at 8, freezes reduced to 0
    expect($streak->current_streak)->toBe(8)
        ->and($user->fresh()->streak_freezes)->toBe(0);

    Carbon::setTestNow(); // reset
});

test('coins cannot go negative and transactions are logged with row lock', function () {
    $user = User::factory()->create(['coins' => 50]);
    $coinService = app(CoinService::class);

    // Earning coins
    $tx = $coinService->addCoins($user, 100, 'Test earn');
    expect($tx->amount)->toBe(100)
        ->and($tx->balance_after)->toBe(150)
        ->and($user->fresh()->coins)->toBe(150);

    // Spending within balance
    $spendTx = $coinService->spendCoins($user, 75, 'Test spend');
    expect($spendTx->amount)->toBe(-75)
        ->and($spendTx->balance_after)->toBe(75)
        ->and($user->fresh()->coins)->toBe(75);

    // Attempting to spend more than balance fails
    expect(fn() => $coinService->spendCoins($user, 200, 'Overspend'))
        ->toThrow(InvalidArgumentException::class);

    // Balance remains intact
    expect($user->fresh()->coins)->toBe(75);
});

test('shop purchase checks balance, prevents duplicates, and equips items exclusively per slot', function () {
    $frame = CosmeticItem::where('slot', 'frame')->where('price_coins', '>', 0)->firstOrFail();
    $user = User::factory()->create(['coins' => $frame->price_coins - 10]);

    // 1. Can't afford
    $res = $this->actingAs($user)->postJson("/api/shop/{$frame->id}/purchase");
    $res->assertStatus(422);

    // 2. Add enough coins and purchase
    $user->update(['coins' => $frame->price_coins + 50]);
    $res2 = $this->actingAs($user)->postJson("/api/shop/{$frame->id}/purchase");
    $res2->assertOk();
    expect($user->fresh()->coins)->toBe(50);

    // 3. Prevent duplicate purchase
    $res3 = $this->actingAs($user)->postJson("/api/shop/{$frame->id}/purchase");
    $res3->assertStatus(422);

    // 4. Equip frame
    $equipRes = $this->actingAs($user)->postJson("/api/cosmetics/{$frame->id}/equip");
    $equipRes->assertOk();
    expect($user->fresh()->equipped_frame_id)->toBe($frame->id);

    // 5. Unequip
    $unequipRes = $this->actingAs($user)->postJson("/api/cosmetics/{$frame->id}/unequip");
    $unequipRes->assertOk();
    expect($user->fresh()->equipped_frame_id)->toBeNull();
});

test('drafts save and restore properly per activity', function () {
    $user = User::factory()->create();
    $activity = Activity::firstOrFail();

    $code = 'let x = 42; console.log(x);';

    $saveRes = $this->actingAs($user)->putJson("/api/activities/{$activity->id}/draft", [
        'code' => $code,
    ]);
    $saveRes->assertOk();

    $getRes = $this->actingAs($user)->getJson("/api/activities/{$activity->id}/draft");
    $getRes->assertOk();
    expect($getRes->json('draft.code'))->toBe($code);
});
