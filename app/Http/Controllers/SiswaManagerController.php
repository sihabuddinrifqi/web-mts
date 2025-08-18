<?php

namespace App\Http\Controllers;

use App\Http\Requests\Siswa\SiswaStoreRequest;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Inertia\Inertia;
use illuminate\Support\Str;

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
     * Show the form for creating a new resource.
     */
    public function store(SiswaStoreRequest $request)
    {
        $validated = $request->validated();
        $password = Str::random(8);
        $validated['password'] = bcrypt($password);
        $validated['first_password'] = $password;
        $validated['nis'] = Siswa::generateNis($validated['angkatan']);
        $validated['username'] = $validated['nis'];
        $validated['role'] = 'siswa';
        Siswa::create($validated);
        return redirect(route('admin.siswa.index'));
    }

    public function update(Request $request, Siswa $siswa)
{
    $validated = $request->validate([
        'name'      => 'required|string|max:255',
        'kelas'     => 'nullable|string|max:50',
        'angkatan'  => 'required|string|max:10',
        'alamat'    => 'nullable|string|max:255',
    ]);

    // cukup update sekali
    $siswa->update($validated);

    return redirect()
        ->route('admin.siswa.index')
        ->with('success', 'Data siswa berhasil diperbarui');
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
