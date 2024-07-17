<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GraphController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\GoogleController;
use App\Http\Controllers\EmailOTPController;
use App\Http\Controllers\TemplateController;
use App\Http\Controllers\BroadcastController;
use App\Http\Controllers\MobileOTPController;
use App\Http\Controllers\ChatMessageController;
use Illuminate\Support\Facades\Broadcast;

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

Route::middleware('auth:api')->group(function () {
    //fetching template's name-list from templates(table)
    Route::post('/template-name', [TemplateController::class, 'show_name']);
    //fetching template's all data from templates(table)
    Route::get('/template/{template_id}', [TemplateController::class, 'show']);
    //chat inbox
Route::post('advance-filtered-data', [ChatMessageController::class, 'getAdvanceFilteredData']); //fetching data with advance filter (status, attribute, assignee)
Route::post('filtered-data', [ChatMessageController::class, 'getFilteredData']); //fetching data with filter (open,expired,active.broadcast etc)
Route::get('chat-messages', [ChatMessageController::class, 'fetchMessages']);
Route::post('chat-message-room/update', [ChatMessageController::class, 'updateColumn']);
});

//inserting data into templates
Route::post('/templates', [TemplateController::class, 'store']);
//updating template data
Route::put('/update-template/{template_id}', [TemplateController::class, 'update']);

//sending email otp
Route::post('/send-email-otp', [EmailOTPController::class, 'sendEmailOTP']);
//verifying email otp
Route::post('/verify-email-otp', [EmailOTPController::class, 'verifyEmailOTP']);
//update password in case of forget password
Route::post('/update-password', [EmailOTPController::class, 'update']);

//sending otp on number
Route::post('/send-mobile-otp', [MobileOTPController::class, 'sendMobileOTP']);
//varifying number otp
Route::post('/verify-mobile-otp', [MobileOTPController::class, 'verifyMobileOTP']);

//inserting broadcast data into Mob_no3 and Campaign_details
Route::post('/insert-broadcast-data', [BroadcastController::class, 'store']);

// Route::get('login/google', 'Auth\LoginController@redirectToGoogle')->name('login.google');
Route::get('login/google', [GoogleController::class, 'redirectToGoogle']);
// Route::get('login/google/callback', 'Auth\LoginController@handleGoogleCallback');
Route::get('login/google/callback', [GoogleController::class, 'handleGoogleCallback']);

// Route for inserting data into the 'groups' table
Route::post('/insert-group-names', [GroupController::class, 'store']);

// Route for adding contacts
Route::post('/contacts', [GroupController::class, 'storeContacts']);

//created at 28-6-2024
//graph mobile number count api
Route::get('/mobile-numbers/count', [GraphController::class, 'getCountByTimeFrame']);
//receiver_id(number from whatsapp) and username(resource) from chat_messages 
Route::get('/unique-messages', [ChatMessageController::class, 'getUniqueMessages']);


