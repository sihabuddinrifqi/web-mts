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
        Schema::create('izins', function (Blueprint $table) {
            $table->id();
            $table->text('message');
            $table->timestamp('tanggal_pulang');
            $table->timestamp('tanggal_kembali')->nullable(); 
            $table->unsignedBigInteger('created_by');         // wali
            $table->unsignedBigInteger('target_siswa_id');   // siswa
            $table->unsignedBigInteger('opened_by')->nullable(); // guru
            $table->enum('status', ['accepted', 'rejected'])->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->timestamps();

            // Foreign keys
            $table->foreign('created_by')->references('id')->on('users');
            $table->foreign('target_siswa_id')->references('id')->on('users');
            $table->foreign('opened_by')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('izins');
    }
};
