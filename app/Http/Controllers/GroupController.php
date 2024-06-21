<?php

namespace App\Http\Controllers;

use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


class GroupController extends Controller
{
    public function store(Request $request)
    {
        // Validate the incoming data
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer',
            'group_name' => 'required|string',
            'number' => 'required',
        ]);

        // Return validation errors if any
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        // Split the numbers on comma
        $numbers = explode(',', $request->number);

        // Process each number
        foreach ($numbers as $number) {
            // Create a new group entry for each number
            Group::create([
                'user_id' => $request->user_id,
                'group_name' => $request->group_name,
                'number' => trim($number) // Trim to remove any accidental whitespace
            ]);
        }

        return response()->json(['message' => 'Group-data inserted successfully'], 200);
    }

    public function show($group_name)
    {
        // URL decode the group_name in case it includes spaces or special characters
        $group_name = urldecode($group_name);

        // Retrieve the 'number' column only for all groups with the matching group_name
        // $groups = Group::where('group_name', $group_name)->get();
        $numbers = Group::where('group_name', $group_name)->pluck('number');

        // Check if any numbers were found
        if ($numbers->isEmpty()) {
            return response()->json([
                'status' => 0,
                'message' => 'No numbers found for the specified group name'
            ], 404);
        }

        // Return the numbers data with a success status and message
        return response()->json([
            'status' => 1,
            'message' => 'Success',
            'data' => $numbers
        ], 200);
    }
}
