<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/testview', function() {
    return Inertia::render('test/test');
});
