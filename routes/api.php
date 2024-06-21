<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\EmailOTPController;
use App\Http\Controllers\TemplateController;
use App\Http\Controllers\BroadcastController;
use App\Http\Controllers\MobileOTPController;


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

//for registration
Route::post('/registration', [AuthController::class, 'registration']);

//for login
Route::post('/login', [AuthController::class, 'login']);

//for logout
Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});

//for verifying email
Route::post('/verify-email', [AuthController::class, 'verifyEmail']);

//for verifying number
Route::post('/verify-mobile', [AuthController::class, 'verifyMobile']);

//sending email otp
Route::post('/send-email-otp', [EmailOTPController::class, 'sendEmailOTP']);
//verifying email otp
Route::post('/verify-email-otp', [EmailOTPController::class, 'verifyEmailOTP']);

//sending otp on number
Route::post('/send-mobile-otp', [MobileOTPController::class, 'sendMobileOTP']);
//varifying number otp
Route::post('/verify-mobile-otp', [MobileOTPController::class, 'verifyMobileOTP']);

//fetching template's name-list from templates(table)
Route::get('/template-name', [TemplateController::class, 'show_name']);
//fetching template's all data from templates(table)
Route::get('/template/{template_id}', [TemplateController::class, 'show']);

//group table for inserting data
Route::post('/insert-group-data', [GroupController::class, 'store']);
//group table for fetching data
Route::post('/fetching-group-data/{group_name}', [GroupController::class, 'show']);


//inserting broadcast data into Mob_no3 and Campaign_details
Route::post('/insert-broadcast-data', [BroadcastController::class, 'store']);
