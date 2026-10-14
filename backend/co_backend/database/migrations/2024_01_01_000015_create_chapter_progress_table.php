<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chapter_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('chapter_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('mastery_percentage')->default(0);
            $table->unsignedInteger('theory_score')->default(0);
            $table->unsignedInteger('coding_score')->default(0);
            $table->unsignedInteger('debugging_score')->default(0);
            $table->unsignedInteger('problem_solving_score')->default(0);
            $table->enum('status', ['not_started', 'in_progress', 'completed', 'mastered'])->default('not_started');
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            
            $table->unique(['user_id', 'chapter_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chapter_progress');
    }
};
