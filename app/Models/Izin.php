<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class Izin extends Model
{
    use HasFactory;

    protected $fillable = [
        'message',
        'photo',
        'tanggal_pulang',
        'tanggal_kembali',
        'created_by',
        'target_siswa_id',
        'opened_by',
        'status',
        'closed_at',
    ];

    protected $casts = [
        'tanggal_pulang' => 'datetime',
        'tanggal_kembali' => 'datetime',
        'closed_at' => 'datetime',
    ];

    // Created by WaliSiswa
    public function createdBy()
    {
        return $this->belongsTo(WaliSiswa::class, 'created_by');
    }

    // Target Siswa
    public function targetSiswa()
    {
        return $this->belongsTo(Siswa::class, 'target_siswa_id');
    }

    // Opened (approved/rejected) by Guru
    public function openedBy()
    {
        return $this->belongsTo(Guru::class, 'opened_by');
    }
    public static function paginateWithSearch(
        Request $request,
        array $searchable = [],
        array $relations = ['createdBy', 'targetSiswa']
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
}
