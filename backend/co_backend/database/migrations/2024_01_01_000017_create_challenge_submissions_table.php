<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('challenge_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('activity_id')->constrained()->cascadeOnDelete();
            $table->text('submitted_code');
            $table->string('language')->default('javascript');
            $table->enum('status', ['pending', 'running', 'passed', 'failed', 'error', 'timeout']);
            $table->unsignedInteger('tests_passed')->default(0);
            $table->unsignedInteger('tests_total')->default(0);
            $table->unsignedInteger('execution_time_ms')->nullable();
            $table->unsignedInteger('memory_used_kb')->nullable();
            $table->text('output')->nullable();
            $table->text('error_output')->nullable();
            $table->timestamps();
            
            $table->index(['user_id', 'activity_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('challenge_submissions');
    }
};
