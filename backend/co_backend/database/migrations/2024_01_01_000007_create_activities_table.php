<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lesson_id')->constrained()->cascadeOnDelete();
            $table->text('instructions');
            $table->text('starter_code')->nullable();
            $table->text('solution_code')->nullable();
            $table->string('language')->default('javascript');
            $table->unsignedInteger('time_limit_seconds')->nullable();
            $table->unsignedInteger('max_attempts')->nullable();
            $table->unsignedInteger('xp_reward')->default(50);
            $table->unsignedInteger('xp_penalty_per_hint')->default(10);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
