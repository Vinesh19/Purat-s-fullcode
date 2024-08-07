<?php

namespace App\Http\Controllers;

use App\Models\ChatInboxNote;
use App\Models\ChatMessage;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class CRMController extends Controller
{
    public function handleAllData(Request $request)
    {

        // Define validation rules
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:100|exists:ci_admin,username',
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            return response()->json([
                'details' => $validator->errors()
            ], 400); // 400 Bad Request
        }

        // Extract values from the input fields
        $username = $request->input('username'); // Retrieve the username
        $sender = User::where('username', $username)->select('mobile_no')->first();
        $sender_id = $sender ? $sender->mobile_no : null; //

        $messages = ChatMessage::query();
        $messages = $messages->where('sender_id', $sender_id);

        $receiverIds = $messages->pluck('receiver_id')->unique()->toArray();


        $latestMessageIds = ChatMessage::selectRaw('MAX(id) as id')
            ->whereIn('receiver_id', $receiverIds)
            ->groupBy('receiver_id')
            ->pluck('id');
        // return $latestMessageIds;


        $messages = ChatMessage::whereIn('id', $latestMessageIds)
            ->whereHas('chatRoom', function ($query) use ($sender_id) {
                $query->where('sender_id', $sender_id);
            })
            ->with('chatRoom')
            ->select('receiver_id', 'sender_id', 'replySourceMessage', 'text', 'created_at', 'updated_at', 'agent')
            ->get();

        return $messages;

        // Return response based on result
        if ($messages->isEmpty()) {
            return response()->json([
                'message' => 'No data found in the database.',
                'data' => []
            ], 404); // Using 404 status code to indicate "Not Found"
        }

        return response()->json([
            'message' => 'Data retrieved successfully.',
            'data' => $messages
        ]);
    }

    public function handleSpecificData(Request $request)
    {
        // Validate the input
        $validator = Validator::make($request->all(), [
            'receiver_id' => 'required|string|max:20',
            'username' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        try {
            // Get the input values
            $receiver_id = $request->input('receiver_id');
            $username = $request->input('username'); // Retrieve the username
            $sender = User::where('username', $username)->select('mobile_no')->first();
            $sender_id = $sender ? $sender->mobile_no : null; //

            $messages = ChatMessage::where('receiver_id', $receiver_id)
                ->whereHas('chatRoom', function ($query) use ($sender_id) {
                    $query->where('sender_id', $sender_id);
                })
                ->with(['chatRoom' => function ($query) {
                    $query->select('receiver_id', 'status'); // Ensure to select 'id' to maintain the relationship
                }])
                ->orderBy('created_at', 'desc') // Sorting from old to new
                ->select('agent', 'created_at', 'updated_at', 'replySourceMessage', 'receiver_id')
                ->first();

            $notes = ChatInboxNote::where('username', $username)
                ->where('receiver_id', $receiver_id)->get();

            return response()->json([
                'message' => 'Data retrieved successfully',
                'data' => $messages,
                'notes' => $notes
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Something went wrong', 'details' => $e->getMessage()], 500);
        }
    }
}
