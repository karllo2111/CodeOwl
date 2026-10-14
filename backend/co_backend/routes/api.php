<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\ProfileController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\ChapterController;
use App\Http\Controllers\Api\LessonController;
use App\Http\Controllers\Api\ActivityController;
use App\Http\Controllers\Api\ChallengeSubmissionController;
use App\Http\Controllers\Api\HintController;
use App\Http\Controllers\Api\ProgressController;
use App\Http\Controllers\Api\XpController;
use App\Http\Controllers\Api\AchievementController;
use App\Http\Controllers\Api\StreakController;
use App\Http\Controllers\Api\LeaderboardController;
use App\Http\Controllers\Api\SkillTreeController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\RankController;
use App\Http\Controllers\Api\WalletController;
use App\Http\Controllers\Api\ShopController;
use App\Http\Controllers\Api\CosmeticController;
use App\Http\Controllers\Api\ChestController;
use App\Http\Controllers\Api\DraftController;
use App\Http\Controllers\Api\TrackController;
use App\Http\Controllers\Api\PracticeController;
use App\Http\Controllers\Api\PreferenceController;
use App\Http\Controllers\Api\Admin\CourseManagementController;
use App\Http\Controllers\Api\Admin\LessonManagementController;
use App\Http\Controllers\Api\Admin\ActivityManagementController;
use App\Http\Controllers\Api\Admin\AchievementManagementController;

// Health check
Route::get('/health', fn() => response()->json(['status' => 'ok', 'app' => 'CodeQuest']));

// Public Auth routes
Route::post('/register', [RegisterController::class, 'register']);
Route::post('/login', [LoginController::class, 'login']);

// Public Course & Content browsing (Guest-safe)
Route::get('/courses', [CourseController::class, 'index']);
Route::get('/courses/{slug}', [CourseController::class, 'show']);
Route::get('/courses/{slug}/levels', [CourseController::class, 'levels']);
Route::get('/courses/{slug}/skill-tree', [SkillTreeController::class, 'show']);
Route::get('/chapters/{chapter}', [ChapterController::class, 'show']);
Route::get('/chapters/{chapter}/lessons', [ChapterController::class, 'lessons']);
Route::get('/lessons/{lesson}', [LessonController::class, 'show']);
Route::get('/lessons/{lesson}/content', [LessonController::class, 'content']);
Route::get('/leaderboard', [LeaderboardController::class, 'index']);
Route::get('/achievements', [AchievementController::class, 'all']);

// Multi-Track and Practice Hub (Public discovery)
Route::get('/tracks', [TrackController::class, 'index']);
Route::get('/practice/kinds', [PracticeController::class, 'kinds']);
Route::get('/practice/{kind}', [PracticeController::class, 'list']);

// Shop Catalog (Public browsing)
Route::get('/shop', [ShopController::class, 'index']);

// Activities & Code execution
Route::get('/activities/{activity}', [ActivityController::class, 'show']);
Route::post('/activities/{activity}/run', [ActivityController::class, 'run']);
Route::post('/activities/{activity}/submit', [ChallengeSubmissionController::class, 'submit']);
Route::post('/activities/{activity}/hint', [HintController::class, 'requestHint']);
Route::post('/lessons/{lesson}/complete', [ProgressController::class, 'completeLesson']);
Route::get('/chapters/{chapter}/mastery', [ProgressController::class, 'chapterMastery']);
Route::get('/user/progress', [ProgressController::class, 'index']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [LoginController::class, 'logout']);
    Route::get('/user', [ProfileController::class, 'show']);
    Route::get('/users/me', [ProfileController::class, 'show']);
    Route::put('/user', [ProfileController::class, 'update']);
    Route::get('/user/stats', [ProfileController::class, 'stats']);

    // v3 User Experience APIs
    Route::get('/users/me/dashboard', [DashboardController::class, 'show']);
    Route::get('/users/me/rank', [RankController::class, 'show']);
    Route::get('/users/me/wallet', [WalletController::class, 'show']);
    Route::get('/users/me/xp', [XpController::class, 'history']);
    Route::patch('/users/me/preferences', [PreferenceController::class, 'update']);

    // Economy, Shop & Cosmetics
    Route::post('/shop/{id}/purchase', [ShopController::class, 'purchase']);
    Route::get('/cosmetics/inventory', [CosmeticController::class, 'inventory']);
    Route::post('/cosmetics/{id}/equip', [CosmeticController::class, 'equip']);
    Route::post('/cosmetics/{id}/unequip', [CosmeticController::class, 'unequip']);

    // Mystery Chest
    Route::post('/chests/{chapterId}/open', [ChestController::class, 'open']);

    // Drafts Autosave
    Route::get('/activities/{id}/draft', [DraftController::class, 'show']);
    Route::put('/activities/{id}/draft', [DraftController::class, 'update']);

    // Progress & Completion
    Route::get('/user/progress/course/{slug}', [ProgressController::class, 'course']);

    // XP & Gamification
    Route::get('/user/xp', [XpController::class, 'index']);
    Route::get('/user/xp/history', [XpController::class, 'history']);
    Route::get('/user/achievements', [AchievementController::class, 'index']);
    Route::get('/user/streak', [StreakController::class, 'show']);

    // Admin routes
    Route::prefix('admin')->group(function () {
        Route::get('/courses', [CourseManagementController::class, 'index']);
        Route::post('/courses', [CourseManagementController::class, 'store']);
        Route::put('/courses/{course}', [CourseManagementController::class, 'update']);
        Route::delete('/courses/{course}', [CourseManagementController::class, 'destroy']);
        
        Route::post('/courses/{course}/levels', [CourseManagementController::class, 'storeLevel']);
        Route::post('/levels/{level}/chapters', [CourseManagementController::class, 'storeChapter']);
        
        Route::post('/chapters/{chapter}/lessons', [LessonManagementController::class, 'store']);
        Route::put('/lessons/{lesson}', [LessonManagementController::class, 'update']);
        Route::delete('/lessons/{lesson}', [LessonManagementController::class, 'destroy']);
        
        Route::post('/lessons/{lesson}/activities', [ActivityManagementController::class, 'store']);
        Route::put('/activities/{activity}', [ActivityManagementController::class, 'update']);
        Route::delete('/activities/{activity}', [ActivityManagementController::class, 'destroy']);
        Route::post('/activities/{activity}/tests', [ActivityManagementController::class, 'storeTest']);
        Route::post('/activities/{activity}/hints', [ActivityManagementController::class, 'storeHint']);

        Route::get('/achievements', [AchievementManagementController::class, 'index']);
        Route::post('/achievements', [AchievementManagementController::class, 'store']);
        Route::put('/achievements/{achievement}', [AchievementManagementController::class, 'update']);
        Route::delete('/achievements/{achievement}', [AchievementManagementController::class, 'destroy']);

        // Tracks and Practice Kinds management
        Route::post('/tracks', [TrackController::class, 'store']);
        Route::put('/tracks/{track}', [TrackController::class, 'update']);
        Route::delete('/tracks/{track}', [TrackController::class, 'destroy']);
    });
});
