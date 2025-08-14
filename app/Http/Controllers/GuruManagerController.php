<?php

namespace App\Http\Controllers;

use App\Http\Requests\Guru\GuruStoreRequest;
use App\Models\Guru;
use App\Models\Pelajaran;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class GuruManagerController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('admin/guru', [
            'prop' => Guru::paginateWithSearch($request, ['name'], ['anak', 'pelajaran'])
        ]);
    }

    public function api(Request $request)
    {
        return response()->json(Guru::paginateWithSearch($request, ['name'], ['anak', 'pelajaran']));
    }

    public function APIshowPelajaran(Guru $guru)
    {
        $pelajaran = Pelajaran::query()->where('pengampu_id', $guru->id)->get();
        $count = $pelajaran->count();
        return response()->json([
            'message' => $count > 0 ? 'successfulyy received guru\'z Pelajaran' : 'data not found',
            'received' => $count,
            'data' => $pelajaran
        ], $count > 0 ? 200 : 404);
    }

    public function APIshowSiswaDidik(Guru $guru)
    {
        $siswa = Siswa::where('guru_id', $guru->id)->get();
        $count = $siswa->count();
        return response()->json([
            'message' => $count > 0 ? 'successfulyy received guru\'z siswa didik' : 'data not found',
            'received' => $count,
            'data' => $siswa
        ], $count > 0 ? 200 : 404);
    }

    public function store(GuruStoreRequest $request)
    {
        $validated = $request->validated();
        $password = Str::random(8);
        $validated['password'] = bcrypt($password);
        $validated['first_password'] = $password;
        $validated['username'] = 'guru' . random_int(10000, 99999);
        $validated['role'] = 'guru';
        Guru::create($validated);
        return redirect()->route('admin.guru.index');
    }

    public function update(Request $request, Guru $guru)
    {
        // Update guru logic here
        return redirect()->route('admin.guru.index');
    }

    public function destroy(Guru $guru)
    {
        $guru->delete();
        return redirect()->route('admin.guru.index');
    }
}