<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chapter_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('slug');
            $table->enum('type', ['theory', 'example', 'playground', 'practice', 'debug', 'fix', 'quiz', 'challenge', 'chapter_review', 'level_review', 'project']);
            $table->integer('sort_order')->default(0);
            $table->unsignedInteger('xp_reward')->default(20);
            $table->enum('difficulty', ['easy', 'normal', 'hard', 'expert'])->default('normal');
            $table->unsignedInteger('estimated_minutes')->nullable();
            $table->boolean('is_published')->default(false);
            $table->timestamps();
            
            $table->unique(['chapter_id', 'slug']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lessons');
    }
};
