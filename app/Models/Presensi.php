<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Presensi extends Model
{
    use HasFactory;

    protected $fillable = [
        'pelajaran_id',
        'guru_id',
        'siswa_id',
        'tanggal',
        'status',
    ];

    protected $casts = [
        'status' => 'string',
        'tanggal' => 'date',
    ];

    /**
     * Relasi ke pelajaran
     */
    public function pelajaran()
    {
        return $this->belongsTo(Pelajaran::class, 'pelajaran_id');
    }

    /**
     * Relasi ke guru (user dengan role = guru)
     */
    public function guru()
    {
        return $this->belongsTo(User::class, 'guru_id');
    }

    /**
     * Relasi ke siswa
     */
    public function siswa()
    {
        return $this->belongsTo(Siswa::class, 'siswa_id');
    }
}
