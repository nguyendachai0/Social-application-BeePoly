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
        Schema::table('notifications', function (Blueprint $table) {
            $table->unsignedBigInteger('reaction_id')->nullable()->after('status');
            $table->foreign('reaction_id')
                ->references('id')->on('reactions') // points to the reactions table
                ->onDelete('set null'); // Delete the notification if the reaction is deleted (or use 'cascade' depending on your needs)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            $table->dropForeign(['reaction_id']);
            $table->dropColumn('reaction_id');
        });
    }
};
