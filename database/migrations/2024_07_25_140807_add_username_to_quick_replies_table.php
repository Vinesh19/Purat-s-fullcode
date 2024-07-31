<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddUsernameToQuickRepliesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('quick_replies', function (Blueprint $table) {
            $table->string('username')->after('id'); // Adds the username column after the id column
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('quick_replies', function (Blueprint $table) {
            $table->dropColumn('username');
        });
    }
}
