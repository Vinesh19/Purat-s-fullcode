<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\MobNo3;
use App\Models\AssignUser;
use App\Models\ChatMessage;
use Illuminate\Http\Request;
use App\Models\ChatMessageRoom;
// use Illuminate\Auth\Events\Login;
// use Illuminate\Auth\Events\Logout;
// use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Validator;

class ChatMessageController extends Controller
{

    public function getFilteredData(Request $request)
    {
        // Define validation rules
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:100|exists:ci_admin,username',
            'action' => 'required'
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
        // return $sender_id;

        $action = $request->input('action');
        if ($action === 'open') {
            $messages = ChatMessageRoom::query();
            $messages = $messages->where('sender_id', $sender_id)->where('status', '0');
        } elseif ($action === 'expired') {
            $messages = ChatMessageRoom::query();
            $messages = $messages->where('sender_id', $sender_id)->where('status', '1');
        } elseif ($action === 'pending') {
            $messages = ChatMessageRoom::query();
            $messages = $messages->where('sender_id', $sender_id)->where('status', '2');
        } elseif ($action === 'solved') {
            $messages = ChatMessageRoom::query();
            $messages = $messages->where('sender_id', $sender_id)->where('status', '3');
        } elseif ($action === 'spam') {
            $messages = ChatMessageRoom::query();
            $messages = $messages->where('sender_id', $sender_id)->where('status', '4');
        } elseif ($action === 'favorite') {
            $messages = ChatMessageRoom::query();
            $messages = $messages->where('sender_id', $sender_id)->where('is_starred', '1');
        } elseif ($action === 'unread') {
            $messages = ChatMessageRoom::query();
            $messages = $messages->where('sender_id', $sender_id)->where('is_read', '0');
        } elseif ($action === 'active') {
            $messages = ChatMessage::query();
            $messages = $messages->where('sender_id', $sender_id)->where('created_at', '>=', now()->subDay());
        } elseif ($action === 'broadcast') {
            $messages = ChatMessage::query();
            $messages = $messages->where('sender_id', $sender_id)->where('eventtype', 'broadcastMessage');
        } elseif ($action === 'unassigned') {
            $messages = ChatMessage::query();
            $messages = $messages->where('sender_id', $sender_id)->where('agent', '');
        } elseif ($action === 'assign_to_me') {
            // Define validation rules
            $validator = Validator::make($request->all(), [
                'agent_id' => 'required',
            ]);
            // Check if validation fails
            if ($validator->fails()) {
                return response()->json([
                    'details' => $validator->errors()
                ], 400); // 400 Bad Request
            }
            $assignUser = AssignUser::where('id', $request->input('agent_id'))->where('username', $request->input('username'))->first();
            if (!$assignUser) {
                return response()->json([
                    'message' => 'No records found for the given id',
                ], 404);
            }
            $assign_user = $assignUser->assign_user;
            $messages = ChatMessage::query();
            $messages = $messages->where('sender_id', $sender_id)->where('agent', $assign_user);
        } elseif ($action === 'contacts') {
            $messages = ChatMessage::query();
            $messages = $messages->where('sender_id', $sender_id);
        } else {
            return response()->json(['error' => 'Invalid value for the given action'], 400);
        }

        $receiverIds = $messages->pluck('receiver_id')->unique()->toArray();
        //yaha unique receiver_ids mili hai Room se
        // return $receiverIds;

        $latestMessageIds = ChatMessage::selectRaw('MAX(id) as id')
            ->whereIn('receiver_id', $receiverIds)
            ->groupBy('receiver_id')
            ->pluck('id');
        //yaha unique receiver_ids(Room) ki, latest message wali row ki id mili h (ChatMessage se)
        // return $latestMessageIds;

        $messages = ChatMessage::whereIn('id', $latestMessageIds)
            ->whereHas('chatRoom', function ($query) use ($sender_id) {
                $query->where('sender_id', $sender_id);
            })
            ->with('chatRoom')
            ->select('receiver_id', 'sender_id', 'replySourceMessage', 'text', 'created_at', 'updated_at')
            ->get();

        // Transforming the messages
        $transformedMessages = $messages->map(function ($message) {
            if ($message->chatRoom) {
                $message->chatRoom->status = match ($message->chatRoom->status) {
                    0 => 'open',
                    1 => 'expired',
                    2 => 'pending',
                    3 => 'solved',
                    4 => 'spam',
                    default => 'unknown',
                };

                $message->chatRoom->is_read = $message->chatRoom->is_read == 0 ? 'unread' : 'read';
                $message->chatRoom->is_starred = $message->chatRoom->is_starred == 0 ? 'not favorite' : 'favorite';
            }
            return $message;
        });

        // Calculating counts
        $totalCount = $transformedMessages->count();
        $unreadCount = $transformedMessages->filter(fn ($message) => $message->chatRoom && $message->chatRoom->is_read == 'unread')->count();

        // Return response based on result
        if ($messages->isEmpty()) {
            return response()->json([
                'message' => 'No data found in the database.',
                'data' => []
            ], 404); // Using 404 status code to indicate "Not Found"
        }

        return response()->json([
            'message' => 'Data retrieved successfully.',
            'total_unread' => $unreadCount,
            'total_count' => $totalCount,
            'data' => $messages
        ]);
    }

    public function fetchMessages(Request $request)
    {
        // Validate the input
        $validator = Validator::make($request->all(), [
            'receiver_id' => 'required|string|max:20',
            // 'sender_id' => 'required|string|max:20',
            'username' => 'required|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        try {
            // Get the input values
            $receiver_id = $request->input('receiver_id');
            $username = $request->input('username');
            $sender_id = User::where('username', $username)->pluck('mobile_no');
            // return $sender_id;

            // Fetch the chat messages
            $messages = ChatMessage::where('receiver_id', $receiver_id)
                ->where('sender_id', $sender_id)
                ->orderBy('created_at', 'asc') // Sorting from old to new
                ->select('text', 'type', 'agent', 'created_at', 'updated_at', 'eventDescription', 'sender_id', 'receiver_id')
                ->get();

            return response()->json([
                'message' => 'Data retrieved successfully',
                'data' => $messages
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Something went wrong', 'details' => $e->getMessage()], 500);
        }
    }

    public function updateColumn(Request $request)
    {
        // Validate the input
        $validator = Validator::make($request->all(), [
            'action' => 'required|string|in:status,is_read,is_starred,is_blocked',
            'receiver_id' => 'required|string|max:20',
            // 'sender_id' => 'required|string|max:20',
            'username' => 'required|string',
            'value' => 'required|integer'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        try {
            // Get the input values
            $action = $request->input('action');
            $receiver_id = $request->input('receiver_id');
            $username = $request->input('username');
            $value = $request->input('value');
            // Fetch the sender's mobile_no
            // $sender_id = User::where('username', $username)->pluck('mobile_no');
            $sender = User::where('username', $username)->select('mobile_no')->first();
            $sender_id = $sender ? $sender->mobile_no : null;

            // Fetch the chat message room
            $chatMessageRoom = ChatMessageRoom::where('receiver_id', $receiver_id)
                ->where('sender_id', $sender_id)
                ->first();
            // return $chatMessageRoom;

            if (!$chatMessageRoom) {
                return response()->json(['error' => 'data for provided receiver_id not found'], 404);
            }

            // Check if the value is already set
            $currentValue = null;
            switch ($action) {
                case 'status':
                    $currentValue = $chatMessageRoom->status;
                    break;
                case 'is_read':
                    $currentValue = $chatMessageRoom->is_read;
                    break;
                case 'is_starred':
                    $currentValue = $chatMessageRoom->is_starred;
                    break;
                case 'is_blocked':
                    $currentValue = $chatMessageRoom->is_blocked;
                    break;
            }

            if ($currentValue == $value) {
                return response()->json([
                    'status' => 0,
                    'message' => 'No changes needed. The value (' . $value . ') is already up-to-date.'
                ], 200);
            }

            // Update the column based on the action
            if ($action === 'status' && in_array($value, [0, 1, 2, 3, 4])) {
                $chatMessageRoom->status = $value;
            } elseif ($action === 'is_read' && in_array($value, [0, 1])) {
                $chatMessageRoom->is_read = $value;
            } elseif ($action === 'is_starred' && in_array($value, [0, 1])) {
                $chatMessageRoom->is_starred = $value;
            } elseif ($action === 'is_blocked' && in_array($value, [0, 1])) {
                $chatMessageRoom->is_blocked = $value;
            } else {
                return response()->json(['error' => 'Invalid value for the given action'], 400);
            }

            // Save the updated chat message room
            $chatMessageRoom->save();

            return response()->json(['message' => 'Column updated successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Something went wrong', 'details' => $e->getMessage()], 500);
        }
    }

    public function getAdvanceFilteredData(Request $request)
    {
        // Validate that the request contains an array of actions
        $validator = Validator::make($request->all(), [
            'actions' => 'required|array',
            'actions.*.action' => 'required|string|in:attribute,assignee,status,tag,team',
            'actions.*.username' => 'required|string|max:100|exists:ci_admin,username',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'details' => $validator->errors()
            ], 400); // 400 Bad Request
        }

        $result = collect(); // This will store the intermediate results

        // Loop through each action provided in the array
        foreach ($request->input('actions') as $actionData) {
            $action = $actionData['action'];

            // Break the loop if the previous result is empty and it's not the first action
            if (!$result->isEmpty() && $result->count() == 0) {
                break;
            }

            switch ($action) {
                case 'attribute':

                    /// Example validation and processing logic for 'attribute'
                    $attributeValidation = Validator::make($actionData, [
                        'attribute' => 'required|string',
                        'value' => 'required|string',
                        'contain' => 'required|string|in:=,!=',
                        'username' => 'required|string|max:100|exists:ci_admin,username',
                    ]);

                    if ($attributeValidation->fails()) {
                        return response()->json(['errors' => $attributeValidation->errors()], 400);
                    }

                    $attribute = $actionData['attribute'];
                    $attributeValue = $actionData['value'];
                    $contain = $actionData['contain'];
                    $username = $actionData['username'];

                    $operator = $contain === '=' ? '=' : '!=';

                    // Define the attribute to media column mapping
                    $attributeMapping = [
                        'attribute1' => 'media2', 'attribute2' => 'media3', 'attribute3' => 'media4', 'attribute4' => 'media5',
                        'attribute5' => 'media6', 'attribute6' => 'media7', 'attribute7' => 'media8', 'attribute8' => 'media9',
                        'attribute9' => 'media10', 'attribute10' => 'media11', 'attribute11' => 'media12', 'attribute12' => 'media13'
                    ];

                    if (!array_key_exists($attribute, $attributeMapping)) {
                        return response()->json(['error' => 'Invalid attribute provided.'], 400);
                    }

                    $mediaColumn = $attributeMapping[$attribute];

                    $sender = User::where('username', $username)->select('mobile_no')->first();
                    $sender_id = $sender ? $sender->mobile_no : null;

                    // Build the query
                    $query = MobNo3::query();

                    // Add the username condition
                    $query->where('username', $username);
                    // $query->where('senderid', $sender_id);

                    // Add the attribute condition
                    $receiverIds = $query->where($mediaColumn, $operator, $attributeValue)
                        ->distinct()
                        ->pluck('receiver');
                    // return $receiverIds;

                    $latestMessageIds = ChatMessage::selectRaw('MAX(id) as id')
                        ->whereIn('receiver_id', $receiverIds)
                        ->groupBy('receiver_id')
                        ->pluck('id');

                    $messages = ChatMessage::whereIn('id', $latestMessageIds)
                        ->whereHas('chatRoom', function ($query) use ($sender_id) {
                            $query->where('sender_id', $sender_id);
                        })
                        ->where('text', 'RLIKE', '\\b' . $attributeValue . '\\b') // Use RLIKE to match the whole word
                        // ->where('text', 'like', '%' . $attributeValue . '%') // Add this condition to check if value is present in text
                        ->with('chatRoom')
                        ->select('receiver_id', 'sender_id', 'replySourceMessage', 'text', 'created_at', 'updated_at')
                        ->get();

                    // $result = $messages;
                    // $result = $result->merge($messages);
                    // $result = collect($messages);
                    $result = $result->isEmpty() ? collect($messages) : $result->merge($messages);
                    break;

                case 'status':

                    // Example validation and processing logic for 'status'
                    $statusValidation = Validator::make($actionData, [
                        'username' => 'required|string|max:100|exists:ci_admin,username',
                        'filter' => 'required|in:open,pending,solved,expired,spam',
                    ]);

                    if ($statusValidation->fails()) {
                        return response()->json(['errors' => $statusValidation->errors()], 422);
                    }

                    $filter = $actionData['filter'];
                    $username = $actionData['username']; // Retrieve the username

                    $sender = User::where('username', $username)->select('mobile_no')->first();
                    $sender_id = $sender ? $sender->mobile_no : null; //

                    $messages = ChatMessageRoom::query();

                    // Filter by username
                    // $messages->where('username', $username); // Added filter for username
                    $messages = $messages->where('sender_id', $sender_id); // Added filter for username

                    // Apply filters based on input values
                    if ($filter === 'open') {
                        $messages->where('status', '0');
                    }
                    if ($filter === 'expired') {
                        $messages->where('status', '1');
                    }
                    if ($filter === 'pending') {
                        $messages->where('status', '2');
                    }
                    if ($filter === 'solved') {
                        $messages->where('status', '3');
                    }
                    if ($filter === 'spam') {
                        $messages->where('status', '4');
                    }

                    $receiverIds = $messages->pluck('receiver_id')->unique()->toArray();
                    // return $receiverIds;

                    $latestMessageIds = ChatMessage::selectRaw('MAX(id) as id')
                        ->whereIn('receiver_id', $receiverIds)
                        ->groupBy('receiver_id')
                        ->pluck('id');

                    $messages = ChatMessage::whereIn('id', $latestMessageIds)
                        ->whereHas('chatRoom', function ($query) use ($sender_id) {
                            $query->where('sender_id', $sender_id);
                        })
                        ->with('chatRoom')
                        ->select('receiver_id', 'sender_id', 'replySourceMessage', 'text', 'created_at', 'updated_at')
                        ->get();

                    // $result = $messages;
                    // $result = $result->merge($messages);
                    // $result = collect($messages);
                    $result = $result->isEmpty() ? collect($messages) : $result->merge($messages);
                    // return $messages;
                    break;

                case 'assignee':
                    // Example validation and processing logic for 'assignee'
                    $assigneeValidation = Validator::make($actionData, [
                        'username' => 'required|string',
                        'agent_id' => 'required|integer',
                    ]);

                    if ($assigneeValidation->fails()) {
                        return response()->json(['errors' => $assigneeValidation->errors()], 422);
                    }

                    $username = $actionData['username'];
                    $agent_id = $actionData['agent_id'];

                    $sender = User::where('username', $username)->select('mobile_no')->first();
                    $sender_id = $sender ? $sender->mobile_no : null;
                    // return $sender_id;

                    $assignUser = AssignUser::where('id', $agent_id)->where('username', $username)->first();

                    if (!$assignUser) {
                        return response()->json([
                            'message' => 'No records found for the given id',
                        ], 404);
                    }

                    $assign_user = $assignUser->assign_user;
                    // return $assign_user;

                    $latestMessageIds = ChatMessage::selectRaw('MAX(id) as id')
                        ->where('sender_id', $sender_id)
                        ->where('agent', $assign_user)
                        ->groupBy('receiver_id')
                        ->pluck('id');

                    $messages = ChatMessage::whereIn('id', $latestMessageIds)
                        ->whereHas('chatRoom', function ($query) use ($sender_id) {
                            $query->where('sender_id', $sender_id);
                        })
                        ->with('chatRoom')
                        ->select('receiver_id', 'sender_id', 'replySourceMessage', 'text', 'created_at', 'updated_at')
                        ->get();

                    // $result = $messages;
                    // $result = $result->merge($messages);
                    // $result = collect($messages);
                    // return $result;
                    $result = $result->isEmpty() ? collect($messages) : $result->merge($messages);

                    break;

                default:
                    // Handle unknown action
                    return response()->json(['error' => 'Unknown action provided'], 400);
            }
        }

        return response()->json([
            'finalResults' => $result
        ]);
    }
}
