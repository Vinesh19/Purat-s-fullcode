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
        Schema::create('templates', function (Blueprint $table) {
            $table->id();
            $table->string('username');
            $table->string('template_name');
            $table->string('reason');
            $table->integer('category');
            $table->string('new_category', 100);
            $table->integer('language')->comment('1 = en_US, 13 = en_GB, 14 = en');
            $table->text('header_area_type');
            $table->text('header_text')->charset('utf8mb4')->collation('utf8mb4_unicode_ci')->nullable(); //add nulable from my side
            $table->string('header_media_type')->nullable();
            $table->text('header_media_set')->nullable(); //add nulable from my side
            $table->string('template_body', 2000)->nullable()->charset('utf8mb4')->collation('utf8mb4_unicode_ci');
            $table->string('template_footer', 255)->nullable()->charset('utf8mb4')->collation('utf8mb4_unicode_ci');
            $table->string('button_type_set')->nullable();
            $table->string('call_action_type_set1')->nullable();
            $table->string('call_action_type_set2')->nullable();
            $table->string('call_phone_btn_text')->nullable();
            $table->string('call_phone_btn_phone_number')->nullable();
            $table->string('visit_website_btn_text')->nullable();
            $table->string('visit_website_url_set')->nullable()->comment('static,dynamic');
            $table->string('visit_website_url_text')->nullable();
            $table->string('quick_reply_btn_text1')->nullable()->charset('utf8mb4')->collation('utf8mb4_unicode_ci');
            $table->string('quick_reply_btn_text2')->nullable()->charset('utf8mb4')->collation('utf8mb4_unicode_ci');
            $table->string('quick_reply_btn_text3')->nullable()->charset('utf8mb4')->collation('utf8mb4_unicode_ci');
            $table->dateTime('created_at')->default(now());
            $table->date('updated_at')->nullable();
            $table->integer('status')->default(0);
            $table->string('template_id', 100);

            // $table->primary('id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('templates');
    }
};
