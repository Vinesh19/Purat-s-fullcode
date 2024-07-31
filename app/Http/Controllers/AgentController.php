<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\AssignUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AgentController extends Controller
{
    public function handleAssignUsers(Request $request)
    {
        // Define validation rules
        $validator = Validator::make($request->all(), [
            'action' => 'required|string|in:create,read,update,delete', // Ensure username exists in ci_admin table
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $action = $request->input('action');

        if ($action === 'create') {
            // Define validation rules
            $validator = Validator::make($request->all(), [
                'username' => 'required|string|max:255|exists:ci_admin,username', // Ensure username exists in ci_admin table
                'assign_user' => 'required|string|max:255',
                'agent_email' => 'nullable|string|email|max:255',
                'agent_mobile' => 'nullable|string|max:255',
                'roll' => 'nullable|integer',
                'online_status' => 'nullable|integer',
                'is_mobile_verified' => 'nullable|boolean',
                'is_email_verified' => 'nullable|boolean',
                // 'team' => 'required|string|max:255',
                'team' => 'required|array', // Validate that team is an array
                'team.*' => 'required|integer|max:255|exists:teams,id', // Ensure each team ID exists in the teams table
                'last_login_at' => 'nullable|date|date_format:Y-m-d H:i:s',
                'last_login_IP' => 'nullable|string|max:255',
            ]);

            // Check if validation fails
            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 400);
            }

            // Check if assign_user is unique for the given agent_email
            $existingAssignUser = AssignUser::where('assign_user', $request->input('assign_user'))
                ->where('agent_email', $request->input('agent_email'))
                ->first();

            if ($existingAssignUser) {
                return response()->json(['error' => 'The user name has already been assigned for the given email.'], 400);
            }

            // Update the size column of each team
            $team_ids = $request->input('team');
            $team_names = [];
            foreach ($team_ids as $team_id) {
                $team = Team::where('id', $team_id)->first();
                if ($team) {
                    // Increment the size column by +1
                    $team->size += 1;
                    $team->save();
                    $team_names[] = $team->team; // Assuming there's a 'name' column in the teams table
                } else {
                    return response()->json(['error' => 'Team not found'], 404);
                }
            }

            // Convert the array of team IDs to a comma-separated string
            $team_ids = $request->input('team');
            $team_string = implode(',', $team_ids);
            try {

                $assignUser = AssignUser::create([
                    'username' => $request->input('username'),
                    'assign_user' => $request->input('assign_user'),
                    'agent_email' => $request->input('agent_email'),
                    'agent_mobile' => $request->input('agent_mobile'),
                    'roll' => $request->input('roll', 0), // Default to 0 if not provided
                    'online_status' => $request->input('online_status', 0),
                    'is_mobile_verified' => $request->input('is_mobile_verified', 0), // Default to 0 if not provided
                    'is_email_verified' => $request->input('is_email_verified', 0), // Default to 0 if not provided
                    // 'team' => $request->input('team', 'all_team'), // Default to 'all_team' if not provided
                    'team' => $team_string, // Store the team names as a comma-separated string
                    'last_login_at' => $request->input('last_login_at'),
                    'last_login_IP' => $request->input('last_login_IP'),
                ]);

                return response()->json(['success' => 'Data inserted successfully', 'data' => $assignUser], 201);
            } catch (\Exception $e) {
                return response()->json(['error' => 'Failed to insert data', 'message' => $e->getMessage()], 500);
            }
        } elseif ($action === 'read') {
            try {

                // Define validation rules
                $validator = Validator::make($request->all(), [
                    'username' => 'required|string|max:255|exists:ci_admin,username', // Ensure username exists in ci_admin table
                ]);

                // Check if validation fails
                if ($validator->fails()) {
                    return response()->json(['error' => $validator->errors()], 400);
                }

                // Fetch all AssignUser records where username matches the input
                $username = $request->input('username');
                $assignUsers = AssignUser::where('username', $username)->get();

                // Check if any records are found
                if ($assignUsers->isEmpty()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'No records found for the given username.',
                        'code' => 404
                    ]);
                }

                // Return a successful response with the fetched data
                return response()->json([
                    'success' => true,
                    'data' => $assignUsers,
                    'code' => 200
                ]);
            } catch (\Exception $e) {
                // Handle the exception and return an error response
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to fetch data from AssignUser',
                    'error' => $e->getMessage(),
                    'code' => 500
                ]);
            }
        } elseif ($action === 'delete') {

            // Define validation rules
            $validator = Validator::make($request->all(), [
                'agent_id' => 'required|integer|exists:assign_users,id',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'errors' => $validator->errors(),
                ], 400); // 400 Bad Request
            }

            $agent_id = $request->input('agent_id');

            try {

                // // decreasing team size 
                // $team_id = AssignUser::where('id', $agent_id)->pluck('team');
                // return $team_id;
                // $team = Team::where('id', $team_id)->first();
                // if ($team) {
                //     // Increment the size column by +1
                //     $team->size -= 1;
                //     $team->save();
                // } else {
                //     return response()->json(['error' => 'Team not found'], 404);
                // }
                // Fetch team IDs as a comma-separated string
                $team_ids_string = AssignUser::where('id', $agent_id)->pluck('team')->first();

                if ($team_ids_string) {
                    // Split the comma-separated string into an array of team IDs
                    $team_ids = explode(',', $team_ids_string);

                    // Iterate over each team ID and decrement the size
                    foreach ($team_ids as $team_id) {
                        $team = Team::where('id', $team_id)->first();
                        if ($team) {
                            // Decrement the size column by -1
                            $team->size -= 1;
                            $team->save();
                        } else {
                            return response()->json(['error' => 'Team not found'], 404);
                        }
                    }
                } else {
                    return response()->json(['error' => 'Team IDs not found'], 404);
                }

                // Find the team by ID
                $user = AssignUser::findOrFail($agent_id);

                // Delete the team
                $user->delete();

                return response()->json([
                    'message' => 'User deleted successfully',
                ], 200); // 200 OK
            } catch (\Exception $e) {
                // Handle any unexpected errors
                return response()->json([
                    'message' => 'An error occurred while deleting the team',
                    'error' => $e->getMessage(),
                ], 500); // 500 Internal Server Error
            }
        } elseif ($action === 'update') {

            // Define validation rules
            $validator = Validator::make($request->all(), [
                'agent_id' => 'required',
                'username' => 'required|string|max:255|exists:ci_admin,username',
                'assign_user' => 'required|string|max:255',
                'agent_email' => 'nullable|string|email|max:255',
                'agent_mobile' => 'nullable|string|max:255',
                'roll' => 'nullable|integer',
                'online_status' => 'nullable|integer',
                'is_mobile_verified' => 'nullable|boolean',
                'is_email_verified' => 'nullable|boolean',
                'team' => 'required|array', // Validate that team is an array
                'team.*' => 'required|integer|max:255|exists:teams,id',
                'last_login_at' => 'nullable|date|date_format:Y-m-d H:i:s',
                'last_login_IP' => 'nullable|string|max:255',
            ]);

            // Check if validation fails
            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 400);
            }

            $agent_id = $request->input('agent_id');

            try {
                $assignUser = AssignUser::findOrFail($agent_id);

                // Check for no changes
                $requestData = [
                    'username' => $request->input('username'),
                    'assign_user' => $request->input('assign_user'),
                    'agent_email' => $request->input('agent_email'),
                    'agent_mobile' => $request->input('agent_mobile'),
                    'roll' => $request->input('roll', 0),
                    'online_status' => $request->input('online_status', 0),
                    'is_mobile_verified' => $request->input('is_mobile_verified', 0),
                    'is_email_verified' => $request->input('is_email_verified', 0),
                    'team' => implode(',', $request->input('team')),
                    'last_login_at' => $request->input('last_login_at'),
                    'last_login_IP' => $request->input('last_login_IP'),
                ];

                $existingData = $assignUser->only(array_keys($requestData));

                if ($requestData == $existingData) {
                    return response()->json(['error' => 'No changes were made'], 400);
                }

                // Decrement the size for the old teams
                $old_team_ids_string = $assignUser->team;
                $old_team_ids = explode(',', $old_team_ids_string);
                foreach ($old_team_ids as $old_team_id) {
                    $team = Team::where('id', $old_team_id)->first();
                    if ($team) {
                        $team->size -= 1;
                        $team->save();
                    }
                }

                // Increment the size for the new teams
                $new_team_ids = $request->input('team');
                foreach ($new_team_ids as $new_team_id) {
                    $team = Team::where('id', $new_team_id)->first();
                    if ($team) {
                        $team->size += 1;
                        $team->save();
                    }
                }

                // Convert the array of new team IDs to a comma-separated string
                $new_team_string = implode(',', $new_team_ids);

                // Update the assign user
                $assignUser->update([
                    'username' => $request->input('username'),
                    'assign_user' => $request->input('assign_user'),
                    'agent_email' => $request->input('agent_email'),
                    'agent_mobile' => $request->input('agent_mobile'),
                    'roll' => $request->input('roll', 0),
                    'online_status' => $request->input('online_status', 0),
                    'is_mobile_verified' => $request->input('is_mobile_verified', 0),
                    'is_email_verified' => $request->input('is_email_verified', 0),
                    'team' => $new_team_string,
                    'last_login_at' => $request->input('last_login_at'),
                    'last_login_IP' => $request->input('last_login_IP'),
                ]);

                return response()->json(['success' => 'Data updated successfully', 'data' => $assignUser], 200);
            } catch (\Exception $e) {
                return response()->json(['error' => 'Failed to update data', 'message' => $e->getMessage()], 500);
            }
        }
    }
}
