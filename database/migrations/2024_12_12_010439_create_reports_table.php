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
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reporting_user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('reported_user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->foreignId('reported_post_id')->nullable()->constrained('posts')->onDelete('cascade');
            $table->foreignId('reported_comment_id')->nullable()->constrained('comments')->onDelete('cascade');
            $table->enum('report_type', ['spam', 'abuse', 'inappropriate_content'])->default('spam');
            $table->text('details')->nullable();
            $table->enum('status', ['pending', 'reviewed', 'resolved'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
