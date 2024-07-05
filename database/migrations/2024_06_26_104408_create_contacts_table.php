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
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->string('contact_name')->nullable();
            $table->string('contact_mobile_number')->nullable();
            $table->string('Contact_email_address')->nullable();
            $table->boolean('is_active')->nullable(); //nullable added by me
            $table->unsignedBigInteger('Contact_group_id');
            $table->string('added_by', 30);
            $table->timestamps();

            $table->foreign('Contact_group_id')
                ->references('id')->on('groups')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};
