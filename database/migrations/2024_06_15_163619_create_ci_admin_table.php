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
        Schema::create('ci_admin', function (Blueprint $table) {
            // $table->id();

            // $table->string('email_otp')->nullable();
            // $table->timestamp('email_otp_verified_at')->nullable();
            // $table->rememberToken();
            // $table->timestamps();
            // $table->string('fname', 45);
            // $table->string('lname', 45);
            // $table->string('email')->unique();
            // $table->string('number')->unique();
            // $table->string('user_name', 45)->unique();
            // $table->string('password', 255);


            $table->id('admin_id');
            $table->integer('admin_role_id')->default(2);
            $table->string('username')->unique();//unique added by me(in old table unique was mention in the )
            $table->string('usertype')->nullable();
            $table->string('whatsapp')->default('1')->comment('if 0 Whatsapp hide the service');
            $table->string('whatsapp_credits')->default('5')->comment('incoming whatsapp credits');
            $table->string('sms')->default('1')->comment('if 0 hide the service');
            $table->string('sms_credits')->nullable();
            $table->string('voice_credits')->default('5');
            $table->string('email_credits')->nullable()->comment('Whatsapp Prime Credits');
            $table->string('api_credits')->nullable();
            $table->string('gsm_credits')->default('5');
            $table->string('whatsapp_virtual_credits')->default('0')->comment('Business Whatsapp Credits');
            $table->string('sms_virtual_credits')->nullable()->comment('Whatsapp Voice Calls Credits');
            $table->string('overseas_credits')->default('5');
            $table->string('misscall')->nullable()->comment('For Keyword=1');
            $table->string('misscall_credits')->nullable()->comment('Scrub Credits');
            $table->string('voice')->default('1');
            $table->string('email_bulk')->default('1')->comment('If 1 whatsapp prime is active');
            $table->string('api_whatsapp')->nullable()->comment('API Credits');
            $table->string('gsm')->default('1');
            $table->string('whatsapp_virtual')->default('1')->comment('Activate Business Whatsapp & API = 1');
            $table->string('sms_virtual')->nullable()->comment('Activate official whatsapp = 1');
            $table->string('overseas_sms')->default('1');
            $table->string('chat')->nullable()->comment('Reseller Dahboard');
            $table->string('country')->nullable();
            $table->string('firstname', 45); //nulable removed by me
            $table->string('lastname', 45); //nulable removed by me
            $table->string('password', 255); //was nullable in old table
            $table->string('email')->nullable()->unique(); //unique added by me
            $table->string('mobile_no')->nullable()->unique(); //unique added by me
            $table->string('msgtype')->nullable();
            $table->string('senderid')->nullable()->comment('Customer gstin');
            $table->string('dummy_credits')->nullable();
            $table->string('txt_balance')->nullable()->comment('Insternational sms credits');
            $table->string('route')->nullable()->comment('quality of number');
            $table->string('status')->nullable();
            $table->string('Reseller')->nullable();//nullable added by me
            $table->string('MasterReseller')->nullable();
            $table->string('delivery_type')->default('10000')->comment('Limit of user like 10,10');
            $table->string('ndncstatus')->nullable()->comment('2=SMS in API ELSE NULL');
            $table->string('dummy_credits_api')->nullable()->comment('incoming whatsapp credits');
            $table->string('api_user')->nullable()->comment('sms or whatsapp');
            $table->string('api_status')->default('0')->comment('0= under 15 number, 1 = send to wa2 else 0. 2=wa2, 3=cloud, 4=ratio');
            $table->string('expiry')->nullable()->comment('Bypass Credits');
            $table->string('authkey')->default('0.05')->comment('random send');
            $table->string('authkey1')->default('0.97')->comment('random sent');
            $table->dateTime('last_login')->default(now());
            $table->tinyInteger('is_verify')->default(1);
            $table->tinyInteger('is_admin')->default(1);
            $table->tinyInteger('is_active')->default(0);
            $table->tinyInteger('is_super')->default(0);
            $table->string('token')->nullable();//nullable added by me
            $table->string('password_reset_code')->nullable();//nullable added by me
            $table->string('last_ip')->nullable();//nullable added by me
            $table->dateTime('created_at')->default(now());
            $table->dateTime('updated_at')->default(now());
            $table->integer('serss')->default(1);
            $table->tinyInteger('is_notify_visible')->default(1);

            // $table->primary('admin_id');
            // $table->unique('username', 'username_3');
            // $table->unique('username_3');
            $table->index('username');
            $table->index('Reseller');
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ci_admin');
    }
};
