<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Http\Request;
use Illuminate\Notifications\Notifiable;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Parental\HasChildren;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasChildren;

    /**
     * Kolom yang bisa diisi (mass assignable).
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'jenis_kelamin', 
        'username',
        'role',
        'first_password',
        'ortu_id', // penting untuk relasi wali-anak
    ];

    /**
     * Konfigurasi inheritance untuk role anak class.
     */
    protected $childColumn = 'role';

    protected $childTypes = [
        'guru'      => Guru::class,
        'siswa'     => Siswa::class,
        'walisiswa' => WaliSiswa::class,
        'admin'     => Admin::class,
    ];

    /**
     * Kolom yang disembunyikan saat serialisasi.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Konversi otomatis tipe data kolom.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    // ==========================
    // Relasi
    // ==========================

    /**
     * Relasi ke presensi (jika user adalah siswa).
     */
    public function presensi()
    {
        return $this->hasMany(Presensi::class, 'siswa_id');
    }

    /**
     * Relasi ke anak-anak (jika user adalah wali).
     */
    public function anak()
    {
        return $this->hasMany(User::class, 'ortu_id');
    }

    /**
     * Relasi ke wali (jika user adalah siswa).
     */
    public function wali()
    {
        return $this->belongsTo(User::class, 'ortu_id');
    }

    // ==========================
    // Custom Methods
    // ==========================

    /**
     * Custom login method pakai nomor HP.
     */
    public static function loginWithPhone(string $phone, string $password): bool
    {
        $user = self::where('phone', $phone)->first();

        if ($user && Hash::check($password, $user->password)) {
            Auth::login($user);
            return true;
        }

        return false;
    }

    /**
     * Pagination dengan pencarian fleksibel.
     */
    public static function paginateWithSearch(
        Request $request,
        array $searchable = ['name'],
        array $relations = [],
    ): LengthAwarePaginator {
        $page   = $request->query('page', 1);
        $limit  = $request->query('limit', 10);
        $search = $request->query('search', '');

        $query = static::query()->with($relations);

        if ($search && !empty($searchable)) {
            $query->where(function ($q) use ($search, $searchable) {
                foreach ($searchable as $field) {
                    $q->orWhere($field, 'like', "%{$search}%");
                }
            });
        }

        $result = $query->paginate($limit, ['*'], 'page', $page);

        abort_if($result->isEmpty(), 404, 'No records found');

        return $result;
    }

    /**
     * Generate username unik berdasarkan nama depan.
     */
    public static function generateUsername(string $name, string $role): string
    {
        $base     = Str::lower(explode(' ', $name)[0]);
        $username = $base;
        $counter  = 1;

        while (self::where('username', $username)->exists()) {
            $username = $base . $counter;
            $counter++;
        }

        return $username;
    }
}
