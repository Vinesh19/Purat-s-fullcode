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
        Schema::create('campaign_details', function (Blueprint $table) {
            $table->id();
            $table->string('username', 200);
            $table->string('senderid', 200);
            $table->string('request_id', 200); //nullable added by me
            $table->string('Reseller', 200)->nullable(); //nullable added by me
            $table->string('dat', 200)->nullable(); //nullable added by me
            $table->string('estimated_time', 200)->nullable(); //nullable added by me
            $table->string('date', 100)->nullable(); //nullable added by me
            $table->string('status', 200)->default('pending');
            $table->string('numbers', 200);
            $table->string('queue_no', 200); //nullable added by me
            $table->timestamps(); // Adds created_at and updated_at columns

            $table->foreign('username')->references('username')->on('ci_admin')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campaign_details');
    }
};
