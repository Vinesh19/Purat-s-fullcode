<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
// use Illuminate\Support\Carbon;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;


class MobileOTPController extends Controller
{

    //*********************** for verified number *****************************//
    public function sendMobileOTP(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'mobile_no' => 'required|numeric',
        ]);

        // Return validation errors if any
        if ($validator->fails()) {
            return response()->json(['status' => 0, 'message' => $validator->errors()], 400);
        }

        // Check if the mobile number exists in the user table
        $user = User::where('mobile_no', $request->mobile_no)->first();
        // return $user;

        if ($user) {

            // Generate OTP
            $otp = rand(100000, 999999);
            // Store OTP in database
            $user->update([
                'otp' => $otp,
                'otp_created_at' => Carbon::now()
            ]);

            // Send OTP via HTTP request
            $response = Http::get('http://182.70.253.85:9080/v2.0/dashboard1/voice/sms_otp.php', [
                'mobile_number' => $request->mobile_no,
                'otp' => $otp,
            ]);

            // Check if the OTP was sent successfully
            if ($response->successful()) {
                return response()->json(['message' => 'OTP sent successfully.'], 200);
            } else {
                return response()->json(['message' => 'Failed to send OTP.'], 500);
            }
        } else {
            return response()->json(['status' => 0, 'message' => 'Number not found in database'], 404);
        }
    }

    public function verifyMobileOTP(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'mobile_no' => 'required|numeric',
            'otp' => 'required|numeric',
        ]);

        // Return validation errors if any
        if ($validator->fails()) {
            return response()->json(['status' => 0, 'message' => $validator->errors()], 400);
        }

        // Check if the mobile number and OTP match in the user table
        $user = User::where('mobile_no', $request->mobile_no)
            ->where('otp', $request->otp)
            ->first();

        if ($user) {

            $otpCreationTime = Carbon::parse($user->otp_created_at);
            $currentTime = Carbon::now('Asia/Kolkata');

            // return $currentTime;

            if ($currentTime->diffInMinutes($otpCreationTime) > 1) {
                return response()->json(['status' => 0, 'message' => 'OTP has expired.'], 400);
            }
            // OTP is valid, you can perform any further actions here

            // Optionally, you might want to invalidate the OTP after verification
            $user->update([
                'otp' => null,
                'otp_created_at' => null,
            ]);

            // Manually log the user in
            Auth::login($user);
            $token = $user->createToken("auth_token")->accessToken;

            return response()->json([
                'message' => 'OTP verified successfully.',
                'status' => 1,
                'user' => $user,
                'token' => $token,
            ], 200);
        } else {
            return response()->json(['status' => 0, 'message' => 'Invalid OTP or mobile number.'], 400);
        }
    }

    //*********************** for all number *****************************//
    public function sendAnyMobileOTP(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'username_or_email' => 'required|string',
            'mobile_no' => 'required|numeric',
        ]);

        // Return validation errors if any
        if ($validator->fails()) {
            return response()->json(['status' => 0, 'message' => $validator->errors()], 400);
        }

        // Check if the mobile number exists in the user table
        $user = User::where('username', $request->username_or_email)->orWhere('email', $request->username_or_email)->first();

        // Generate OTP
        $otp = rand(100000, 999999);
        // Store OTP in database
        $user->update([
            'otp' => $otp,
            'otp_created_at' => Carbon::now(),
            'verified_mobile_no' => $request->mobile_no,
        ]);

        // Send OTP via HTTP request
        $response = Http::get('http://182.70.253.85:9080/v2.0/dashboard1/voice/sms_otp.php', [
            'mobile_number' => $request->mobile_no,
            'otp' => $otp,
        ]);

        // Check if the OTP was sent successfully
        if ($response->successful()) {
            return response()->json(['message' => 'OTP sent successfully.'], 200);
        } else {
            return response()->json(['message' => 'Failed to send OTP.'], 500);
        }
    }

    public function verifyAnyMobileOTP(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'mobile_no' => 'required|numeric',
            'otp' => 'required|numeric',
        ]);

        // Return validation errors if any
        if ($validator->fails()) {
            return response()->json(['status' => 0, 'message' => $validator->errors()], 400);
        }

        // Check if the mobile number and OTP match in the user table
        $user = User::where('verified_mobile_no', $request->mobile_no)
            ->where('otp', $request->otp)
            ->first();

        if ($user) {

            $otpCreationTime = Carbon::parse($user->otp_created_at);
            $currentTime = Carbon::now('Asia/Kolkata');

            // return $currentTime;

            if ($currentTime->diffInMinutes($otpCreationTime) > 1) {
                return response()->json(['status' => 0, 'message' => 'OTP has expired.'], 400);
            }
            // OTP is valid, you can perform any further actions here

            // Optionally, you might want to invalidate the OTP after verification
            $user->update([
                'otp' => null,
                'otp_created_at' => null,
            ]);

            // Manually log the user in
            Auth::login($user);
            $token = $user->createToken("auth_token")->accessToken;

            return response()->json([
                'message' => 'OTP verified successfully.',
                'status' => 1,
                'user' => $user,
                'token' => $token,
            ], 200);
        } else {
            return response()->json(['status' => 0, 'message' => 'Invalid OTP or mobile number.'], 400);
        }
    }
}
