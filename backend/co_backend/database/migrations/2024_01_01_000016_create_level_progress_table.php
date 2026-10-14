<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('level_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('course_level_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('mastery_percentage')->default(0);
            $table->enum('status', ['locked', 'unlocked', 'in_progress', 'completed', 'mastered'])->default('locked');
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            
            $table->unique(['user_id', 'course_level_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('level_progress');
    }
};
