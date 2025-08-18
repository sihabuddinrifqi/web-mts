<?php

namespace Database\Factories;

use App\Models\Pelajaran;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Nilai>
 */
class NilaiFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'nilai' => $this->faker->randomFloat(2, 50, 100),
            'nilai_detail' => $this->faker->randomFloat(2, 50, 100),
            'semester' => rand(1, 6),
            'pelajaran_id' => Pelajaran::inRandomOrder()->first()->id,
            'siswa_id' => User::where('role', 'siswa')->inRandomOrder()->first()->id,
        ];
    }
}
