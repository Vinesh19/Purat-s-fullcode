<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BroadcastTable;
use Illuminate\Support\Facades\Validator;

class BroadcastTableController extends Controller
{
    public function store(Request $request)
    {
        // Manually validate incoming request
        $validator = Validator::make($request->all(), [
            'username' => 'required|string',
            'template_id' => 'required|integer',
            'message' => 'nullable|string',
            'broadcast_name' => 'required|string',
            'broadcast_number' => 'nullable|string',
            'contacts' => 'string',
            'status' => 'integer',
            'success_full_per' => 'nullable|string|max:45',
            'media1' => 'nullable|mimes:avif,jpg,png,jpeg|max:3000',
            'media2' => 'nullable|string',
            'media3' => 'nullable|string',
            'media4' => 'nullable|string',
            'media5' => 'nullable|string',
            'media6' => 'nullable|string',
            'media7' => 'nullable|string',
            'media8' => 'nullable|string',
            'broadcast_message' => 'nullable|string',
            'lineCount' => 'nullable|string|max:50',
            'group_table_length' => 'nullable|string|max:50',
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            return response()->json(['status' => 0, 'errors' => $validator->errors()], 400);
        }

        // Handle file upload for media1
        if ($request->hasFile('media1')) {
            $media1 = $request->file('media1');
            $media1Path = $media1->store('media', 'public'); // Store the file in the 'public/media' directory
            $request->merge(['media1' => $media1Path]); // Merge the file path into the request data
        }

        // Create new record in database using Eloquent ORM
        try {
            $broadcast = BroadcastTable::create($request->all());

            // Optionally, you can perform additional actions here before returning success
            // For example, sending notifications or triggering other events

            return response()->json(['status' => 1], 200);
        } catch (\Exception $e) {
            // Log or handle error appropriately
            return response()->json(['status' => 0, 'error' => $e->getMessage()], 500);
        }
    }

    // public function store(Request $request)
    // {
    //     // Manually validate incoming request
    //     $validator = Validator::make($request->all(), [
    //         'username' => 'required|string',
    //         'template_id' => 'required|integer',
    //         'message' => 'nullable|string',
    //         'broadcast_name' => 'required|string',
    //         'broadcast_number' => 'nullable|string',
    //         'contacts' => 'string',
    //         'status' => 'integer',
    //         'success_full_per' => 'nullable|string|max:45',
    //         'media1' => 'nullable|string',
    //         'media2' => 'nullable|string',
    //         'media3' => 'nullable|string',
    //         'media4' => 'nullable|string',
    //         'media5' => 'nullable|string',
    //         'media6' => 'nullable|string',
    //         'media7' => 'nullable|string',
    //         'media8' => 'nullable|string',
    //         'broadcast_message' => 'nullable|string',
    //         'lineCount' => 'nullable|string|max:50',
    //         'group_table_length' => 'nullable|string|max:50',
    //     ]);

    //     // Check if validation fails
    //     if ($validator->fails()) {
    //         return response()->json(['status' => 0, 'errors' => $validator->errors()], 400);
    //     }

    //     // Create new record in database using Eloquent ORM
    //     try {
    //         $broadcast = BroadcastTable::create($request->all());

    //         // Optionally, you can perform additional actions here before returning success
    //         // For example, sending notifications or triggering other events

    //         return response()->json(['status' => 1], 200);
    //     } catch (\Exception $e) {
    //         // Log or handle error appropriately
    //         return response()->json(['status' => 0, 'error' => $e->getMessage()], 500);
    //     }
    // }
}
