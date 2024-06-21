<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Carbon;

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
            $user->save();
            return response()->json([
                'email' => $user->email,
                'status' => 1,
                'message' => 'OTP send successfully.'
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

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        if ($user->otp != $request->otp) {
            return response()->json(['message' => 'Invalid OTP.'], 400);
        }

        // Save the verification time in the specified format
        $user->otp = '';
        // $user->otp_verified_at = Carbon::now()->format('Y_m_d H:i:s');
        $user->save();

        return response()->json([
            'status' => 1,
            'message' => 'OTP verified.'
        ], 200);
    }
}
