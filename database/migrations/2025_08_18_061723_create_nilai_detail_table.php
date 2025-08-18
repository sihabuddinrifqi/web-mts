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
        Schema::create('nilai_detail', function (Blueprint $table) {
        $table->id();
        $table->foreignId('nilai_id')
            ->constrained('nilais')
            ->onDelete('cascade');
        $table->enum('jenis', ['UH', 'PTS', 'PAS']);
        $table->integer('nilai')->nullable();
        $table->timestamps();
    });

}

public function down()
{
    Schema::dropIfExists('nilai_detail');
}

};
