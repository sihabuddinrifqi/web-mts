<?php

namespace App\Models;
use Parental\HasParent;

class Siswa extends User
{
    use HasParent;

    protected $fillable = [
        'nis', 'name', 'nik', 'alamat', 'angkatan', 'jenis_kelamin', 'siswa_role', 'tempat_lahir', 'tanggal_lahir', 'guru_id', 'ortu_id'
    ];

    public function nilai()
    {
        return $this->hasMany(Nilai::class, 'siswa_id');
    }

    public function guru()
    {
        return $this->belongsTo(Guru::class, 'guru_id');
    }

    public function ortu()
    {
        return $this->belongsTo(WaliSiswa::class, 'ortu_id');
    }

    static function generateNis(int $angkatan){
        $latestSiswa = static::where('angkatan', $angkatan)
        ->orderBy('nis', 'desc')
        ->first();

        $lastNumber = $latestSiswa 
            ? (int) substr($latestSiswa->nis, -5) 
            : 0;

        $newNumber = str_pad($lastNumber + 1, 5, '0', STR_PAD_LEFT);
        return $angkatan . $newNumber;
    }

    public function presensis()
{
    return $this->hasMany(Presensi::class, 'siswa_id');
}

}