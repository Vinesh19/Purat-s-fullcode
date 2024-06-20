<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TemplateController;
use App\Http\Controllers\BroadcastTableController;
use App\Http\Controllers\CsvController;
use App\Http\Controllers\CsvNewController;
use App\Http\Controllers\DataInsertionController;

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

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });


// Auth Routes ****************************************************************


Route::post('/registration', [AuthController::class, 'registration']);

Route::post('/check-email', [AuthController::class, 'checkEmail']);

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});

//email otp
// Route::get('/send-verify-mail/{email}', [AuthController::class, 'sendvarifyemail']);

Route::get('/send-verify-mail/{email}', [AuthController::class, 'sendvarifyemail']);

Route::post('/verify-otp', [AuthController::class, 'verifyotp']);

Route::get('/broadcast/{token}', [AuthController::class, 'broadcast']);

Route::post('/broadcast-input', [AuthController::class, 'broadcast_input']);


//fetching template name from templates(table)
// Route::get('/template-name', [TemplateController::class, 'show_name']);
Route::get('/template-name', [TemplateController::class, 'show_name']);

//fetching template data from templates(table)
Route::get('/template/{template_id}', [TemplateController::class, 'show']);

//inserting broadcast data into broadcast_tbl(table)
Route::post('/broadcast-table', [BroadcastTableController::class, 'store']);

//api dor inserting csv file
Route::post('/upload-csv', [CsvController::class, 'uploadCsv']);

Route::post('/insert-data', [DataInsertionController::class, 'store']);

Route::post('/import-csv', [CsvNewController::class, 'importCsv']);

