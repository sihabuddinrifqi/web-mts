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
    Schema::table('pelajarans', function (Blueprint $table) {
        $table->timestamp('waktu')->default(DB::raw('CURRENT_TIMESTAMP'))->change();
    });
}

public function down(): void
{
    Schema::table('pelajarans', function (Blueprint $table) {
        $table->timestamp('waktu')->nullable(false)->change();
    });
}

};
