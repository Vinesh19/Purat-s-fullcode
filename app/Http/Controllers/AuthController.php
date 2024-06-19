<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Broadcast_output;
use App\Models\Broadcast_input;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\DB;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
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
            'password' => 'required|string|min:8|max:255',
            'password_confirmation' => 'required|string|min:8|max:255', // Add confirmation field
            'mobile_no' => 'string|unique:ci_admin,mobile_no',
        ]);

        // Return validation errors if any
        if ($validator->fails()) {
            // return response()->json(['errors' => $validator->errors()], 422);
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
            'mobile_no' => $request->number,
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

    public function checkEmail(Request $request)
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
        Auth::logout();
        return response()->json(['message' => 'User logged out successfully'], 200);
    }

    public function sendvarifyemail($email)
    {
        // if (auth()->user()) {
        $user = User::where('email', $email)->get();
        if (count($user) > 0) {
            $otp = rand(100000, 999999);
            // return $otp ;

            $data['otp'] = $otp;
            $data['email'] = $email;
            $data['title'] = "otp verification.";
            $data['body'] = "your otp is -";
            Mail::send('verifyMail', ['data' => $data], function ($e) use ($data) {
                $e->to($data['email'])->subject($data['title']);
            });
            $id = $user[0]['id'];
            $user = User::find($id);
            $user->email_otp = $otp;
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

    public function verifyotp(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'email' => 'required|email',
                'email_otp' => 'required|numeric'
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

        if ($user->email_otp != $request->email_otp) {
            return response()->json(['message' => 'Invalid OTP.'], 400);
        }

        // Save the verification time in the specified format
        $user->email_otp = '';
        $user->email_otp_verified_at = Carbon::now()->format('Y_m_d H:i:s');
        $user->save();

        return response()->json([
            'status' => 1,
            'message' => 'OTP verified.'
        ], 200);
    }

    public function broadcast($token)
    {
        $accessToken = DB::table('oauth_access_tokens')
            ->where('id', $token)
            ->first();

        // Check if token exists
        if (!$accessToken) {
            return response()->json([
                'success' => false,
                'message' => 'Token not found',
            ], 404);
        }

        // Token found, retrieve the associated user
        $user = User::find($accessToken->user_id);
        // $user = User::with('broadcast_output')->find($accessToken->user_id);
        // $user = User::with('broadcast_output')
        //     ->where('id', $accessToken->user_id)
        //     ->first();
        // $user = User::with(['broadcast_output' => function ($query) {
        //     $query->select('id', 'attribute', 'date', 'time', 'svc_file', 'media');
        // }])
        //     ->find($accessToken->user_id);



        // Check if user exists
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
            ], 404);
        }

        // User found, return success response with user data
        return response()->json([
            'success' => true,
            'message' => 'User found',
            'data' => $user
        ], 200);
    }

    public function broadcast_input(Request $request)
    {
        // Validate incoming request
        $validator = Validator::make($request->all(), [
            'attribute' => 'nullable|string',
            'date' => 'nullable|date',
            'time' => 'nullable|date_format:H:i',
            'csv_file' => 'nullable|string',
            'media' => 'nullable|mimes:avif,jpg,png,jpeg|max:3000'
        ]);

        // Return validation errors if any
        if ($validator->fails()) {
            return response()->json(['status' => 0, 'message' => $validator->errors()], 400);
        }

        $file = $request->file('media');
        $path = $file->store('images', 'public');

        // Create new broadcast input
        $user = Broadcast_input::create([
            'attribute' => $request->attribute,
            'date' => $request->date,
            'time' => $request->time,
            'csv_file' => $request->csv_file,
            'media' => $path,
        ]);

        if ($user) {
            // Return success response
            return response()->json([
                'status' => 1,
                'message' => 'Broadcast input submitted successfully',
                // 'data' => $broadcastInput
            ], 201);
        }
    }
}


// dd($request);
// $request->validate([
//     'image' => 'required|mimes:avif,jpeg,png,jpg|max:3000',
//     'title' => 'required|max:50',
//     'desc' => 'required|max:2500',
// ]);

// $file_path = public_path('/storage/'.$project->file_name);
// if(file_exists($file_path)){
//     @unlink($file_path);
// }

// $file = $request->file('image');
// $path = $file->store('images', 'public');

// $project->update([
//     'file_name' => $path,
//     'title' => $request->title,
//     'desc' => $request->desc,
// ]);



//  <div class="card" style="width:90%;">
//     <img src="{{ asset('/storage/' . $pro->file_name) }}"
//         class="card-img-top" alt="category image" style="height:19rem;">
//     <div class="card-body">
//         <h5 class="card-title">{{ $pro->title }}</h5>
//         <p class="card-text">{{ $description }}....</p>
//         <div class="d-flex">
//             <a href="{{route('projects.show',$pro->id)}}" class="btn btn-primary">View Project</a>
//             <form action="{{ route('projects.destroy', $pro->id) }}" method="post"
//                 class="mx-2">
//                 @csrf
//                 @method('DELETE')
//                 <button class="btn btn-danger" type="submit">
//                     Delete
//                 </button>
//             </form>
//             <a href="{{ route('projects.edit', $pro->id) }}"
//                 class="btn btn-success">Update</a>
//         </div>
//         {{-- <a href="{{route('category',$value->id)}}" class="btn btn-warning">View Category</a> --}}
//     </div>
// </div>
