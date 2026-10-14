<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('theme')->default('system');
            $table->unsignedInteger('coins')->default(0);
            $table->unsignedInteger('streak_freezes')->default(0);
            $table->foreignId('last_track_id')->nullable()->constrained('tracks')->nullOnDelete();
            $table->boolean('sidebar_collapsed')->default(false);
            $table->foreignId('equipped_frame_id')->nullable()->constrained('cosmetic_items')->nullOnDelete();
            $table->foreignId('equipped_title_id')->nullable()->constrained('cosmetic_items')->nullOnDelete();
            $table->foreignId('equipped_accent_id')->nullable()->constrained('cosmetic_items')->nullOnDelete();
            $table->boolean('leaderboard_opt_out')->default(false);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['last_track_id']);
            $table->dropForeign(['equipped_frame_id']);
            $table->dropForeign(['equipped_title_id']);
            $table->dropForeign(['equipped_accent_id']);
            $table->dropColumn([
                'theme',
                'coins',
                'streak_freezes',
                'last_track_id',
                'sidebar_collapsed',
                'equipped_frame_id',
                'equipped_title_id',
                'equipped_accent_id',
                'leaderboard_opt_out',
            ]);
        });
    }
};
