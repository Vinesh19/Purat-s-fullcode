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
        Schema::create('assign_users', function (Blueprint $table) {
            $table->id();
            $table->string('username');
            $table->string('assign_user');
            $table->tinyInteger('roll')->default(0)->comment('0=trial, 1= , 2= , 3=');
            $table->string('agent_email')->nullable();
            $table->tinyInteger('is_email_verified')->default(0);
            $table->string('agent_mobile')->nullable();
            $table->tinyInteger('is_mobile_verified')->default(0);
            $table->string('online_status');
            $table->timestamp('last_login_at')->nullable();
            $table->string('last_login_IP')->nullable();
            $table->string('team')->default('all_team');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assign_users');
    }
};
