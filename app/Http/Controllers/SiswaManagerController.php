<?php

namespace App\Http\Controllers;

use App\Http\Requests\Siswa\SiswaStoreRequest;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule; // Pastikan Rule di-import

class SiswaManagerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('admin/siswa', [
            'prop' => Siswa::paginateWithSearch($request, ['name'], ['ortu'])
        ]);
    }

    public function api(Request $request)
    {
        return response()->json(Siswa::paginateWithSearch($request, ['name'], ['ortu']));
    }

    public function angkatan(string $angkatan) {
        $query = Siswa::query()->where('angkatan', $angkatan)->with('ortu');
        $result = $query->get();
        return response()->json(
            [
                'code' => !$result->isEmpty() ? 200 : 404,
                'message' => !$result->isEmpty() ? 'successfully getting siswa angkatan ' . $angkatan : 'data not found',
                'data' => $result,
                'received' => $result->count(),
            ], !$result->isEmpty() ? 200 : 404
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SiswaStoreRequest $request)
{
    $validated = $request->validated();

    // Tambahkan validasi manual jika SiswaStoreRequest belum mencakup guru_id dan ortu_id
    $request->validate([
        'guru_id' => [
            'required',
            'integer',
            Rule::exists('users', 'id')->where(fn ($q) => $q->where('role', 'guru')),
        ],
        'ortu_id' => [
            'required',
            'integer',
            Rule::exists('users', 'id')->where(fn ($q) => $q->where('role', 'walisiswa')),
        ],
    ]);

    $password = Str::random(8);
    $validated['password'] = bcrypt($password);
    $validated['first_password'] = $password;
    $validated['nis'] = Siswa::generateNis($validated['angkatan']);
    $validated['username'] = $validated['nis'];
    $validated['role'] = 'siswa';

    // Simpan dengan guru_id & ortu_id
    Siswa::create($validated);

    return redirect(route('admin.siswa.index'))
        ->with('success', 'Data siswa berhasil ditambahkan.');
}

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Siswa $siswa)
    {
        // GANTI BAGIAN VALIDASI INI DENGAN YANG LEBIH LENGKAP
        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'nik'           => ['required', 'string', 'size:16', Rule::unique('users', 'nik')->ignore($siswa->id)],
            'alamat'        => 'required|string',
            'tempat_lahir'  => 'required|string',
            'tanggal_lahir' => 'required|date',
            'angkatan'      => 'required|integer',
            'jenis_kelamin' => 'required|in:pria,wanita',
            'siswa_role'    => 'required|in:regular,pengurus',
            
            // Validasi guru_id dengan benar
            'guru_id' => [
                'required',
                'integer',
                // Periksa tabel 'users' pada kolom 'id', DAN pastikan kolom 'role' adalah 'guru'
                Rule::exists('users', 'id')->where(function ($query) {
                    return $query->where('role', 'guru');
                }),
            ],

            // Validasi ortu_id dengan benar
            'ortu_id' => [
                'required',
                'integer',
                // Periksa tabel 'users' pada kolom 'id', DAN pastikan kolom 'role' adalah 'walisiswa'
                Rule::exists('users', 'id')->where(function ($query) {
                    return $query->where('role', 'walisiswa');
                }),
            ],
        ]);

        // Lakukan pembaruan data
        $siswa->update($validated);

        // Redirect kembali ke halaman sebelumnya
        return redirect()->back()->with('success', 'Data siswa berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Siswa $siswa)
    {
        $siswa->delete();
        return redirect(route('admin.siswa.index'));
    }
}