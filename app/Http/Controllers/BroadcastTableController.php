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
            'schedule_date' => 'required|date',
            'schedule_time' => 'required|date_format:H:i',
            'contacts' => 'required|string',
            'created_at' => 'required|date',
            'status' => 'integer',
            'success_full_per' => 'nullable|string|max:45',
            'media1' => 'nullable|string',
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
}
