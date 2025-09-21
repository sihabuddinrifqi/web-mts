<?php

namespace App\Models;
use Parental\HasParent;

class Guru extends User
{
    use HasParent;

    protected $fillable = ['jenis_kelamin', 'pendidikan_terakhir'];

    public function pelajaran()
    {
        return $this->hasMany(Pelajaran::class, 'pengampu_id');
    }

    public function anak()
    {
        return $this->hasMany(Siswa::class, 'guru_id');
    }

    
}
