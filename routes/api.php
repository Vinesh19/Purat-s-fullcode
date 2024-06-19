<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TemplateController;
use App\Http\Controllers\BroadcastTableController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and will be assigned to
| the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


// Auth Routes ****************************************************************


Route::post('/registration', [AuthController::class, 'registration']);

Route::post('/check-email', [AuthController::class, 'checkEmail']);

Route::post('/login', [AuthController::class, 'login']);

// Route::middleware('auth:api')->group(function () {
Route::post('/logout', [AuthController::class, 'logout']);
// });

//email otp
// Route::get('/send-verify-mail/{email}', [AuthController::class, 'sendvarifyemail']);

Route::get('/send-verify-mail/{email}', [AuthController::class, 'sendvarifyemail']);

Route::post('/verify-otp', [AuthController::class, 'verifyotp']);

Route::get('/broadcast/{token}', [AuthController::class, 'broadcast']);

Route::post('/broadcast-input', [AuthController::class, 'broadcast_input']);

//template route
Route::get('/template/{template_id}', [TemplateController::class, 'show']);
Route::post('/broadcast-table', [BroadcastTableController::class, 'store']);
