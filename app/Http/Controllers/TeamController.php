<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TeamController extends Controller
{
    public function store(Request $request)
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
            try {
                // Define validation rules
                $validator = Validator::make($request->all(), [
                    'username' => 'required|string|exists:ci_admin,username',
                    'team' => 'required|string|max:255',
                ]);

                // Check if validation fails
                if ($validator->fails()) {
                    return response()->json(['error' => $validator->errors()], 400);
                }

                // Check if the team is unique for the given username
                $existingTeam = Team::where('team', $request->team)->where('username', $request->username)->first();

                if ($existingTeam) {
                    return response()->json(['error' => 'The team name is already taken for this user.'], 422);
                }

                // Create the team
                $team = Team::create([
                    'team' => $request->team,
                    'username' => $request->username,
                ]);

                return response()->json(['message' => 'Team created successfully', 'team' => $team], 201);
            } catch (\Exception $e) {
                // Handle the exception
                return response()->json(['error' => 'Failed to create team', 'message' => $e->getMessage()], 500);
            }
        } elseif ($action === 'read') {
            try {
                // Define validation rules
                $validator = Validator::make($request->all(), [
                    'username' => 'required|string|exists:ci_admin,username',
                ]);

                // Check if validation fails
                if ($validator->fails()) {
                    return response()->json(['error' => $validator->errors()], 400);
                }

                // Check if the team is unique for the given username
                $team = Team::all();

                if (!$team) {
                    return response()->json(['error' => 'The team name is already taken for this user.'], 422);
                }

                return response()->json(['message' => 'Data retrieved successfully', 'team' => $team], 201);
            } catch (\Exception $e) {
                // Handle the exception
                return response()->json(['error' => 'Failed to retrieve data', 'message' => $e->getMessage()], 500);
            }
        } elseif ($action === 'update') {
            try {
                // Define validation rules
                $validator = Validator::make($request->all(), [
                    'username' => 'required|string|exists:ci_admin,username',
                    'team' => 'required|string|max:255',
                ]);

                // Check if validation fails
                if ($validator->fails()) {
                    return response()->json(['error' => $validator->errors()], 400);
                }

                // Retrieve the username and team from the request
                $username = $request->input('username');
                $teamName = $request->input('team');

                // Find the existing team
                $team = Team::where('username', $username)->where('team', $teamName)->first();

                if (!$team) {
                    return response()->json(['error' => 'Team not found for the given user.'], 404);
                }

                // Validate and update team details
                $request->validate([
                    'new_team_name' => 'required|string|max:255|unique:teams,team,NULL,id,username,' . $username,
                ]);

                $team->update([
                    'team' => $request->input('new_team_name'),
                ]);

                return response()->json(['message' => 'Team updated successfully', 'team' => $team], 200);
            } catch (\Exception $e) {
                // Handle the exception
                return response()->json(['error' => 'Failed to update team', 'message' => $e->getMessage()], 500);
            }
        } elseif ($action === 'delete') {

            // Define validation rules
            $validator = Validator::make($request->all(), [
                'team_id' => 'required|integer|exists:teams,id',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'errors' => $validator->errors(),
                ], 400); // 400 Bad Request
            }

            $team_id = $request->input('team_id');

            try {
                // Find the team by ID
                $team = Team::findOrFail($team_id);

                // Delete the team
                $team->delete();

                return response()->json([
                    'message' => 'Team deleted successfully',
                ], 200); // 200 OK
            } catch (\Exception $e) {
                // Handle any unexpected errors
                return response()->json([
                    'message' => 'An error occurred while deleting the team',
                    'error' => $e->getMessage(),
                ], 500); // 500 Internal Server Error
            }
        }
    }
}
