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
        Schema::create('_broadcast_trials', function (Blueprint $table) {
            $table->id();
            $table->string('username');
            $table->unsignedBigInteger('template_id');
            $table->text('message')->nullable();
            $table->string('broadcast_name')->nullable(); //nullable added by me
            $table->string('broadcast_number')->nullable();
            $table->date('schedule_date')->nullable(); //nullable added by me
            $table->time('schedule_time')->nullable(); //nullable added by me
            $table->text('contacts')->nullable(); //nullable added by me
            // $table->date('created_at')->nullable(); //nullable added by me
            $table->integer('status')->default(0)->nullable();//nullable added by me
            $table->string('success_full_per', 45)->default(0)->nullable();//nullable added by me
            $table->text('media1')->nullable();
            $table->text('media2')->nullable();
            $table->text('media3')->nullable();
            $table->text('media4')->nullable();
            $table->text('media5')->nullable();
            $table->text('media6')->nullable();
            $table->text('media7')->nullable();
            $table->text('media8')->nullable();
            $table->text('broadcast_message')->nullable();
            $table->string('lineCount', 50)->nullable();
            $table->string('group_table_length', 50)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('_broadcast_trails');
    }
};
