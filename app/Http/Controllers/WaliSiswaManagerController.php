<?php

namespace App\Http\Controllers;

use App\Http\Requests\WaliSiswa\WaliSiswaStoreRequest;
use App\Models\WaliSiswa;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule; // [1] Pastikan Rule di-import

class WaliSiswaManagerController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('admin/walisiswa', [
            'prop' => WaliSiswa::paginateWithSearch($request, ['name', 'phone'], ['anak'])
        ]);
    }

    public function api(Request $request)
    {
        return response()->json(WaliSiswa::paginateWithSearch($request));
    }

    public function store(WaliSiswaStoreRequest $request)
    {
        $validated = $request->validated();
        $password = Str::random(8);
        $validated['password'] = bcrypt($password);
        $validated['first_password'] = $password;

        $validated['username'] = WaliSiswa::generateUsername($validated['name'], 'walisiswa');
        $validated['role'] = 'walisiswa';
        
        if (isset($validated['jenis_kelamin'])) {
             $validated['jenis_kelamin'] = ($validated['jenis_kelamin'] === 'pria') ? 'L' : 'P';
        }

        WaliSiswa::create($validated);
        return redirect()->route('admin.walisiswa.index');
    }

    /**
     * [PERBAIKAN] Mengisi logika untuk fungsi update.
     */
    public function update(Request $request, WaliSiswa $walisiswa) // Variabel diganti menjadi $walisiswa agar cocok
    {
        // [2] Validasi data yang masuk dari formulir
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => ['required', 'string', Rule::unique('users')->ignore($walisiswa->id)],
            'jenis_kelamin' => 'required|in:pria,wanita',
            'alamat' => 'required|string',
            'password' => 'nullable|string|min:8', // Password boleh kosong (nullable)
        ]);

        
        // [4] Hanya update password jika diisi
        if (empty($validatedData['password'])) {
            unset($validatedData['password']); // Hapus dari array jika kosong
        } else {
            // Enkripsi password baru jika diisi
            $validatedData['password'] = bcrypt($validatedData['password']);
        }

        // [5] Perbarui data di database
        $walisiswa->update($validatedData);

        // [6] Kembalikan respons berhasil dalam format JSON
        return response()->json([
            'message' => 'Data Wali Siswa berhasil diperbarui!',
            'data' => $walisiswa
        ]);
    }

    public function destroy(WaliSiswa $walisiswa)
    {
        $walisiswa->delete();
        return redirect()->back()->with('success', 'Data berhasil dihapus.');
    }
}
