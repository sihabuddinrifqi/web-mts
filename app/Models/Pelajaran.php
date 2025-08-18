<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class Pelajaran extends Model
{
    use HasFactory;
    
    protected $fillable = ['nama_pelajaran', 'semester', 'pengampu_id'];

    public function siswa()
{
    // Pastikan nama tabel pivot benar ('nilai') dan kolom foreign key sesuai
    return $this->belongsToMany(
        User::class,       // Model Siswa, bisa juga App\Models\Siswa jika ada
        'nilais',           // Tabel pivot
        'pelajaran_id',    // FK di tabel pivot yang mengacu ke pelajaran
        'siswa_id'         // FK di tabel pivot yang mengacu ke siswa
    );
}


    public function pengampu() // Guru who teaches
    {
        return $this->belongsTo(Guru::class, 'pengampu_id');
    }

    public function nilai()
    {
        return $this->hasMany(Nilai::class, 'pelajaran_id');
    }

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
        
        $result = $query->paginate($limit, ['*'], 'page', $page);
        abort_if($result->isEmpty(), 404, 'No records found');
        return $result;
    }

    public function presensis()
{
    return $this->hasMany(Presensi::class);
}

}
