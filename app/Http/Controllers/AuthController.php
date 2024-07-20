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
        try {
            // Validate incoming request
            $validator = Validator::make($request->all(), [
                'firstname' => 'required|string|max:255',
                'lastname' => 'required|string|max:255',
                'email' => 'required|string|email|unique:ci_admin,email|max:255',
                'username' => 'required|string|unique:ci_admin,username|max:255',
                'password' => [
                    'required',
                    'string',
                    'min:8',
                    'max:255',
                    'confirmed',
                    'regex:/[A-Z]/', // Ensure password contains at least one uppercase letter
                    'regex:/[@$!%*#?&]/', // Ensure password contains at least one special character
                    'regex:/[0-9]/' // Ensure password contains at least one digit
                ],
                'password_confirmation' => 'required|string|min:8|max:255', // Add confirmation field
                'mobile_no' => 'required|string|unique:ci_admin,mobile_no|digits_between:8,15',
            ], [
                'password.regex' => 'Password must contain at least one uppercase letter, one special character, and one digit.',
            ]);

            // Return validation errors if any
            if ($validator->fails()) {
                return response()->json(['status' => 0, 'message' => $validator->errors()], 400);
            }

            // Create new user
            $user = User::create([
                'firstname' => $request->firstname,
                'lastname' => $request->lastname,
                'email' => $request->email,
                'username' => $request->username,
                'password' => Hash::make($request->password),
                'mobile_no' => $request->mobile_no,
            ]);

            // Create an auth token for the user
            // $token = $user->createToken("auth_token")->accessToken;

            // Return success response
            return response()->json(
                [
                    'status' => 1,
                    'message' => 'User registered successfully',
                    // 'token' => $token,
                    'user' => $user
                ],
                201
            );
        } catch (\Exception $e) {
            // Return error response with exception message
            return response()->json(['status' => 0, 'message' => $e->getMessage()], 500);
        }
    }

    public function login(Request $request)
    {
        try {
            // Validate incoming request
            $validator = Validator::make($request->all(), [
                'email_or_username' => 'required|string|max:255',
                'password' => 'required|string|max:255',
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

                // Update last_login column to current timestamp
                // Find the user based on the login field type
                $user_ci_admin = User::where($fieldType, $credentials['email_or_username'])->first();
                // return $user_ci_admin;
                $user_ci_admin->last_login = now();
                $user_ci_admin->save();

                // Return success response
                return response()->json([
                    'status' => 1,
                    'message' => 'User logged in successfully',
                    'token' => $token,
                    'user' => $user
                ], 200);
            } else {
                // Return error response
                return response()->json(['status' => 0, 'message' => 'Invalid credentials'], 401);
            }
        } catch (\Exception $e) {
            // Return error response with exception message
            return response()->json(['status' => 0, 'message' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            // Get the token that the user is currently authenticated with
            $token = $request->user()->token();

            // Revoke the token
            $token->revoke();

            // Return success response
            return response()->json([
                'status' => 1,
                'message' => 'User logged out successfully'
            ], 200);
        } catch (\Exception $e) {
            // Return error response with exception message
            return response()->json([
                'status' => 0,
                'message' => 'An error occurred: ' . $e->getMessage()
            ], 500);
        }
    }
}
