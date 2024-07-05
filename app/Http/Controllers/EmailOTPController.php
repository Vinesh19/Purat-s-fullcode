<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str; //needed in email verification
use Illuminate\Support\Facades\URL; //needed in email verification

class EmailOTPController extends Controller
{
    public function sendEmailOTP(Request $request)
    {
        // if (auth()->user()) {

        // Validate the request
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        // Return validation errors if any
        if ($validator->fails()) {
            return response()->json(['status' => 0, 'message' => $validator->errors()], 400);
        }

        $user = User::where('email', $request->email)->first();
        if ($user) {
            $otp = rand(100000, 999999);
            // return $otp ;

            $data['otp'] = $otp;
            $data['email'] = $request->email;
            $data['title'] = "otp verification.";
            $data['body'] = "your otp is -";
            Mail::send('verifyMail', ['data' => $data], function ($e) use ($data) {
                $e->to($data['email'])->subject($data['title']);
            });
            $id = $user->admin_id;
            $user = User::find($id);
            $user->otp = $otp;
            $user->otp_created_at = Carbon::now();
            $user->save();

            $token = $user->createToken("auth_token")->accessToken;

            return response()->json([
                'email' => $user->email,
                'status' => 1,
                'message' => 'OTP send successfully.',
                'token' => $token,
            ], 200);
        } else {
            return response()->json([
                'status' => 0,
                'message' => 'user is not found.'
            ], 404);
        }
        // } else {
        //     return response()->json(['message' => 'user is not authenticated.']);
        // }
    }

    public function verifyEmailOTP(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'email' => 'required|email',
                'otp' => 'required|numeric'
            ]
        );

        // Check if validation fails
        if ($validator->fails()) {
            // Validation failed, create response for client side
            return response()->json([
                'success' => 0,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // $user = User::where('email', $request->email)->first();
        // Check if the mobile number and OTP match in the user table
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        if ($user->otp != $request->otp) {
            return response()->json(['message' => 'Invalid OTP.'], 400);
        }

        // $otpCreationTime = Carbon::parse($user->otp_created_at);
        $otpCreationTime = Carbon::parse($user->otp_created_at,);
        $currentTime = Carbon::now();

        // return $currentTime;
        // "2024-06-30T17:24:31.000000Z"
        // "2024-06-30T17:26:46.014682Z"

        if ($currentTime->diffInMinutes($otpCreationTime) > 1) {
            return response()->json(['status' => 0, 'message' => 'OTP has expired.'], 400);
        }

        // Optionally, you might want to invalidate the OTP after verification
        $user->update([
            'otp' => null,
            'otp_created_at' => null,
        ]);

        return response()->json([
            'status' => 1,
            'message' => 'OTP verified.'
        ], 200);
    }

    public function update(Request $request)
    {
        // return $request;
        // Validate incoming request
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:ci_admin,email',
            'password' => 'required|confirmed|min:8',
            'password_confirmation' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()], 400);
        }

        // Retrieve user by email
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        // Update user password
        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'status' => 1,
            'message' => 'Password successfully updated.'
        ]);
    }
}
