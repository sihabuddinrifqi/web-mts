<?php

namespace App\Models; // Or App\Models

use Illuminate\Database\Eloquent\Model;

class NilaiDetail extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'nilai_detail'; // Sesuaikan jika nama tabel Anda berbeda

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'nilai_id',
        'jenis', // 'UH', 'PTS', atau 'PAS'
        'nilai',
    ];

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false; // Detail nilai biasanya tidak butuh created_at/updated_at
}