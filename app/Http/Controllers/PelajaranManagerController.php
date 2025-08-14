<?php

namespace App\Http\Controllers;

use App\Models\Pelajaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PelajaranManagerController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('admin/pelajaran', [
            'prop' => Pelajaran::paginateWithSearch($request, ['nama_pelajaran'], ['nilai', 'pengampu'])
        ]);
    }

    public function api(Request $request)
    {
        return response()->json(Pelajaran::paginateWithSearch($request, ['nama_pelajaran'], ['nilai', 'pengampu']));
    }

    public function store(Request $request)
    {
        $validated = $request->validate(
            [
                'nama_pelajaran' => 'required|string|max:64',
                'semester' => 'required|int',
                'pengampu_id' => 'required|int',
            ]
        );
        Pelajaran::create($validated);
        return redirect()->route('admin.pelajaran.index');
    }

    public function update(Request $request, Pelajaran $pelajaran)
    {
        // Update pelajaran logic here
        return redirect()->route('admin.pelajaran.index');
    }

    public function destroy(Pelajaran $pelajaran)
    {
        $pelajaran->delete();
        return redirect()->route('admin.pelajaran.index');
    }
}