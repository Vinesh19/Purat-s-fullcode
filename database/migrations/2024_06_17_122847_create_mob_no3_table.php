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
        Schema::create('mob_no3', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('receiver')->nullable(); //nullable added by me
            $table->string('whatsappid', 500)->comment('0=webhook not triggered')->nullable(); //nullable added by me
            $table->string('senderid', 500)->nullable(); //nullable added by me
            $table->string('senderpwd', 100)->nullable(); //nullable added by me
            $table->string('name', 50)->collation('utf8mb4_unicode_ci')->nullable(); //nullable added by me
            $table->string('username', 50);
            $table->string('reseller', 50)->nullable(); //nullable added by me
            $table->string('masterreseller', 1000)->nullable()->collation('utf8mb4_unicode_ci')->comment('response or id');
            $table->string('status', 250)->nullable(); //nullable added by me
            $table->string('dat', 30)->nullable(); //nullable added by me
            $table->string('tim', 30)->nullable(); //nullable added by me
            $table->string('credits', 10)->nullable(); //nullable added by me
            $table->string('request_id', 30);
            $table->string('delivery_time', 30)->nullable(); //nullable added by me
            $table->string('delivery_date')->nullable(); //nullable added by me//datetime into string by me
            $table->string('template_id', 100);
            // $table->unsignedBigInteger('template_id2');
            $table->string('message')->nullable()->collation('utf8mb4_unicode_ci'); //Changed to TEXT for potentially large content
            $table->string('schedule_date');
            $table->time('schedule_time');
            $table->string('success_full_per', 45)->default('0')->comment('3=fake, 0=real, 1=scrub pending');
            $table->string('media1')->nullable()->collation('utf8mb4_unicode_ci'); //Changed to TEXT for potentially large content
            $table->string('media2')->nullable()->collation('utf8mb4_unicode_ci'); //Changed to TEXT for potentially large content
            $table->string('media3')->nullable()->collation('utf8mb4_unicode_ci'); //Changed to TEXT for potentially large content
            $table->string('media4')->nullable()->collation('utf8mb4_unicode_ci'); //Changed to TEXT for potentially large content
            $table->string('media5')->nullable()->collation('utf8mb4_unicode_ci'); //Changed to TEXT for potentially large content
            $table->string('media6')->nullable()->collation('utf8mb4_unicode_ci'); //Changed to TEXT for potentially large content
            $table->string('media7')->nullable()->collation('utf8mb4_unicode_ci'); //Changed to TEXT for potentially large content
            $table->text('media8')->nullable()->collation('utf8mb4_unicode_ci'); //Changed to TEXT for potentially large content
            $table->text('media9')->nullable()->collation('utf8mb4_unicode_ci'); //Changed to TEXT for potentially large content
            $table->text('media10')->nullable()->collation('utf8mb4_unicode_ci'); //Changed to TEXT for potentially large content
            $table->text('media11')->nullable()->collation('utf8mb4_unicode_ci'); //Changed to TEXT for potentially large content
            $table->string('media12', 100)->nullable(); //nullable added by me
            $table->string('media13', 500)->nullable(); //nullable added by me
            $table->longText('base64')->nullable(); //nullable added by me
            $table->string('button1_value', 100)->nullable(); //nullable added by me
            $table->string('button2_value', 100)->nullable(); //nullable added by me
            $table->string('button3_value', 100)->nullable(); //nullable added by me
            $table->string('call_title', 100)->nullable(); //nullable added by me
            $table->string('call_number', 100)->nullable(); //nullable added by me
            $table->string('url_title', 100)->nullable(); //nullable added by me
            $table->string('url_value', 100)->nullable(); //nullable added by me
            $table->string('text', 1100)->collation('utf8mb4_unicode_ci')->comment('footer')->nullable(); //nullable added by me
            $table->timestamps();

            $table->foreign('username')->references('username')->on('ci_admin')->onDelete('cascade')->onUpdate('cascade');
            // $table->foreign('template_id2')->references('id')->on('templates')->onDelete('cascade');
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mob_no3');
    }
};
