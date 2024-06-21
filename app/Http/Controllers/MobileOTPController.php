<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;

class MobileOTPController extends Controller
{
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
            // OTP is valid, you can perform any further actions here

            // Optionally, you might want to invalidate the OTP after verification
            $user->update([
                'otp' => null,
            ]);
 // Generate a token for the authenticated session
        $token = $user->createToken('auth_token')->accessToken;

        // Return the token and user information
        return response()->json([
            'message' => 'OTP verified successfully.',
            'token' => $token,
            'user' => $user
        ], 200);
    } else {
        return response()->json(['status' => 0, 'message' => 'Invalid OTP or mobile number.'], 400);
    }
}
    }