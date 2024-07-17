<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\MobNo3;
use App\Models\AssignUser;
use App\Models\ChatMessage;
use Illuminate\Http\Request;
use App\Models\ChatMessageRoom;
use Illuminate\Support\Facades\Validator;

class ChatMessageController extends Controller
{

    public function getFilteredData(Request $request)
    {
        try {
            $action = $request->input('action');
            if ($action === 'assign_to_me') {

                try {
                    $request->validate([
                        'agent_id' => 'required|integer',
                        'username' => 'required|string',
                    ]);

                    $sender = User::where('username', $request->input('username'))->select('mobile_no')->first();
                    $sender_id = $sender ? $sender->mobile_no : null;

                    $assignUser = AssignUser::where('id', $request->input('agent_id'))->where('username', $request->input('username'))->first();

                    if (!$assignUser) {
                        return response()->json([
                            'message' => 'No records found for the given id',
                        ], 404);
                    }

                    $assign_user = $assignUser->assign_user;

                    $latestMessageIds = ChatMessage::selectRaw('MAX(id) as id')
                        ->where('sender_id', $sender_id)
                        ->where('agent', $assign_user)
                        ->groupBy('replySourceMessage');
                    // ->pluck('id');

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

                    if ($messages->isEmpty()) {
                        return response()->json([
                            'message' => 'No chat messages found for the given agent',
                        ], 404);
                    }

                    return response()->json([
                        'message' => 'Data retrieved successfully.',
                        'totalCount' => $totalCount,
                        'unreadCount' => $unreadCount,
                        'data' => $transformedMessages
                    ]);
                } catch (\Exception $e) {
                    return response()->json([
                        'message' => 'An error occurred while fetching the chat messages.',
                        'error' => $e->getMessage(),
                    ], 500);
                } catch (\Exception $e) {
                    return response()->json([
                        'message' => 'An error occurred while fetching the chat messages.',
                        'error' => $e->getMessage(),
                    ], 500);
                }
            } elseif ($action === 'favorite') {
                try {
                    // Validate the request inputs
                    $validator = Validator::make($request->all(), [
                        'username' => 'required|string',
                        // 'filter' => 'required|in:favorite,unfavorite'
                    ]);

                    if ($validator->fails()) {
                        return response()->json(['error' => $validator->errors()], 400);
                    }

                    $username = $request->input('username');
                    // $filter = $request->input('filter');

                    // Find the user by username
                    $user = User::where('username', $username)->first();
                    if (!$user) {
                        return response()->json(['error' => 'User not found'], 404);
                    }

                    $sender_id = $user->mobile_no;

                    // Fetch the ChatMessagesRoom rows where sender_id matches the user's mobile_no and filter by is_starred
                    // $is_starred = $filter === 'favorite' ? 1 : 0;
                    $chatMessageRooms = ChatMessageRoom::where('sender_id', $sender_id)
                        ->where('is_starred', '1')
                        ->get();

                    if ($chatMessageRooms->isEmpty()) {
                        return response()->json(['error' => 'No data found in ChatMessageRoom'], 404);
                    };

                    // Extract all receiverIds from the matched ChatMessagesRoom rows
                    $receiverIds = $chatMessageRooms->pluck('receiver_id')->toArray();
                    // return $receiverIds;

                    $latestMessageIds = ChatMessage::selectRaw('MAX(id) as id')
                        ->whereIn('receiver_id', $receiverIds)
                        ->groupBy('replySourceMessage')
                        ->pluck('id');

                    // $messages = ChatMessage::whereIn('id', $latestMessageIds)
                    //     ->whereHas('chatRoom', function ($query) use ($sender_id) {
                    //         $query->where('sender_id', $sender_id);
                    //     })
                    //     ->with('chatRoom')
                    //     ->select('receiver_id', 'sender_id', 'replySourceMessage', 'text', 'created_at', 'updated_at')
                    //     ->get();
                    $messages = ChatMessage::whereIn('id', $latestMessageIds)
                        ->whereHas('chatRoom', function ($query) use ($sender_id) {
                            $query->where('sender_id', $sender_id);
                        })
                        ->with(['chatRoom' => function ($query) {
                            $query->select('receiver_id', 'is_read', 'status', 'is_starred');
                        }])
                        ->select('receiver_id', 'replySourceMessage', 'text', 'created_at', 'updated_at')
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


                    // $result2 = collect();
                    // $unread_count = 0;

                    // foreach ($receiverIds as $receiverId) {
                    //     $latestMessageIds = ChatMessage::selectRaw('MAX(id) as id')
                    //         ->where('receiver_id', $receiverId)
                    //         ->groupBy('replySourceMessage')
                    //         ->pluck('id');

                    //     $messagesForReceiver = ChatMessage::whereIn('id', $latestMessageIds)
                    //         ->select('receiver_id', 'replySourceMessage', 'text', 'created_at', 'updated_at')
                    //         ->get();

                    //     // $isUnread = $chatMessageRoom->is_read === 0;
                    //     // if ($isUnread) {
                    //     //     $unreadCount++;
                    //     //     $chatMessageRoom->is_read = 'unread'; // Modify the object to indicate unread
                    //     // }

                    //     $result2 = $result2->merge($messagesForReceiver);
                    // }

                    // Fetch the ChatMessages rows where receiver_id matches any of the receiver_ids
                    // $chatMessages = ChatMessage::whereIn('receiver_id', $receiver_ids)->get();

                    if ($messages->isEmpty()) {
                        return response()->json(['error' => 'No chat messages found for the given receiver IDs'], 404);
                    }

                    return response()->json([
                        'message' => 'Data retrieved successfully.',
                        'totalCount' => $totalCount,
                        'unreadCount' => $unreadCount,
                        'data' => $messages
                    ], 200);
                } catch (\Exception $e) {
                    return response()->json(['error' => 'An error occurred: ' . $e->getMessage()], 500);
                }
            } elseif ($action === 'open') {
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
                // return $sender_id;

                $messages = ChatMessageRoom::query();
                // return $messages;

                $messages = $messages->where('sender_id', $sender_id)->where('status', '0');
                // return $messages;

                $receiverIds = $messages->pluck('receiver_id')->unique()->toArray();
                // return $receiverIds;

                $latestMessageIds = ChatMessage::selectRaw('MAX(id) as id')
                    ->whereIn('receiver_id', $receiverIds)
                    ->groupBy('replySourceMessage')
                    ->pluck('id');

                // $messagesForReceiver = ChatMessage::whereIn('id', $latestMessageIds)
                //     ->select('receiver_id', 'replySourceMessage', 'text', 'created_at', 'updated_at')
                //     ->get();

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




                // // Fetch ChatMessages for each receiver_id
                // $result2 = collect();
                // $unreadCount = 0;
                // $totalCount = 0;

                // // Status mapping array
                // $statusMapping = [
                //     0 => 'open',
                //     1 => 'expired',
                //     2 => 'pending',
                //     3 => 'solved',
                //     4 => 'spam'
                // ];

                // foreach ($receiverIds as $receiverId) {
                //     $latestMessageIds = ChatMessage::selectRaw('MAX(id) as id')
                //         ->where('receiver_id', $receiverId)
                //         ->groupBy('replySourceMessage')
                //         ->pluck('id');

                //     $messagesForReceiver = ChatMessage::whereIn('id', $latestMessageIds)
                //         ->select('receiver_id', 'replySourceMessage', 'text', 'created_at', 'updated_at')
                //         ->get();

                //     // foreach ($messagesForReceiver as $message) {
                //     //     // Fetch the status from ChatMessageRoom
                //     //     $status = ChatMessageRoom::where('sender_id', $sender_id)
                //     //         ->where('receiver_id', $receiverId)
                //     //         ->value('status');

                //     //     // Add the status to each message
                //     //     $message->status = isset($statusMapping[$status]) ? $statusMapping[$status] : 'unknown';
                //     //     $result2->push($message);

                //     //     $unread = ChatMessageRoom::where('sender_id', $sender_id)
                //     //         ->where('receiver_id', $receiverId)
                //     //         ->value('is_read');

                //     //     if ($unread === '0') {
                //     //         $unreadCount++;
                //     //         $message->is_read = 'unread'; // Modify the object to indicate unread
                //     //     } elseif ($unread === 0) {
                //     //         $message->is_read = 'read'; // Optional: mark as read
                //     //     }
                //     //     $totalCount++;
                //     // }
                // }

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
            } elseif ($action === 'pending') {
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
                // return $sender_id;

                $messages = ChatMessageRoom::query();
                // return $messages;

                // $messages->where('username', $username); // Added filter for username
                // Filter by username
                $messages = $messages->where('sender_id', $sender_id)->where('status', '2'); // Added filter for username
                // return $messages;

                $receiverIds = $messages->pluck('receiver_id')->unique()->toArray();
                // return $receiverIds;


                // $latestMessageIds = ChatMessage::selectRaw('MAX(id) as id')
                //         ->where('receiver_id', $receiverId)
                //         ->groupBy('replySourceMessage')
                //         ->pluck('id');

                //     $messagesForReceiver = ChatMessage::whereIn('id', $latestMessageIds)
                //         ->select('receiver_id', 'replySourceMessage', 'text', 'created_at', 'updated_at')
                //         ->get();


                $latestMessageIds = ChatMessage::selectRaw('MAX(id) as id')
                    ->whereIn('receiver_id', $receiverIds)
                    ->groupBy('replySourceMessage')
                    ->pluck('id');

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



                // Fetch ChatMessages for each receiver_id
                // $result2 = collect();
                // $unreadCount = 0;
                // $totalCount = 0;

                // Status mapping array
                // $statusMapping = [
                //     0 => 'open',
                //     1 => 'expired',
                //     2 => 'pending',
                //     3 => 'solved',
                //     4 => 'spam'
                // ];

                // foreach ($receiverIds as $receiverId) {
                //     $latestMessageIds = ChatMessage::selectRaw('MAX(id) as id')
                //         ->where('receiver_id', $receiverId)
                //         ->groupBy('replySourceMessage')
                //         ->pluck('id');

                //     $messagesForReceiver = ChatMessage::whereIn('id', $latestMessageIds)
                //         ->select('receiver_id', 'replySourceMessage', 'text', 'created_at', 'updated_at')
                //         ->get();

                //     // $result2 = $result2->merge($messagesForReceiver);
                //     foreach ($messagesForReceiver as $message) {
                //         // Fetch the status from ChatMessageRoom
                //         $status = ChatMessageRoom::where('sender_id', $sender_id)
                //             ->where('receiver_id', $receiverId)
                //             ->value('status');

                //         // Add the status to each message
                //         $message->status = isset($statusMapping[$status]) ? $statusMapping[$status] : 'unknown';
                //         $result2->push($message);

                //         $unread = ChatMessageRoom::where('sender_id', $sender_id)
                //             ->where('receiver_id', $receiverId)
                //             ->value('is_read');

                //         if ($unread === 0) {
                //             $unreadCount++;
                //             $message->is_read = 'unread'; // Modify the object to indicate unread
                //         } elseif ($unread === 0) {
                //             $message->is_read = 'read'; // Optional: mark as read
                //         }
                //         $totalCount++;
                //     }
                // }

                // Return response based on result
                if ($messages->isEmpty()) {
                    return response()->json([
                        'message' => 'No data found in the database.',
                        'data' => []
                    ], 404); // Using 404 status code to indicate "Not Found"
                }

                return response()->json([
                    'message' => 'Data retrieved successfully.',
                    'total_count' => $totalCount,
                    'unread_count' => $unreadCount,
                    'data' => $messages
                ]);
            } elseif ($action === 'unread') {
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
                // return $sender_id;

                $messages = ChatMessageRoom::query();
                // return $messages;

                // $messages->where('username', $username); // Added filter for username
                // Filter by username
                $messages = $messages->where('sender_id', $sender_id)->where('is_read', '0');
                // return $messages;

                $receiverIds = $messages->pluck('receiver_id')->unique()->toArray();
                // return $receiverIds;

                // Fetch ChatMessages for each receiver_id
                $result2 = collect();
                $unreadCount = 0;
                $totalCount = 0;

                // Status mapping array
                $statusMapping = [
                    0 => 'open',
                    1 => 'expired',
                    2 => 'pending',
                    3 => 'solved',
                    4 => 'spam'
                ];

                foreach ($receiverIds as $receiverId) {
                    $latestMessageIds = ChatMessage::selectRaw('MAX(id) as id')
                        ->where('receiver_id', $receiverId)
                        ->groupBy('replySourceMessage')
                        ->pluck('id');

                    $messagesForReceiver = ChatMessage::whereIn('id', $latestMessageIds)
                        ->select('receiver_id', 'replySourceMessage', 'text', 'created_at', 'updated_at')
                        ->get();

                    // $result2 = $result2->merge($messagesForReceiver);
                    foreach ($messagesForReceiver as $message) {
                        // Fetch the status from ChatMessageRoom
                        $status = ChatMessageRoom::where('sender_id', $sender_id)
                            ->where('receiver_id', $receiverId)
                            ->value('status');

                        // Add the status to each message
                        $message->status = isset($statusMapping[$status]) ? $statusMapping[$status] : 'unknown';
                        $result2->push($message);

                        $unread = ChatMessageRoom::where('sender_id', $sender_id)
                            ->where('receiver_id', $receiverId)
                            ->value('is_read');

                        if ($unread === 0) {
                            $unreadCount++;
                            $message->is_read = 'unread'; // Modify the object to indicate unread
                        } elseif ($unread === '0') {
                            $message->is_read = 'read'; // Optional: mark as read
                        }
                        $totalCount++;
                    }
                }

                // Return response based on result
                if ($result2->isEmpty()) {
                    return response()->json([
                        'message' => 'No data found in the database.',
                        'data' => []
                    ], 404); // Using 404 status code to indicate "Not Found"
                }

                return response()->json([
                    'message' => 'Data retrieved successfully.',
                    'unreadCount' => $unreadCount,
                    'totalCount' => $totalCount,
                    'data' => $result2
                ]);
            } elseif ($action === 'solved') {
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
                // return $sender_id;

                $messages = ChatMessageRoom::query();
                // return $messages;

                // $messages->where('username', $username); // Added filter for username
                // Filter by username
                $messages = $messages->where('sender_id', $sender_id)->where('status', '3'); // Added filter for username
                // return $messages;

                $receiverIds = $messages->pluck('receiver_id')->unique()->toArray();

                $latestMessageIds = ChatMessage::selectRaw('MAX(id) as id')
                    ->whereIn('receiver_id', $receiverIds)
                    ->groupBy('replySourceMessage')
                    ->pluck('id');

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

                // return $receiverIds;

                // // Fetch ChatMessages for each receiver_id
                // $result2 = collect();
                // $unreadCount = 0;
                // $totalCount = 0;

                // // Status mapping array
                // $statusMapping = [
                //     0 => 'open',
                //     1 => 'expired',
                //     2 => 'pending',
                //     3 => 'solved',
                //     4 => 'spam'
                // ];
                // foreach ($receiverIds as $receiverId) {
                //     $messagesForReceiver = ChatMessage::where('receiver_id', $receiverId)->select('receiver_id', 'replySourceMessage', 'text', 'created_at', 'updated_at')->get();
                //     $result2 = $result2->merge($messagesForReceiver);
                // }

                // foreach ($receiverIds as $receiverId) {
                //     $latestMessageIds = ChatMessage::selectRaw('MAX(id) as id')
                //         ->where('receiver_id', $receiverId)
                //         ->groupBy('replySourceMessage')
                //         ->pluck('id');

                //     $messagesForReceiver = ChatMessage::whereIn('id', $latestMessageIds)
                //         ->select('receiver_id', 'replySourceMessage', 'text', 'created_at', 'updated_at')
                //         ->get();

                //     // $result2 = $result2->merge($messagesForReceiver);
                //     foreach ($messagesForReceiver as $message) {
                //         // Fetch the status from ChatMessageRoom
                //         $status = ChatMessageRoom::where('sender_id', $sender_id)
                //             ->where('receiver_id', $receiverId)
                //             ->value('status');

                //         // Add the status to each message
                //         $message->status = isset($statusMapping[$status]) ? $statusMapping[$status] : 'unknown';
                //         $result2->push($message);

                //         $unread = ChatMessageRoom::where('sender_id', $sender_id)
                //             ->where('receiver_id', $receiverId)
                //             ->value('is_read');

                //         if ($unread === 0) {
                //             $unreadCount++;
                //             $message->is_read = 'unread'; // Modify the object to indicate unread
                //         } elseif ($unread === '0') {
                //             $message->is_read = 'read'; // Optional: mark as read
                //         }
                //         $totalCount++;
                //     }
                // }

                // Return response based on result
                if ($messages->isEmpty()) {
                    return response()->json([
                        'message' => 'No data found in the database.',
                        'data' => []
                    ], 404); // Using 404 status code to indicate "Not Found"
                }

                return response()->json([
                    'message' => 'Data retrieved successfully.',
                    'unreadCount' => $unreadCount,
                    'totalCount' => $totalCount,
                    'data' => $messages
                ]);
            } elseif ($action === 'expired') {
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
                // return $sender_id;

                $messages = ChatMessageRoom::query();
                // return $messages;

                // $messages->where('username', $username); // Added filter for username
                // Filter by username
                $messages = $messages->where('sender_id', $sender_id)->where('status', '1'); // Added filter for username
                // return $messages;

                $receiverIds = $messages->pluck('receiver_id')->unique()->toArray();
                // return $receiverIds;
                $latestMessageIds = ChatMessage::selectRaw('MAX(id) as id')
                    ->whereIn('receiver_id', $receiverIds)
                    ->groupBy('replySourceMessage')
                    ->pluck('id');

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


                // Fetch ChatMessages for each receiver_id
                // $result2 = collect();
                // $unreadCount = 0;
                // $totalCount = 0;
                // // return $result2;
                // // Status mapping array
                // $statusMapping = [
                //     0 => 'open',
                //     1 => 'expired',
                //     2 => 'pending',
                //     3 => 'solved',
                //     4 => 'spam'
                // ];

                // foreach ($receiverIds as $receiverId) {
                //     $messagesForReceiver = ChatMessage::where('receiver_id', $receiverId)->select('receiver_id', 'replySourceMessage', 'text', 'created_at', 'updated_at')->get();
                //     $result2 = $result2->merge($messagesForReceiver);
                // }

                // foreach ($receiverIds as $receiverId) {
                //     $latestMessageIds = ChatMessage::selectRaw('MAX(id) as id')
                //         ->where('receiver_id', $receiverId)
                //         ->groupBy('replySourceMessage')
                //         ->pluck('id');

                //     $messagesForReceiver = ChatMessage::whereIn('id', $latestMessageIds)
                //         ->select('receiver_id', 'replySourceMessage', 'text', 'created_at', 'updated_at')
                //         ->get();

                //     // $result2 = $result2->merge($messagesForReceiver);
                //     foreach ($messagesForReceiver as $message) {
                //         // Fetch the status from ChatMessageRoom
                //         $status = ChatMessageRoom::where('sender_id', $sender_id)
                //             ->where('receiver_id', $receiverId)
                //             ->value('status');

                //         // Add the status to each message
                //         $message->status = isset($statusMapping[$status]) ? $statusMapping[$status] : 'unknown';
                //         $result2->push($message);

                //         $unread = ChatMessageRoom::where('sender_id', $sender_id)
                //             ->where('receiver_id', $receiverId)
                //             ->value('is_read');

                //         if ($unread === 0) {
                //             $unreadCount++;
                //             $message->is_read = 'unread'; // Modify the object to indicate unread
                //         } elseif ($unread === '0') {
                //             $message->is_read = 'read'; // Optional: mark as read
                //         }
                //         $totalCount++;
                //     }
                // }

                // Return response based on result
                if ($messages->isEmpty()) {
                    return response()->json([
                        'message' => 'No data found in the database.',
                        'data' => []
                    ], 404); // Using 404 status code to indicate "Not Found"
                }

                return response()->json([
                    'message' => 'Data retrieved successfully.',
                    'unreadCount' => $unreadCount,
                    'totalCount' => $totalCount,
                    'data' => $messages
                ]);
            } elseif ($action === 'active') {
                try {

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
                    // return $sender_id;

                    $latestMessageIds = ChatMessage::selectRaw('MAX(id) as id')
                        ->where('sender_id', $sender_id)
                        ->where('created_at', '>=', now()->subDay())
                        ->groupBy('replySourceMessage');
                    // return $latestMessageIds;

                    // $messages = ChatMessage::whereIn('id', $latestMessageIds)
                    //     ->select('receiver_id', 'replySourceMessage', 'text', 'created_at', 'updated_at')
                    //     ->get();

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


                    // return $messages;

                    // Status mapping array
                    // $statusMapping = [
                    //     0 => 'open',
                    //     1 => 'expired',
                    //     2 => 'pending',
                    //     3 => 'solved',
                    //     4 => 'spam'
                    // ];

                    // Initialize an array to hold the final result
                    // $result = [];
                    // $unreadCount = 0;
                    // $totalCount = 0;

                    // Fetch and assign the status for each message
                    // foreach ($messages as $message) {
                    //     $status = ChatMessageRoom::where('sender_id', $sender_id)
                    //         ->where('receiver_id', $message->receiver_id)
                    //         ->value('status');

                    //     // Add status to the message
                    //     $message->status = isset($statusMapping[$status]) ? $statusMapping[$status] : 'unknown';

                    //     $unread = ChatMessageRoom::where('sender_id', $sender_id)
                    //         ->where('receiver_id', $message->receiver_id)
                    //         ->value('is_read');

                    //     if ($unread === 0) {
                    //         $unreadCount++;
                    //         $message->is_read = 'unread'; // Modify the object to indicate unread
                    //     } elseif ($unread === '0') {
                    //         $message->is_read = 'read'; // Optional: mark as read
                    //     }
                    //     $totalCount++;

                    //     // Add the message to the result array
                    //     $result[] = $message;
                    // }

                    // Return response based on result
                    if (empty($messages)) {
                        return response()->json([
                            'message' => 'No data found in the database.',
                            'data' => []
                        ], 404); // Using 404 status code to indicate "Not Found"
                    }

                    return response()->json([
                        'message' => 'Data retrieved successfully.',
                        'unreadCount' => $unreadCount,
                        'totalCount' => $totalCount,
                        'data' => $messages
                    ]);
                } catch (\Exception $e) {
                    return response()->json(['error' => $e->getMessage()], 500);
                }
            } elseif ($action === 'broadcast') {
                try {

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


                    $latestMessageIds = ChatMessage::selectRaw('MAX(id) as id')
                        ->where('sender_id', $sender_id)
                        ->where('eventtype', 'broadcastMessage')
                        ->groupBy('replySourceMessage');

                    // return $latestMessageIds;

                    // $messages = ChatMessage::whereIn('id', $latestMessageIds)
                    //     ->select('receiver_id', 'replySourceMessage', 'text', 'created_at', 'updated_at')
                    //     ->get();

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


                    // Status mapping array
                    // $statusMapping = [
                    //     0 => 'open',
                    //     1 => 'expired',
                    //     2 => 'pending',
                    //     3 => 'solved',
                    //     4 => 'spam'
                    // ];

                    // Initialize an array to hold the final result
                    // $result = [];
                    // $unreadCount = 0;
                    // $totalCount = 0;

                    // Fetch and assign the status for each message
                    // foreach ($messages as $message) {
                    //     $status = ChatMessageRoom::where('sender_id', $sender_id)
                    //         ->where('receiver_id', $message->receiver_id)
                    //         ->value('status');

                    //     // Add status to the message
                    //     $message->status = isset($statusMapping[$status]) ? $statusMapping[$status] : 'unknown';

                    //     $unread = ChatMessageRoom::where('sender_id', $sender_id)
                    //         ->where('receiver_id', $message->receiver_id)
                    //         ->value('is_read');

                    //     if ($unread === 0) {
                    //         $unreadCount++;
                    //         $message->is_read = 'unread'; // Modify the object to indicate unread
                    //     } elseif ($unread === '0') {
                    //         $message->is_read = 'read'; // Optional: mark as read
                    //     }
                    //     $totalCount++;

                    //     // Add the message to the result array
                    //     $result[] = $message;
                    // }

                    // Return response based on result
                    if (empty($messages)) {
                        return response()->json([
                            'message' => 'No data found in the database.',
                            'data' => []
                        ], 404); // Using 404 status code to indicate "Not Found"
                    }

                    return response()->json([
                        'message' => 'Data retrieved successfully.',
                        'unreadCount' => $unreadCount,
                        'totalCount' => $totalCount,
                        'data' => $messages
                    ]);
                } catch (\Exception $e) {
                    return response()->json(['error' => $e->getMessage()], 500);
                }
            } elseif ($action === 'unassigned') {
                try {

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

                    $latestMessageIds = ChatMessage::selectRaw('MAX(id) as id')
                        ->where('sender_id', $sender_id)
                        ->where('agent', '')
                        ->groupBy('replySourceMessage');

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



                    // return $latestMessageIds;

                    // $messages = ChatMessage::whereIn('id', $latestMessageIds)
                    //     ->select('receiver_id', 'replySourceMessage', 'text', 'created_at', 'updated_at')
                    //     ->get();



                    // // Status mapping array
                    // $statusMapping = [
                    //     0 => 'open',
                    //     1 => 'expired',
                    //     2 => 'pending',
                    //     3 => 'solved',
                    //     4 => 'spam'
                    // ];

                    // // Initialize an array to hold the final result
                    // $result = [];
                    // $unreadCount = 0;
                    // $totalCount = 0;

                    // Fetch and assign the status for each message
                    // foreach ($messages as $message) {
                    //     $status = ChatMessageRoom::where('sender_id', $sender_id)
                    //         ->where('receiver_id', $message->receiver_id)
                    //         ->value('status');

                    //     // Add status to the message
                    //     $message->status = isset($statusMapping[$status]) ? $statusMapping[$status] : 'unknown';

                    //     $unread = ChatMessageRoom::where('sender_id', $sender_id)
                    //         ->where('receiver_id', $message->receiver_id)
                    //         ->value('is_read');

                    //     if ($unread === 0) {
                    //         $unreadCount++;
                    //         $message->is_read = 'unread'; // Modify the object to indicate unread
                    //     } elseif ($unread === '0') {
                    //         $message->is_read = 'read'; // Optional: mark as read
                    //     }
                    //     $totalCount++;

                    //     // Add the message to the result array
                    //     $result[] = $message;
                    // }

                    // Return response based on result
                    if (empty($messages)) {
                        return response()->json([
                            'message' => 'No data found in the database.',
                            'data' => []
                        ], 404); // Using 404 status code to indicate "Not Found"
                    }

                    return response()->json([
                        'message' => 'Data retrieved successfully.',
                        'unreadCount' => $unreadCount,
                        'totalCount' => $totalCount,
                        'data' => $messages
                    ]);
                } catch (\Exception $e) {
                    return response()->json(['error' => $e->getMessage()], 500);
                }
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request.' . $e], 500);
        }
    }

    public function getAdvanceFilteredData(Request $request)
    {
        try {
            $action = $request->input('action');
            if ($action === 'attribute') {

                // Validate the request inputs
                $request->validate([
                    'attribute' => 'required|string',
                    'value' => 'required|string',
                    'contain' => 'required|string|in:=,!=',
                    'username' => 'required|string',
                ]);

                $attribute = $request->input('attribute');
                $attributeValue = $request->input('value');
                $contain = $request->input('contain');
                $username = $request->input('username');

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
                $sender_id = $sender ? $sender->mobile_no : null; //
                // return $sender_id;

                // Build the query
                $query = MobNo3::query();

                // Add the username condition
                $query->where('username', $username);
                // $query->where('senderid', $sender_id);

                // $query->where($mediaColumn, $operator, $attributeValue);
                // $query = $query->select('receiver')->first();
                // $receiver_id = $query->receiver;

                // Add the attribute condition
                $receiverIds = $query->where($mediaColumn, $operator, $attributeValue)
                    ->distinct()
                    ->pluck('receiver');
                // return $receiverIds;

                $latestMessageIds = ChatMessage::selectRaw('MAX(id) as id')
                    ->whereIn('receiver_id', $receiverIds)
                    ->groupBy('replySourceMessage')
                    ->pluck('id');

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


                // Subquery to get the latest message for each replySourceMessage
                // $subQuery = ChatMessage::selectRaw('MAX(id) as id')
                //     ->whereIn('receiver_id', $receiver_ids)
                //     ->groupBy('replySourceMessage');

                // // Main query to get the distinct replySourceMessage with latest messages
                // $data = ChatMessage::where('receiver_id', $receiver_id)
                //     ->joinSub($subQuery, 'latest_messages', function ($join) {
                //         $join->on('chat_messages.id', '=', 'latest_messages.id');
                //     })
                //     ->select('receiver_id', 'replySourceMessage', 'text', 'created_at', 'updated_at')
                //     ->get();

                return response()->json([
                    'message' => 'Data retrieved successfully.',
                    'totalCount' => $totalCount,
                    'unreadCount' => $unreadCount,
                    'data' => $messages
                ], 200);
            } elseif ($action === 'status') {

                // Define validation rules
                $validator = Validator::make($request->all(), [
                    'username' => 'required|string|max:100|exists:ci_admin,username',
                    'filter' => 'nullable|in:open,pending,solved,expired,spam',
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

                $sender = User::where('username', $username)->select('mobile_no')->first();
                $sender_id = $sender ? $sender->mobile_no : null; //
                // return $sender_id;

                $messages = ChatMessageRoom::query();
                // return $messages;

                // Filter by username
                // $messages->where('username', $username); // Added filter for username
                // Filter by username
                $messages = $messages->where('sender_id', $sender_id); // Added filter for username
                // return $messages;

                // Apply filters based on input values
                if ($filter == 'open') {
                    $messages->where('status', '0');
                }
                if ($filter == 'pending') {
                    $messages->where('status', '2');
                }
                if ($filter == 'solved') {
                    $messages->where('status', '3');
                }
                if ($filter == 'expired') {
                    $messages->where('status', '1');
                }
                if ($filter == 'spam') {
                    $messages->where('status', '4');
                }

                // $result = $messages->with('chatMessages')->get();
                // $result = $messages->get();//kaaaam kaaaa
                // return $result;
                // return  $result->first()->receiver_id;


                // $result2 = ChatMessage::where('receiver_id', $result->first()->receiver_id)->get();
                // $result2 = ChatMessage::where('receiver_id', $result->first()->receiver_id)
                // ->select('text', 'created_at')
                // ->get();//kaaam kaaa

                // $result2 = ChatMessage::where('receiver_id', $result->first()->receiver_id)
                //     ->select('text, DATE_FORMAT(created_at, "%Y-%m-%d %H:%i:%s") as created_at_formatted')
                //     ->get();
                // $result2 = ChatMessage::where('receiver_id', $result->first()->receiver_id)
                //     ->select('text', \DB::raw('DATE_FORMAT(created_at, "%Y-%m-%d %H:%i:%s") as created_at_formatted'))
                //     ->get();

                $receiverIds = $messages->pluck('receiver_id')->unique()->toArray();
                // return $receiverIds;

                $latestMessageIds = ChatMessage::selectRaw('MAX(id) as id')
                    ->whereIn('receiver_id', $receiverIds)
                    ->groupBy('replySourceMessage')
                    ->pluck('id');

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


                // Fetch ChatMessages for each receiver_id
                // $result2 = collect();
                // return $result2;

                // foreach ($receiverIds as $receiverId) {
                //     $messagesForReceiver = ChatMessage::where('receiver_id', $receiverId)->select('receiver_id', 'replySourceMessage', 'text', 'created_at', 'updated_at')->get();
                //     $result2 = $result2->merge($messagesForReceiver);
                // }

                // Return response based on result
                if ($messages->isEmpty()) {
                    return response()->json([
                        'message' => 'No data found in the database.',
                        'data' => []
                    ], 404); // Using 404 status code to indicate "Not Found"
                }

                return response()->json([
                    'message' => 'Data retrieved successfully.',
                    'totalCount' => $totalCount,
                    'unreadCount' => $unreadCount,
                    'data' => $messages
                ]);
            } elseif ($action === 'assignee') {
                $username = $request->input('username');
                $agent_id = $request->input('agent_id');

                if ($agent_id && $username) {
                    try {
                        $request->validate([
                            'agent_id' => 'required|integer',
                            'username' => 'required|string',
                        ]);

                        $sender = User::where('username', $request->input('username'))->select('mobile_no')->first();
                        $sender_id = $sender ? $sender->mobile_no : null;

                        // $assignUser = AssignUser::find($id);
                        $assignUser = AssignUser::where('id', $agent_id)->where('username', $username)->first();
                        // return $assignUser['assign_user'];
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
                            ->groupBy('replySourceMessage');
                        // ->pluck('id');

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


                        // $chatMessages = ChatMessage::where('agent', $assign_user)->get();

                        if ($messages->isEmpty()) {
                            return response()->json([
                                'message' => 'No chat messages found for the given agent',
                            ], 404);
                        }

                        return response()->json($messages, 200);
                    } catch (\Exception $e) {
                        return response()->json([
                            'message' => 'An error occurred while fetching the chat messages.',
                            'error' => $e->getMessage(),
                        ], 500);
                    }
                } elseif ($username) {

                    try {
                        $request->validate([
                            'username' => 'required|string',
                        ]);

                        $assignUsers = AssignUser::where('username', $username)->get();

                        if ($assignUsers->isEmpty()) {
                            return response()->json([
                                'message' => 'No records found for the given username',
                            ], 404);
                        }

                        return response()->json($assignUsers, 200);
                    } catch (\Exception $e) {
                        return response()->json([
                            'message' => 'An error occurred while fetching the records.',
                            'error' => $e->getMessage(),
                        ], 500);
                    }
                } else {
                    return response()->json([
                        'message' => 'Invalid input. Please provide either a username or an id.',
                    ], 400);
                }
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request.' . $e], 500);
        }
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
            // 'username' => 'required|string|max:20',
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
            $sender_id = User::where('username', $username)->pluck('mobile_no');

            // Fetch the chat message room
            $chatMessageRoom = ChatMessageRoom::where('receiver_id', $receiver_id)
                ->where('sender_id', $sender_id)
                ->first();

            if (!$chatMessageRoom) {
                return response()->json(['error' => 'Chat message room not found'], 404);
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

    // public function getStatus(Request $request)
    // {
    //     // Validate the request inputs
    //     $request->validate([
    //         'receiver_id' => 'required|string',
    //         'username' => 'required|string',
    //     ]);

    //     $receiver_id = $request->input('receiver_id');
    //     $username = $request->input('username');

    //     $sender = User::where('username', $username)->first();
    //     // return $sender;
    //     $sender_id = $sender->mobile_no;
    //     // return $sender_id;

    //     // Fetch the status
    //     $status = ChatMessageRoom::where('receiver_id', $receiver_id)
    //         ->where('sender_id', $sender_id)
    //         ->pluck('status')
    //         ->first();

    //     if ($status === null) {
    //         return response()->json(['message' => 'Record not found'], 404);
    //     }

    //     // Map status codes to their corresponding messages
    //     $statusMessages = [
    //         0 => 'open',
    //         1 => 'expired',
    //         2 => 'pending',
    //         3 => 'solved',
    //         4 => 'spam'
    //     ];

    //     $statusMessage = $statusMessages[$status] ?? 'unknown';

    //     return response()->json(['status' => $statusMessage], 200);
    // }
}


// elseif ($username) {

//     try {
//         $request->validate([
//             'username' => 'required|string',
//         ]);

//         $assignUsers = AssignUser::where('username', $username)->get();

//         if ($assignUsers->isEmpty()) {
//             return response()->json([
//                 'message' => 'No records found for the given username',
//             ], 404);
//         }

//         return response()->json($assignUsers, 200);
//     } catch (\Exception $e) {
//         return response()->json([
//             'message' => 'An error occurred while fetching the records.',
//             'error' => $e->getMessage(),
//         ], 500);
//     }
// } 
