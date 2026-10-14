<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->foreignId('track_id')->nullable()->constrained('tracks')->nullOnDelete();
            $table->string('glyph')->nullable();
        });

        Schema::table('course_levels', function (Blueprint $table) {
            $table->string('glyph')->nullable();
        });

        Schema::table('chapters', function (Blueprint $table) {
            $table->string('icon')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropForeign(['track_id']);
            $table->dropColumn(['track_id', 'glyph']);
        });

        Schema::table('course_levels', function (Blueprint $table) {
            $table->dropColumn(['glyph']);
        });

        Schema::table('chapters', function (Blueprint $table) {
            $table->dropColumn(['icon']);
        });
    }
};
