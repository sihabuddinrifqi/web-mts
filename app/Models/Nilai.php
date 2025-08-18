<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class Nilai extends Model
{
    use HasFactory;

    protected $fillable = [
    // 'nilai', 
    'semester', 
    'pelajaran_id', 
    'siswa_id'];

    public function pelajaran()
    {
        return $this->belongsTo(Pelajaran::class, 'pelajaran_id');
    }

    public function siswa()
    {
        return $this->belongsTo(Siswa::class, 'siswa_id');
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

    public function detail()
{
    return $this->hasMany(NilaiDetail::class, 'nilai_id');
}

}
