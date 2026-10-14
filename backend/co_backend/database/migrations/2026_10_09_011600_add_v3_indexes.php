<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('xp_transactions', function (Blueprint $table) {
            $table->index(['created_at', 'user_id']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->index('total_xp');
        });

        Schema::table('coin_transactions', function (Blueprint $table) {
            $table->index(['user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::table('xp_transactions', function (Blueprint $table) {
            $table->dropIndex(['created_at', 'user_id']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['total_xp']);
        });

        Schema::table('coin_transactions', function (Blueprint $table) {
            $table->dropIndex(['user_id', 'created_at']);
        });
    }
};
