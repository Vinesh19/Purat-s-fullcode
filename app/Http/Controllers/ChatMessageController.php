<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ChatMessageController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:100|exists:ci_admin,username',
            'sender_id' => 'required|string|max:20',
            'receiver_id' => 'required|string|max:20',
            'status' => 'required|integer',
            'agent' => 'required|string|max:100',
            'previous_agent' => 'required|string|max:100',
            'first_message' => 'required|integer',
            'eventDescription' => 'required|string',
            'replySourceMessage' => 'required|string|max:500',
            'text' => 'required|string',
            'type' => 'required|string',
            'eventtype' => 'required|string|max:100',
            'whts_ref_id' => 'required|string|max:200',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
        try {
            $chatMessage = ChatMessage::create($request->all());
            return response()->json(['message' => 'data submitted successfully', 'data' => $chatMessage, 'status' => 1], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function fetchMessages(Request $request)
    {
        try {

            // Define validation rules
            $validator = Validator::make($request->all(), [
                'username' => 'required|string|max:100|exists:ci_admin,username',
                'filter' => 'nullable|in:open,pending,broadcast,active,expired,unassigned',
            ]);

            // Check if validation fails
            if ($validator->fails()) {
                return response()->json([
                    'details' => $validator->errors()
                ], 400); // 400 Bad Request
            }

            // Extract values from the input fields
            $filter = $request->input('filter');
            $username = $request->input('username'); // Retrieve the username

            $messages = ChatMessage::query();
            // Filter by username
            $messages->where('username', $username); // Added filter for username

            // Apply filters based on input values
            if ($filter == 'open') {
                $messages->where('first_message', '1');
            }
            if ($filter == 'pending') {
                $messages->where('first_message', '2');
            }
            if ($filter == 'broadcast') {
                $messages->where('eventtype', 'broadcastMessage');
            }
            if ($filter == 'active') {
                $messages->where('created_at', '>=', now()->subDay());
            }
            if ($filter == 'expired') {
                $messages->where('created_at', '<', now()->subDay());
            }
            if ($filter == 'unassigned') {
                $messages->where('agent', '');
            }

            if (isset($eventDescription)) {
                if ($eventDescription == 'null') {
                    $messages->where(function ($query) {
                        $query->whereNull('eventDescription')
                            ->orWhere('eventDescription', '');
                    });
                } else {
                    $messages->where('eventDescription', $eventDescription);
                }
            }

            $result = $messages->get();

            // Return response based on result
            if ($result->isEmpty()) {
                return response()->json([
                    'message' => 'No data found in the database.',
                    'data' => []
                ], 404); // Using 404 status code to indicate "Not Found"
            }

            return response()->json([
                'message' => 'Data retrieved successfully.',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }




    public function getUniqueMessages(Request $request)
    {
        // Define validation rules
        $validator = Validator::make($request->all(), [
            'username' => 'required|string'
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            return response()->json([
                'error' => 'Invalid parameter-value passed',
                'details' => $validator->errors()
            ], 400); // 400 Bad Request
        }

        // Retrieve the username from the request
        $username = $request->input('username');

        // Query to select unique receiver_id and replySourceMessage where username matches
        // $uniqueMessages = ChatMessage::select('receiver_id', 'replySourceMessage')
        //     ->where('username', $username)
        //     ->groupBy('receiver_id', 'replySourceMessage')
        //     ->get();
        // Query to select unique receiver_id and replySourceMessage where username matches
        $uniqueMessages = ChatMessage::select('username', 'receiver_id', 'replySourceMessage')
            ->where('username', $username)
            ->distinct()
            ->get();
        return response()->json($uniqueMessages);
    }
}
