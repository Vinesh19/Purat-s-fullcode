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
use App\Http\Controllers\AgentController;
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



Route::middleware('auth:api')->group(function () {

    //template API(action=crud)
    Route::post('/template', [TemplateController::class, 'handleTemplate']);

    //inserting broadcast data into Mob_no3 and Campaign_details
    Route::post('/insert-broadcast-data', [BroadcastController::class, 'store']);
    // group api
    Route::post('/group-names', [GroupController::class, 'groupName']);
    Route::post('/group-data', [GroupController::class, 'groupData']);


    //chat inbox
    Route::post('advance-filtered-data', [ChatMessageController::class, 'getAdvanceFilteredData']); //fetching data with advance filter (status, attribute, assignee)
    Route::post('filtered-data', [ChatMessageController::class, 'getFilteredData']); //fetching data with filter (open,expired,active.broadcast etc)
    Route::post('chat-messages', [ChatMessageController::class, 'fetchMessages']); //updated_at(25-07-2024)
    Route::post('chat-message-room/update', [ChatMessageController::class, 'updateColumn']);
    //created_at(25-07-2024)
    Route::post('/quick-replies', [ChatMessageController::class, 'handleQuickReplies']);
    //created_at(26-07-2024)
    Route::post('/chat-inbox/note', [ChatMessageController::class, 'handleNote']);

    //graph mobile number count api //created at 28-6-2024
    Route::post('/mobile-numbers/count', [GraphController::class, 'getCountByTimeFrame']);

    Route::post('/assign-users', [AgentController::class, 'handleAssignUsers']);
    Route::post('/teams', [TeamController::class, 'store']);

});


//sending email otp
Route::post('/send-email-otp', [EmailOTPController::class, 'sendEmailOTP']);
//verifying email otp
Route::post('/verify-email-otp', [EmailOTPController::class, 'verifyEmailOTP']);
//update password in case of forget password
Route::post('/update-password', [EmailOTPController::class, 'update']);

//sending otp on number
Route::post('/send-mobile-otp', [MobileOTPController::class, 'sendMobileOTP']);
//verifying number otp
Route::post('/verify-mobile-otp', [MobileOTPController::class, 'verifyMobileOTP']);


// Route::get('login/google', 'Auth\LoginController@redirectToGoogle')->name('login.google');
Route::get('login/google', [GoogleController::class, 'redirectToGoogle']);
// Route::get('login/google/callback', 'Auth\LoginController@handleGoogleCallback');
Route::get('login/google/callback', [GoogleController::class, 'handleGoogleCallback']);

