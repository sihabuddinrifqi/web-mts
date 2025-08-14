<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pelajaran;

class PelajaranSeeder extends Seeder
{
    public function run()
    {
        Pelajaran::factory()->count(10)->create();
    }
}
