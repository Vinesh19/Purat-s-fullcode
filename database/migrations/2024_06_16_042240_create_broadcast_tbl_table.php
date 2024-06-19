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
        Schema::create('broadcast_tbl', function (Blueprint $table) {
            $table->id();
            $table->string('username');
            $table->unsignedBigInteger('template_id');
            $table->text('message')->nullable();
            $table->string('broadcast_name');
            $table->string('broadcast_number')->nullable();
            $table->date('schedule_date');
            $table->time('schedule_time');
            $table->text('contacts');
            $table->date('created_at');
            $table->integer('status')->default(0);
            $table->string('success_full_per', 45)->default('0');
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

            $table->foreign('template_id')->references('id')->on('templates')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('username')->references('username')->on('ci_admin')->onDelete('cascade')->onUpdate('cascade');

            // $table->primary('id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('broadcast_tbl');
    }
};
