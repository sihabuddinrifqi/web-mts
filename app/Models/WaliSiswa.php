<?php

namespace App\Models;
use Parental\HasParent;

class WaliSiswa extends User
{
    use HasParent;
    
    protected $fillable = ['alamat', 'jenis_kelamin'];

    public function anak()
    {
        return $this->hasMany(Siswa::class, 'ortu_id');
    }
}
