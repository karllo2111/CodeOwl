<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('code_executions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('submission_id')->nullable()->constrained('challenge_submissions')->nullOnDelete();
            $table->string('language');
            $table->text('code');
            $table->text('output')->nullable();
            $table->text('error_output')->nullable();
            $table->integer('exit_code')->nullable();
            $table->unsignedInteger('execution_time_ms')->nullable();
            $table->unsignedInteger('memory_used_kb')->nullable();
            $table->enum('status', ['pending', 'running', 'completed', 'error', 'timeout']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('code_executions');
    }
};
