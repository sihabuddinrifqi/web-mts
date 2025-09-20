<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class Pelajaran extends Model
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     *
     * [PERBAIKAN] Menambahkan 'angkatan' ke dalam daftar yang diizinkan
     * agar bisa diupdate dari controller.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nama_pelajaran',
        'semester',
        'pengampu_id',
        'angkatan', // Ditambahkan
        'waktu',    // Ditambahkan untuk konsistensi dengan fungsi store
    ];

    /**
     * Relasi ke Guru yang mengajar pelajaran ini.
     */
    public function pengampu()
    {
        return $this->belongsTo(User::class, 'pengampu_id');
    }

    /**
     * Relasi ke semua nilai yang terkait dengan pelajaran ini.
     */
    public function nilai()
    {
        return $this->hasMany(Nilai::class, 'pelajaran_id');
    }
    
    /**
     * Relasi ke semua siswa yang mengambil pelajaran ini (melalui tabel nilai).
     */
    public function siswa()
    {
        return $this->belongsToMany(
            Siswa::class,
            'nilais',       // Nama tabel pivot
            'pelajaran_id', // Foreign key di tabel pivot untuk Pelajaran
            'siswa_id'      // Foreign key di tabel pivot untuk Siswa
        );
    }

    /**
     * Relasi ke semua presensi yang terkait dengan pelajaran ini.
     */
    public function presensis()
    {
        return $this->hasMany(Presensi::class);
    }

    /**
     * Fungsi helper untuk paginasi dengan pencarian.
     */
    public static function paginateWithSearch(
        Request $request,
        array $searchable = [],
        array $relations = []
    ): LengthAwarePaginator {
        $page = $request->query('page', 1);
        $limit = $request->query('limit', 10);
        $search = $request->query('search', '');
        
        $query = static::query()->with($relations);

        if ($search && !empty($searchable)) {
            $query->where(function($q) use ($search, $searchable) {
                foreach ($searchable as $field) {
                    $q->orWhere($field, 'like', "%{$search}%");
                }
            });
        }
        
        $result = $query->paginate($limit, ['*'], 'page', 'page');
        
        // Menggunakan request->expectsJson() untuk menghindari abort pada API call
        if ($result->isEmpty() && !$request->expectsJson()) {
            abort(404, 'No records found');
        }

        return $result;
    }
}

