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
        Schema::create('chat_messages', function (Blueprint $table) {
            $table->id();
            $table->string('username', 100);
            $table->string('sender_id', 20); //yaha core php me index dala hua tha
            $table->string('receiver_id', 20); //yaha core php me index dala hua tha
            $table->integer('status')->comment('1= pending, 2 = success, 3=failed, 4=webhook not set');
            $table->string('agent', 100);
            $table->string('previous_agent', 100);
            $table->integer('first_message')->default(0)->comment('open, pending, solved, spam');
            $table->mediumText('eventDescription')->comment('Outbound (broadcast)/Inbound(initialized)');
            $table->string('replySourceMessage', 500);
            $table->text('text');
            // $table->text('text')->charset('utf8mb4')->collation('utf8mb4_unicode_ci'); //in old table Specified charset and collation
            $table->mediumText('type');
            // $table->dateTime('date');
            // $table->dateTime('timestamp');
            // $table->dateTime('created')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->string('eventtype', 100)->comment('Broadcast=outgoing/message=incoming');
            $table->string('whts_ref_id', 200);
            $table->timestamps(); //s-sir se puchkar liya
            $table->foreign('username')
                ->references('username')->on('ci_admin')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat_messages');
    }
};
