<?php

namespace App\Http\Controllers;

use App\Http\Requests\Guru\GuruStoreRequest;
use App\Models\User; // Guru tersimpan di tabel users
use App\Models\Pelajaran;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class GuruManagerController extends Controller
{
    // ... (fungsi index, api, detail, dan store tetap sama) ...
    public function index(Request $request)
    {
        $prop = User::where('role', 'guru')
            ->withCount('siswaDidik') 
            ->paginate(10)
            ->appends($request->all());

        return Inertia::render('admin/guru', [
            'prop' => $prop
        ]);
    }

    public function api(Request $request)
    {
        $guru = User::where('role', 'guru')
            ->paginate(10)
            ->appends($request->all());

        return response()->json($guru);
    }

    public function detail(User $guru)
    {
        if ($guru->role !== 'guru') {
            return response()->json([
                'message' => 'Data bukan guru',
            ], 404);
        }

        return response()->json([
            'message' => 'Data guru berhasil diambil',
            'received' => 1,
            'data' => $guru,
        ]);
    }

    public function store(GuruStoreRequest $request)
    {
        $validated = $request->validated();

        $password = Str::random(8);
        $validated['password'] = bcrypt($password);
        $validated['first_password'] = $password;
        $validated['username'] = User::generateUsername($validated['name'], 'guru');
        $validated['role'] = 'guru';

        User::create($validated);

        return redirect()->route('admin.guru.index')->with('success', 'Guru berhasil ditambahkan');
    }


    /**
     * Update guru
     */
    public function update(Request $request, $id)
    {
        $guru = User::where('id', $id)->where('role', 'guru')->firstOrFail();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            // --- [PERBAIKAN] ---
            // Sesuaikan aturan validasi agar cocok dengan nilai yang dikirim dari frontend ('pria'/'wanita').
            'jenis_kelamin' => 'required|in:pria,wanita',
            // --- [AKHIR PERBAIKAN] ---
            'pendidikan_terakhir' => 'nullable|string|max:255',
            'phone' => [
                'required',
                'string',
                'max:20',
            ],
        ]);
        

        $guru->update($validated);

        return response()->json([
            'message' => 'Data guru berhasil diperbarui',
            'data' => $guru,
        ]);
    }

    // ... (fungsi destroy, APIshowPelajaran, dan APIshowSiswaDidik tetap sama) ...
    public function destroy($id)
    {
        $guru = User::where('id', $id)->where('role', 'guru')->firstOrFail();
        $guru->delete();

        return response()->json([
            'message' => 'Guru berhasil dihapus'
        ]);
    }

    public function APIshowPelajaran(User $guru)
    {
        if ($guru->role !== 'guru') {
            return response()->json([
                'message' => 'Data bukan guru'
            ], 404);
        }

        $pelajaran = Pelajaran::where('pengampu_id', $guru->id)->get();
        $count = $pelajaran->count();

        return response()->json([
            'message' => $count > 0 ? 'Berhasil mengambil data pelajaran guru' : 'Data tidak ditemukan',
            'received' => $count,
            'data' => $pelajaran
        ], $count > 0 ? 200 : 404);
    }

    public function APIshowSiswaDidik(User $guru)
    {
        if ($guru->role !== 'guru') {
            return response()->json([
                'message' => 'Data bukan guru'
            ], 404);
        }

        $siswa = Siswa::where('guru_id', $guru->id)->get();
        $count = $siswa->count();

        return response()->json([
            'message' => $count > 0 ? 'Berhasil mengambil siswa didik guru' : 'Data tidak ditemukan',
            'received' => $count,
            'data' => $siswa
        ], $count > 0 ? 200 : 404);
    }
}

