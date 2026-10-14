<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create([
        'email' => 'session_test@example.com',
        'password' => Hash::make('secret123'),
    ]);
});

test('referrer policy header is present and is not no-referrer', function () {
    $response = $this->get('/api/health');
    $response->assertStatus(200);

    $referrerPolicy = $response->headers->get('Referrer-Policy');
    expect($referrerPolicy)->not->toBeNull()
        ->and($referrerPolicy)->not->toBe('no-referrer')
        ->and($referrerPolicy)->toBe('strict-origin-when-cross-origin');
});

test('login creates session row and supports remember option', function () {
    $response = $this->withHeaders([
        'Origin' => 'http://localhost:5173',
        'Referer' => 'http://localhost:5173/',
    ])->postJson('/api/login', [
        'email' => 'session_test@example.com',
        'password' => 'secret123',
        'remember' => true,
    ]);

    $response->assertStatus(200)
        ->assertJsonStructure(['user', 'access_token', 'token_type']);

    // Assert session exists in sessions table
    $sessionCount = DB::table('sessions')->where('user_id', $this->user->id)->count();
    expect($sessionCount)->toBeGreaterThanOrEqual(1);
});

test('stateful GET /api/users/me with only a Referer header returns 200', function () {
    // Act as the user using sanctum
    $this->actingAs($this->user, 'sanctum');

    $response = $this->withHeaders([
        'Referer' => 'http://localhost:5173/',
    ])->getJson('/api/users/me');

    $response->assertStatus(200)
        ->assertJsonPath('email', 'session_test@example.com');
});
