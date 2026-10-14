<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cosmetic_items', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slot'); // frame | title | accent | booster
            $table->string('rarity')->default('common'); // common | uncommon | rare | epic | legendary
            $table->unsignedInteger('price_coins')->nullable();
            $table->string('unlock_type')->default('shop'); // shop | achievement | level | chest
            $table->string('unlock_ref')->nullable();
            $table->json('data')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cosmetic_items');
    }
};
