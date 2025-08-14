<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
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
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasChildren;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'username',
        'role',
        'first_password'
    ];
    protected $childColumn = 'role';
    protected $childTypes = [
        'guru' => Guru::class,
        'siswa' => Siswa::class,
        'walisiswa' => WaliSiswa::class,
        'admin' => Admin::class
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Custom login method to authenticate user using phone number and password.
     *
     * @param string $phone
     * @param string $password
     * @return bool
     */
    public static function loginWithPhone(string $phone, string $password): bool
    {
        // Attempt to locate the user by phone number.
        $user = self::where('phone', $phone)->first();

        // Check if user exists and the password is correct.
        if ($user && Hash::check($password, $user->password)) {
            // Log the user in using Laravel's Auth facade.
            Auth::login($user);
            return true;
        }

        return false;
    }

    public static function paginateWithSearch(
        Request $request,
        array $searchable = ['name'],
        array $relations = [],
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
