<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;


return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('broadcast_inputs', function (Blueprint $table) {
            $table->id();
            $table->string('attribute')->nullable();
            $table->date('date')->nullable();
            $table->time('time')->nullable();
            $table->string('csv_file')->nullable();
            $table->string('media')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('broadcast_inputs');
    }
};
