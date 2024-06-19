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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('fname', 45);
            $table->string('lname', 45);
            $table->string('email')->unique();
            $table->string('number')->unique();
            $table->string('user_name', 45)->unique();
            $table->string('password', 255);
            $table->string('email_otp')->nullable();
            $table->timestamp('email_otp_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
            $table->unsignedBigInteger('broadcast_id')->nullable();
            $table->foreign('broadcast_id')->references('id')->on('broadcast_outputs')
                ->onDelete('cascade')->onUpdate('cascade'); // cascade delete
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
