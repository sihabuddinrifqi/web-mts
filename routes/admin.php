<?php

use App\Http\Middleware\EnsureUserHasRole;
use App\Http\Controllers\IzinManagerController;
use App\Http\Controllers\PelajaranManagerController;
use App\Http\Controllers\SiswaManagerController;
use App\Http\Controllers\GuruManagerController;
use App\Http\Controllers\WaliSiswaManagerController;
use App\Http\Controllers\PresensiViewController;
use App\Http\Controllers\NilaiViewController;
use Illuminate\Support\Facades\Route;

Route::prefix('/admin')
    ->name('admin.')
    ->middleware(['auth'])
    ->group(
    function(){
        Route::resource('siswa', SiswaManagerController::class)
        ->only(['index', 'store', 'update', 'destroy']);
        Route::resource('walisiswa', WaliSiswaManagerController::class)
        ->only(['index', 'store', 'update', 'destroy']);
        Route::resource('guru', GuruManagerController::class)
        ->only(['index', 'store', 'update', 'destroy']);
        Route::get('/guru/{guru}/pelajaran', [GuruManagerController::class, 'APIshowPelajaran'])
        ->name('guru.pelajaran');
        Route::get('/guru/{guru}/siswa-didik', [GuruManagerController::class, 'APIshowSiswaDidik'])
        ->name('guru.siswa');
        Route::resource('izin', IzinManagerController::class)
        ->only(['index', 'update','destroy']);
        Route::resource('pelajaran', PelajaranManagerController::class)
        ->only(['index', 'store', 'update', 'destroy']);
        
        // Presensi routes
        Route::get('/presensi', [PresensiViewController::class, 'admin'])->name('presensi.index');
        Route::get('/presensi/statistics', [PresensiViewController::class, 'statistics'])->name('presensi.statistics');
        
        // Nilai routes
        Route::get('/nilai', [NilaiViewController::class, 'admin'])->name('nilai.index');
        Route::get('/nilai/statistics', [NilaiViewController::class, 'statistics'])->name('nilai.statistics');
    }
);

