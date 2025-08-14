<?php
// database/seeders/IzinSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Izin;
use App\Models\User;
use Illuminate\Support\Carbon;

class IzinSeeder extends Seeder
{
    public function run()
    {
        $siswas = User::where('role', 'siswa')->get();
        $walis = User::where('role', 'walisiswa')->get();
        $gurus = User::where('role', 'guru')->get();

        foreach (range(1, 20) as $i) {
            $siswa = $siswas->random();
            $wali = $walis->where('id', $siswa->ortu_id)->first();
            $guru = $gurus->where('id', $siswa->guru_id)->first();

            $createdAt = Carbon::now()->subDays(rand(1, 30));
            $tanggalPulang = $createdAt->copy()->addDays(1);
            $tanggalKembali = $tanggalPulang->copy()->addDays(rand(1, 5));

            Izin::create([
                'message' => "Mohon izin pulang untuk keperluan keluarga",
                'created_by' => $wali->id ?? $walis->random()->id,
                'target_siswa_id' => $siswa->id,
                'opened_by' => rand(0, 1) ? $guru?->id : null,
                'status' => rand(0, 1) ? 'accepted' : null,
                'closed_at' => rand(0, 1) ? $createdAt->copy()->addDays(2) : null,
                'created_at' => $createdAt,
                'tanggal_pulang' => $tanggalPulang,
                'tanggal_kembali' => $tanggalKembali,
            ]);
        }
    }
}
