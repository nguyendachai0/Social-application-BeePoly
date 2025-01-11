<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('user_roles', function (Blueprint $table) {
            $table->id()->first(); // Add the 'id' column as the first column
        });

        Schema::table('user_roles', function (Blueprint $table) {
            $table->dropPrimary(['user_id', 'role_id']); // Drop the composite primary key
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('user_roles', function (Blueprint $table) {
            $table->dropColumn('id'); // Drop the 'id' column
            $table->primary(['user_id', 'role_id']); // Restore the composite primary key
        });
    }
};
