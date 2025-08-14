<?php

use App\Http\Controllers\WalisiswaController;
use Illuminate\Support\Facades\Route;


Route::prefix('/wali')
    ->middleware(['auth'])
    ->name('walisiswa.')
    ->group(function (){
        Route::get('/anak', [WalisiswaController::class, 'index'])
            ->name('anak');
        Route::get('/izin', [WalisiswaController::class, 'izin'])
            ->name('izin');
        Route::post('/izin/{walisiswa}', [WalisiswaController::class, 'create_izin'])
            ->name('izin.create');
    });
