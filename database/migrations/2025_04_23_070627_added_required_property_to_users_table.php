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
        Schema::table('users', function (Blueprint $table) {
            $table->string('alamat')->nullable();
            // Siswa-specific
            $table->string('nis')->unique()->nullable(); // format: angkatan_nodaftar
            $table->bigInteger('nik')->unique()->nullable();
            $table->string('tempat_lahir')->nullable();
            $table->timestamp('tanggal_lahir')->nullable();
            $table->year('angkatan')->nullable();
            $table->enum('jenis_kelamin', ['pria', 'wanita'])->nullable();
            $table->enum('siswa_role', ['regular', 'pengurus'])->nullable();
            $table->unsignedBigInteger('ortu_id')->nullable();    // wali
            $table->unsignedBigInteger('guru_id')->nullable();  // pembimbing
            
            // Foreign keys for relationships
            $table->foreign('ortu_id')->references('id')->on('users')->nullOnDelete();
            $table->foreign('guru_id')->references('id')->on('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['ortu_id']);
            $table->dropForeign(['guru_id']);

            $table->dropColumn([
                'role', 'alamat', 'nis', 'angkatan',
                'jenis_kelamin', 'ortu_id', 'guru_id'
            ]);
        });
    }
};
