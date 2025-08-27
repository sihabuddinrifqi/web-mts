<?php

use App\Http\Controllers\NilaiController;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PresensiController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = Auth::user();
        if ($user->role === 'admin') return redirect(route('admin.siswa.index'));
        if ($user->role === 'walisiswa') return redirect(route('wali.anak'));
        if ($user->role === 'guru') return redirect(route('guru.siswa'));
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('/transcript/{nis}', [NilaiController::class, 'generatePDF'])
    ->name('nilai.transcript');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
require __DIR__.'/api.php';
require __DIR__.'/guru.php';
require __DIR__.'/walisiswa.php';
if (App::environment(['local', 'staging'])) {
    require __DIR__.'/debug.php';
}
