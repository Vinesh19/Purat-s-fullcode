<?php

namespace App\Http\Controllers;

// use Socialite;
use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;

class GoogleController extends Controller
{

    public function redirectToGoogle()
    {
        // return Socialite::driver('google')->redirect();
        $redirectUrl = Socialite::driver('google')->stateless()->redirect()->getTargetUrl();
        return response()->json(['url' => $redirectUrl]);
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
        } catch (\Exception $e) {
            // return response()->json(['error' => 'Unable to authenticate the user'], 500);
            return response()->json(['error' => 'Unable to authenticate the user', 'exception' => $e->getMessage()], 500);
        }

        // dd($googleUser);
        // Check if the user exists in your database, if not, create a new user
        $existingUser = User::where('email', $googleUser->email)->first();
        if (!$existingUser) {
            // Create a new user in your database
            $existingUser = User::create([
                'firstname' => $googleUser->name,
                'lastname' => $googleUser->name,
                'email' => $googleUser->email,
                'username' => $googleUser->email, // Add a username value
                'mobile_no' => '883748747',
                'password' => 'password',
                // You can add other fields as needed
            ]);
        }

        // Log the user in
        Auth::login($existingUser, true);

        // If using Laravel Passport
        $token = $existingUser->createToken('YourAppName')->accessToken;

        // Return the token and user information in the response
        return response()->json([
            'token' => $token,
            'user' => $existingUser
        ]);
    }
}
