<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LeadController;

Route::inertia('/', 'welcome')->name('home');
Route::get('/leads', [LeadController::class, 'index'])->name('leads.index');
Route::post('/leads', [LeadController::class, 'store'])->name('leads.store');
