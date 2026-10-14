<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('achievements', function (Blueprint $table) {
            $table->foreignId('reward_cosmetic_id')->nullable()->constrained('cosmetic_items')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('achievements', function (Blueprint $table) {
            $table->dropForeign(['reward_cosmetic_id']);
            $table->dropColumn('reward_cosmetic_id');
        });
    }
};
