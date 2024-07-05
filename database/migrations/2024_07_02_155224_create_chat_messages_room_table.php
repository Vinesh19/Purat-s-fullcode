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
        Schema::create('chat_messages_room', function (Blueprint $table) {
            $table->id('id'); // Laravel automatically handles NOT NULL for primary keys
            $table->string('sender_id', 255)->nullable()->collation('utf8mb4_unicode_ci');
            $table->string('receiver_id', 255)->nullable()->collation('utf8mb4_unicode_ci');
            $table->tinyInteger('status')->comment('0=open, 1=expired, 2=pending, 3=solved, 4=spam');
            $table->tinyInteger('is_starred')->default(0)->comment('0=no, 1=yes');
            $table->string('username', 255);

            $table->foreign('username')->references('username')->on('ci_admin')->onDelete('cascade')->onUpdate('cascade');
            // $table->foreign('receiver_id')->references('receiver_id')->on('chat_messages')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat_messages_room');
    }
};
