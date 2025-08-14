<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'admin',
            'email' => 'admin@localhost.com',
            'password' => bcrypt('password'), // default password
            'role' => 'admin',
            'alamat' => 'address',
            'phone' => '+62087654321',
            'username' => 'admin'
        ]);
        $guru1 = User::factory()->create([
            'name' => 'guru',
            'email' => 'guru@localhost.com',
            'password' => bcrypt('password'), // default password
            'role' => 'guru',
            'alamat' => 'address',
            'phone' => '+6298765230',
            'username' => 'guru'
        ]);
        $wali1 = User::factory()->create([
            'name' => 'walisiswa',
            'email' => 'walisiswa@localhost.com',
            'password' => bcrypt('password'), // default password
            'role' => 'walisiswa',
            'alamat' => 'address',
            'phone' => '+1-2233-4523-42',
            'username' => 'walisiswa'
        ]);
        // Create 5 guru
        $guruFact = User::factory()->count(3)->guru()->create();
        // Create 10 wali
        $walisFact = User::factory()->count(3)->walisiswa()->create();
        
        $guru = $guruFact->push($guru1);
        $walis = $walisFact->push($wali1);
        // Create 30 siswa and link them
        User::factory()->count(50)->siswa()->make()->each(function ($siswa) use ($guru, $walis) {
            $siswa->guru_id = $guru->random()->id;
            $siswa->ortu_id = $walis->random()->id;
            $siswa->save();
        });
    }
}
