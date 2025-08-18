<?php

namespace App\Http\Controllers;

use App\Http\Requests\WaliSiswa\WaliSiswaStoreRequest;
use App\Models\WaliSiswa;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class WaliSiswaManagerController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('admin/walisiswa', [
            'prop' => WaliSiswa::paginateWithSearch($request, ['name'], ['anak'])
        ]);
    }

    public function api(Request $request)
    {
        return response()->json(WaliSiswa::paginateWithSearch($request));
    }

    public function store(WaliSiswaStoreRequest $request)
    {
        // Gate::authorize('create');
        $validated = $request->validated();
        $password = Str::random(8);
        $validated['password'] = bcrypt($password);
        $validated['first_password'] = $password;

        $validated['username'] = WaliSiswa::generateUsername($validated['name'], 'walisiswa');
        $validated['role'] = 'walisiswa';
        WaliSiswa::create($validated);
        return redirect()->route('admin.walisiswa.index');
    }

    public function update(Request $request, WaliSiswa $waliSiswa)
    {
        return redirect()->route('admin.walisiswa.index');
    }

    public function destroy(WaliSiswa $walisiswa)
{
    // Logika untuk menghapus
    $walisiswa->delete();
    return redirect()->back()->with('success', 'Data berhasil dihapus.');
}
}