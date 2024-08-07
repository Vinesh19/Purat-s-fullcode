<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\MobNo3;
use App\Models\AssignUser;
use App\Models\ChatMessage;
use Illuminate\Http\Request;
use App\Models\ChatMessageRoom;
use App\Models\QuickReply;
use App\Models\ChatInboxNote;
// use Illuminate\Auth\Events\Login;
// use Illuminate\Auth\Events\Logout;
// use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Validator;
// use App\Support\Facades\Storage;
// use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Storage; // Correct import statement


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
            ->select('receiver_id', 'sender_id', 'replySourceMessage', 'text', 'created_at', 'updated_at', 'agent', 'media')
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
                    5 => 'new',
                    6 => 'qualified',
                    7 => 'proposition',
                    8 => 'won',
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

    //********************chat messages starts here ******************************

    public function fetchMessages(Request $request)
    {
        // Define validation rules
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:20|exists:ci_admin,username',
            'action' => 'required|string'
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        try {
            // Extract values from the input fields
            $username = $request->input('username');
            $action = $request->input('action');
            $sender_id = User::where('username', $username)->pluck('mobile_no')->first();

            // Perform action based on the 'action' parameter
            switch ($action) {
                case 'read':
                    return $this->read($request, $sender_id);
                case 'create':
                    return $this->create($request, $sender_id, $username);
                case 'update':
                    return $this->updateChatMessage($request, $sender_id);
                case 'delete':
                    return $this->deleteChatMessage($request, $sender_id);
                default:
                    return response()->json(['error' => 'Invalid action provided'], 400);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Something went wrong', 'details' => $e->getMessage()], 500);
        }
    }

    private function read($request, $sender_id)
    {
        // Validate the input
        $validator = Validator::make($request->all(), [
            'receiver_id' => 'required|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        try {
            // Get the input values
            $receiver_id = $request->input('receiver_id');

            // Fetch the chat messages
            $messages = ChatMessage::where('receiver_id', $receiver_id)
                ->where('sender_id', $sender_id)
                ->orderBy('created_at', 'asc') // Sorting from old to new
                ->select('text', 'media', 'type', 'agent', 'created_at', 'updated_at', 'eventDescription', 'eventtype', 'sender_id', 'receiver_id', 'media')
                ->get();

            return response()->json([
                'message' => 'Data retrieved successfully',
                'data' => $messages
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Something went wrong', 'details' => $e->getMessage()], 500);
        }
    }

    private function create($request, $sender_id, $username)
    {
        // Validate the input
        $validator = Validator::make($request->all(), [
            'receiver_id' => 'required|string|max:20',
            'text' => 'nullable|string',
            'type' => 'string',
            'agent' => 'required|string',
            'eventDescription' => 'string',
            'media' => 'nullable|file|mimes:jpg,jpeg,png,gif,mp4,mp3|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        try {

            // Handle file upload if present
            if ($request->hasFile('media')) {
                $file = $request->file('media');
                $filePath = $file->store('media', 'public');
                $media = $filePath;
            }

            // Find the last row with the given receiver_id and sender_id
            $lastMessage = ChatMessage::where('receiver_id', $request->input('receiver_id'))
                ->where('sender_id', $sender_id)
                ->orderBy('created_at', 'desc')
                ->first();

            // If a last message exists, fetch the required fields
            $whts_ref_id = $lastMessage ? $lastMessage->whts_ref_id : 'default_whts_ref_id';
            $previous_agent = $lastMessage ? $lastMessage->previous_agent : 'default_previous_agent';
            $agent = $lastMessage ? $lastMessage->agent : $request->input('agent');
            $replySourceMessage = $lastMessage ? $lastMessage->replySourceMessage : 'default_replySourceMessage';

            // Create new chat message
            $chatMessage = new ChatMessage();
            $chatMessage->username = $username;
            $chatMessage->sender_id = $sender_id;
            $chatMessage->receiver_id = $request->input('receiver_id');
            $chatMessage->text = $request->input('text');
            $chatMessage->media = $media;
            $chatMessage->type = $request->input('type');
            $chatMessage->agent = $agent;
            $chatMessage->eventDescription = $request->input('eventDescription');
            $chatMessage->eventtype = 'broadcastMessage';
            $chatMessage->replySourceMessage = $replySourceMessage;
            $chatMessage->status = '1234';
            $chatMessage->previous_agent = $previous_agent;
            $chatMessage->whts_ref_id = $whts_ref_id;
            $chatMessage->save();

            return response()->json([
                'message' => 'Message created successfully',
                'data' => $chatMessage
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Something went wrong', 'details' => $e->getMessage()], 500);
        }
    }
    //**********************************************************************************


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
            if ($action === 'status' && in_array($value, [0, 1, 2, 3, 4, 5, 6, 7, 8])) {
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

    
    //********************quick reply starts here ******************************
    public function handleQuickReplies(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'action' => 'required|string',
            'username' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 0, 'error' => $validator->errors()], 400);
        }

        $action = $request->input('action');
        $username = $request->input('username');

        try {
            switch ($action) {
                case 'create':
                    return $this->createQuickReplies($request, $username);
                case 'read':
                    return $this->readQuickReplies($request, $username);
                case 'update':
                    return $this->updateQuickReplies($request, $username);
                case 'delete':
                    return $this->deleteQuickReplies($request, $username);
                default:
                    return response()->json(['status' => 0, 'error' => 'Invalid action provided'], 400);
            }
        } catch (\Exception $e) {
            return response()->json(['status' => 0, 'error' => 'Something went wrong', 'details' => $e->getMessage()], 500);
        }
    }

    private function createQuickReplies($request, $username)
    {
        $validator = Validator::make($request->all(), [
            'heading' => 'required|string|max:255',
            'description' => 'required|string|max:2000',
            'media' => 'nullable|file|max:25600', // 25MB in KB
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 0, 'error' => $validator->errors()], 400);
        }

        $existsUser = QuickReply::where('heading', $request->input('heading'))->first();

        if ($existsUser) {
            return response()->json(['error' => 'You already have a quick_reply with this name'], 400);
        }

        $media = $request->file('media');
        $media_file_Path = $media ? $media->store('media', 'public') : null;

        // Get the full URL of the stored media file
        $media_file_Url = $media_file_Path ? Storage::url($media_file_Path) : null;

        $quickReply = QuickReply::create([
            'username' => $username,
            'heading' => $request->input('heading'),
            'description' => $request->input('description'),
            'media' => $media_file_Path,
        ]);

        return response()->json(
            [
                'status' => 1,
                'message' => 'Quick reply created successfully',
                'data' => $quickReply,
                // 'path' => $media_file_Url
            ],
            201
        );
    }

    private function readQuickReplies($request, $username)
    {
        $quickReplies = QuickReply::where('username', $username)->get();
        return response()->json(['status' => 1, 'message' => 'Data retrieved successfully', 'data' => $quickReplies], 200);
    }

    private function updateQuickReplies($request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:quick_replies,id',
            'heading' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:2000',
            'media' => 'nullable|file|max:25600', // 25MB in KB
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 0, 'error' => $validator->errors()], 400);
        }

        $quickReply = QuickReply::find($request->input('id'));

        // Handle media replacement
        if ($request->hasFile('media')) {
            // Delete the old media file
            if ($quickReply->media) {
                Storage::disk('public')->delete($quickReply->media);
            }

            // Store the new media file
            $media = $request->file('media');
            $media_file_Path = $media->store('media', 'public');

            // Get the full URL of the stored media file
            $media_file_Url = Storage::url($media_file_Path);

            // Update the media path in the quickReply model
            $quickReply->media = $media_file_Path;
        }

        // Update the other fields
        $quickReply->update($request->only(['heading', 'description']));

        return response()->json(['status' => 1, 'message' => 'Quick reply updated successfully', 'data' => $quickReply], 200);
    }

    private function deleteQuickReplies($request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:quick_replies,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 0, 'error' => $validator->errors()], 400);
        }

        $quickReply = QuickReply::find($request->input('id'));

        if($quickReply->media){
            Storage::disk('public')->delete($quickReply->media);
        }
        $quickReply->delete();

        return response()->json(['status' => 1, 'message' => 'Quick reply deleted successfully'], 200);
    }
    //**************************************************

     //********************note API starts here ******************************

    public function handleNote(Request $request)
    {
        // Use Validator for more control over validation
        $validator = Validator::make($request->all(), [
            'username' => 'required_if:action,create,read|string|max:255',
            'receiver_id' => 'required_if:action,create,read|string|max:255',
            'note' => 'required_if:action,create,update|string|max:400',
            'action' => 'required|string|in:create,read,update,delete|max:255',
            'id' => 'required_if:action,update,delete',
            'assign_user' => 'required_if:action,create,update|max:255|exists:assign_users,assign_user'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 0, 'error' => $validator->errors()], 400);
        }

        $action = $request->input('action');
        $username = $request->input('username');
        $id = $request->input('id');

        try {
            switch ($action) {
                case 'create':
                    return $this->createNote($request, $username);
                case 'read':
                    return $this->readNote($request,  $username);
                case 'update':
                    return $this->updateNote($request,  $id);
                case 'delete':
                    return $this->deleteNote($id);
                default:
                    return response()->json(['status' => 0, 'error' => 'Invalid action provided'], 400);
            }
        } catch (\Exception $e) {
            return response()->json(['status' => 0, 'error' => $e->getMessage()], 500);
        }
    }

    private function createNote(Request $request, $username)
    {

        $receiverId = $request->input('receiver_id');
        $note = $request->input('note');
        $assign_user = $request->input('assign_user');

        // Create a new record in ChatInboxNote
        $chatInboxNote = new ChatInboxNote();
        $chatInboxNote->username = $username;  // Assuming 'username' is the sender's ID
        $chatInboxNote->receiver_id = $receiverId;
        $chatInboxNote->note = $note;
        $chatInboxNote->assign_user = $assign_user;
        $chatInboxNote->save();

        return response()->json(['status' => 1, 'message' => 'Note inserted successfully']);
    }

    private function readNote(Request $request, $username)
    {
        $receiverId = $request->input('receiver_id');

        $notes = ChatInboxNote::where('receiver_id', $receiverId)
            ->where('username', $username)
            ->select('id', 'note', 'assign_user', 'created_at', 'updated_at')->get();

        if (!$notes) {
            return response()->json(['status' => 0, 'error' => 'record not found Chat message room'], 404);
        }

        return response()->json(['status' => 1, 'data' => $notes]);
    }

    private function updateNote(Request $request, $id)
    {
        $inputNote = $request->input('note');
        $inputAssignUser = $request->input('assign_user');

        $note = ChatInboxNote::where('id', $id)
            ->first();

        if (!$note) {
            return response()->json(['status' => 0, 'error' => 'note not found'], 404);
        }

        $note->assign_user = $inputAssignUser;
        $note->note = $inputNote;
        $note->save();

        return response()->json(['status' => 1, 'message' => 'Note updated successfully']);
    }

    private function deleteNote($id)
    {

        $note = ChatInboxNote::where('id', $id)
            ->first();

        if (!$note) {
            return response()->json(['status' => 0, 'error' => 'note not found'], 404);
        }

        $note->note = null;
        $note->delete();

        return response()->json(['status' => 1, 'message' => 'note deleted successfully']);
    }
    //**************************************************

}
