<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leaderboard_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('period');
            $table->date('period_start');
            $table->unsignedInteger('xp_earned')->default(0);
            $table->unsignedInteger('challenges_completed')->default(0);
            $table->unsignedInteger('streak_days')->default(0);
            $table->timestamps();
            
            $table->unique(['user_id', 'period', 'period_start']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leaderboard_entries');
    }
};
