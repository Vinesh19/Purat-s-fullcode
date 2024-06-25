<?php

namespace App\Http\Controllers;

use App\Models\User;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;


class AuthController extends Controller
{

    public function registration(Request $request)
    {
        //Validate incoming request
        $validator = Validator::make($request->all(), [
            'firstname' => 'required|string|max:45',
            'lastname' => 'required|string|max:45',
            'email' => 'required|string|email|unique:ci_admin,email|max:45',
            'username' => 'required|string|unique:ci_admin,username|max:45',
            'password' => 'confirmed|required|string|min:8|max:255',
            'password_confirmation' => 'required|string|min:8|max:255', // Add confirmation field
            'mobile_no' => 'required|string|unique:ci_admin,mobile_no',
        ]);

        // Return validation errors if any
        if ($validator->fails()) {
            return response()->json(['status' => 0, 'message' => $validator->errors()], 400);
        }

        // Create new user
        $user = User::create([
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
            'name' => $request->name,
            'email' => $request->email,
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'mobile_no' => $request->mobile_no,
        ]);

        $token = $user->createToken("auth_token")->accessToken;

        // Return success response
        return response()->json(
            [
                'message' => 'User registered successfully',
                'token' => $token,
                'user' => $user
            ],
            201
        );
    }

    public function verifyEmail(Request $request)
    {
        // Validate incoming request
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|max:45',
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            return response()->json(['status' => 0, 'message' => $validator->errors()->first()], 400);
        }

        // Check if email exists
        $user = User::where('email', $request->email)->first();
        if ($user) {
            // Email exists
            return response()->json(['status' => 1, 'message' => 'Email exists'], 200);
        } else {
            // Email does not exist
            return response()->json(['status' => 0, 'message' => 'Email does not exist'], 200);
        }
    }

    public function verifyMobile(Request $request)
    {
        // Validate incoming request
        $validator = Validator::make($request->all(), [
            'mobile_no' => 'required|numeric',
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            return response()->json(['status' => 0, 'message' => $validator->errors()->first()], 400);
        }

        // Check if mobile_no exists
        $user = User::where('mobile_no', $request->mobile_no)->first();
        if ($user) {
            // mobile_no exists
            return response()->json(['status' => 1, 'message' => 'mobile_no exists'], 200);
        } else {
            // mobile_no does not exist
            return response()->json(['status' => 0, 'message' => 'mobile_no does not exist'], 200);
        }
    }

    public function login(Request $request)
    {
        // Validate incoming request
        $validator = Validator::make($request->all(), [
            'email_or_username' => 'required|string',
            'password' => 'required|string',
        ]);

        // Return validation errors if any
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $credentials = $request->only('email_or_username', 'password');

        // Determine the login field type based on input
        $fieldType = filter_var($credentials['email_or_username'], FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        // Attempt to authenticate the user
        if (Auth::attempt([$fieldType => $credentials['email_or_username'], 'password' => $credentials['password']])) {
            $user = Auth::user();
            $token = $user->createToken("auth_token")->accessToken;

            // Return success response
            return response()->json([
                'message' => 'User logged in successfully',
                'token' => $token,
                'user' => $user
            ], 200);
        } else {
            // Return error response
            return response()->json(['message' => 'Invalid credentials'], 401);
        }
    }

    public function logout(Request $request)
    {
        // Extract token from the Authorization header
        $token = $request->bearerToken();
        if ($token) {
            // Revoke the access token associated with the token
            $token = $request->user()->tokens->find($token);
            if ($token) {
                $token->revoke();
            }
        }
        // Logging out the user from the application
        return response()->json(['message' => 'User logged out successfully'], 200);
    }
}
