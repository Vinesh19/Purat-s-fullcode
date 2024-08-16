<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\ChatMessage;
use App\Models\ChatInboxTag;
use Illuminate\Http\Request;
use App\Models\ChatInboxNote;
use App\Models\ChatMessageRoom;
// use Illuminate\Validation\Rules\Exists;
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
            // ->whereIn('status', [5, 6, 7, 8])
            ->with('chatRoom')
            ->select('receiver_id', 'sender_id', 'replySourceMessage', 'text', 'created_at', 'updated_at', 'agent')
            ->get();

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

    // public function handleSpecificData(Request $request)
    // {
    //     // Validate the input
    //     $validator = Validator::make($request->all(), [
    //         'receiver_id' => 'required|string|max:20',
    //         'username' => 'required|string|max:255',
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json(['error' => $validator->errors()], 400);
    //     }

    //     try {
    //         // Get the input values
    //         $receiver_id = $request->input('receiver_id');
    //         $username = $request->input('username'); // Retrieve the username
    //         $sender = User::where('username', $username)->select('mobile_no')->first();
    //         $sender_id = $sender ? $sender->mobile_no : null; //

    //         $messages = ChatMessage::where('receiver_id', $receiver_id)
    //             ->whereHas('chatRoom', function ($query) use ($sender_id) {
    //                 $query->where('sender_id', $sender_id);
    //             })
    //             ->with(['chatRoom' => function ($query) {
    //                 $query->select('receiver_id', 'status'); // Ensure to select 'id' to maintain the relationship
    //             }])
    //             ->orderBy('created_at', 'desc') // Sorting from old to new
    //             ->select('agent', 'created_at', 'updated_at', 'replySourceMessage', 'receiver_id')
    //             ->first();

    //         $notes = ChatInboxNote::where('username', $username)
    //             ->where('receiver_id', $receiver_id)->get();

    //         return response()->json([
    //             'message' => 'Data retrieved successfully',
    //             'data' => $messages,
    //             'notes' => $notes
    //         ], 200);
    //     } catch (\Exception $e) {
    //         return response()->json(['error' => 'Something went wrong', 'details' => $e->getMessage()], 500);
    //     }
    // }

    public function handleSpecificData(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'action' => 'required|string|in:create,read,update,delete',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $action = $request->input('action');

        try {
            switch ($action) {
                case 'create':
                    return $this->createSpecificData($request);

                case 'read':
                    return $this->readSpecificData($request);

                case 'update':
                    return $this->updateSpecificData($request);

                case 'delete':
                    return $this->deleteSpecificData($request);

                case 'remove':
                    return $this->removeSpecificData($request);

                default:
                    return response()->json(['error' => 'Invalid action'], 400);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Something went wrong', 'details' => $e->getMessage()], 500);
        }
    }

    private function readSpecificData(Request $request)
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
            $username = $request->input('username');
            $sender = User::where('username', $username)->select('mobile_no')->first();
            $sender_id = $sender ? $sender->mobile_no : null;
            // return $sender_id;

            // $messages = ChatMessage::where('receiver_id', $receiver_id)
            //     ->whereHas('chatRoom', function ($query) use ($sender_id) {
            //         $query->select('receiver_id', 'status')
            //             ->where('sender_id', $sender_id);
            //     })
            //     ->whereHas('notes', function ($query) use ($username) {
            //         $query->select('receiver_id', 'note', 'username')
            //             ->where('username', $username); // Filter notes by username in the initial query
            //     })
            //     ->whereHas('tags', function ($query) use ($username) {
            //         $query->select('receiver_id', 'tag')
            //             ->where('username', $username); // Filter notes by username in the initial query
            //     })
            //     ->orderBy('created_at', 'desc') // Sorting from old to new
            //     ->select('agent', 'created_at', 'updated_at', 'replySourceMessage', 'receiver_id', 'username')
            //     ->first();


            $messages = ChatMessage::where('receiver_id', $receiver_id)
                ->with([
                    'chatRoom' => function ($query) use ($sender_id) {
                        $query->select('id', 'status', 'sender_id', 'receiver_id', 'internal_note')
                            ->where('sender_id', $sender_id);
                    }
                ])
                ->with([
                    'notes' => function ($query) use ($username) {
                        $query->select('id', 'receiver_id', 'note', 'username')
                            ->where('username', $username); // Filter notes by username in the initial query
                    }
                ])
                ->with([
                    'tags' => function ($query) use ($username) {
                        $query->select('id', 'receiver_id', 'tag', 'username')
                            ->where('username', $username); // Filter tags by username in the initial query
                    }
                ])
                ->orderBy('created_at', 'desc') // Sorting from old to new
                ->select('id', 'agent', 'created_at', 'updated_at', 'replySourceMessage', 'receiver_id')
                ->first();



            // $messages = ChatMessage::where('receiver_id', $receiver_id)
            //     ->whereHas('chatRoom', function ($query) use ($sender_id) {
            //         $query->where('sender_id', $sender_id);
            //     })
            //     ->with(['chatRoom' => function ($query) {
            //         $query->select('id', 'receiver_id', 'status', 'internal_note'); // Include 'id' to maintain the relationship
            //     }, 'notes' => function ($query) use ($username) {
            //         $query->select('id', 'receiver_id', 'note', 'username')
            //             ->where('username', $username); // Filter notes by username in the initial query
            //     }, 'tags' => function ($query) use ($username) {
            //         $query->select('id', 'receiver_id', 'tag', 'username')
            //             ->where('username', $username); // Filter tags by username in the initial query
            //     }])
            //     ->orderBy('created_at', 'desc') // Sorting from old to new
            //     ->select('id', 'agent', 'created_at', 'updated_at', 'replySourceMessage', 'receiver_id')
            //     ->first();

            // // Ensure notes and tags are filtered correctly
            // if ($messages) {
            //     $messages->notes = $messages->notes->where('username', $username)->values();
            //     $messages->tags = $messages->tags->where('username', $username)->values();
            // }

            return response()->json([
                'message' => 'Data retrieved successfully',
                'data' => $messages
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Something went wrong', 'details' => $e->getMessage()], 500);
        }
    }

    private function deleteSpecificData(Request $request)
    {
        // Validate the input
        $validator = Validator::make($request->all(), [
            'receiver_id' => 'required|string|max:20',
            'username' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        try {
            // Get the input values
            $receiver_id = $request->input('receiver_id');
            $username = $request->input('username');
            $sender = User::where('username', $username)->select('mobile_no')->first();
            $sender_id = $sender ? $sender->mobile_no : null;

            // Fetch the chat message room
            $chatMessageRoom = ChatMessageRoom::where('receiver_id', $receiver_id)
                ->where('sender_id', $sender_id)
                ->first();

            if (!$chatMessageRoom) {
                return response()->json(['error' => 'data for provided receiver_id not found'], 404);
            }

            // Update the columns
            $chatMessageRoom->status = 9;
            // Save the updated chat message room
            $chatMessageRoom->save();

            return response()->json([
                'status' => 1,
                'message' => 'user deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Something went wrong', 'details' => $e->getMessage()], 500);
        }
    }

    private function updateSpecificData(Request $request)
    {
        // Validate the input
        $validator = Validator::make($request->all(), [
            'receiver_id' => 'required|string|max:20',
            'username' => 'required|string|max:255',
            'status' => 'nullable|string|in:0,1,2,3,4,5,6,7,8', //update status in Room
            'name' => 'nullable|string', //update replySourceMessage in chatMessage
            'assign_user' => 'nullable|string|max:255',
            'internal_note' => 'nullable|max:500|string',
            // 'notes' => 'nullable|array', // For handling multiple notes
            // 'notes.*.note_id' => 'nullable|integer|exists:chat_inbox_notes,id',
            // 'notes.*.note' => 'nullable|string|max:500',
            // 'tags' => 'nullable|array', // For handling multiple tags
            // 'tags.*.tag_id' => 'nullable|integer|exists:chatinboxtag,id',
            // 'tags.*.tag' => 'nullable|string|max:500'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $internal_note = $request->has('internal_note') ? $request->internal_note : null;
        $status = $request->has('status') ? $request->status : null;
        $agent = $request->has('assign_user') ? $request->assign_user : null;
        $name = $request->has('name') ? $request->name : null;

        try {
            // Get the input values
            $receiver_id = $request->input('receiver_id');
            $username = $request->input('username');
            $sender = User::where('username', $username)->select('mobile_no')->first();
            $sender_id = $sender ? $sender->mobile_no : null;

            // // Handle notes updates chat_inbox_notes table
            // if ($request->has('notes')) {
            //     foreach ($request->input('notes') as $noteData) {
            //         if (isset($noteData['note_id']) && isset($noteData['note'])) {
            //             $note_user = ChatInboxNote::find($noteData['note_id']);
            //             if ($note_user) {
            //                 $note_user->update(['note' => $noteData['note']]);
            //             }
            //         }
            //     }
            // }

            // // Handle tags updates in chatinboxtag table
            // if ($request->has('tags')) {
            //     foreach ($request->input('tags') as $tagData) {
            //         if (isset($tagData['tag_id']) && isset($tagData['tag'])) {
            //             $tag_user = ChatInboxTag::find($tagData['tag_id']);
            //             if ($tag_user) {
            //                 $tag_user->update(['tag' => $tagData['tag']]);
            //             }
            //         }
            //     }
            // }

            //updating status and internal notes in chat_messages_room
            if ($internal_note || $status || $agent || $name) {
                $user = ChatMessageRoom::where('sender_id', $sender_id)
                    ->where('receiver_id', $receiver_id)
                    ->first();
                $user->update([
                    'internal_note' => $internal_note,
                    'status' => $status,
                    'assign_to' => $agent,
                    'name' => $name,
                ]);
            }

            // Handle agent updates in chat_messages table
            if ($request->has('assign_user')) {
                $chatMessages = ChatMessage::where('receiver_id', $receiver_id)
                    ->where('username', $username)->get();

                if ($chatMessages->isNotEmpty()) {
                    foreach ($chatMessages as $chatMessage) {
                        $chatMessage->update(['agent' => $agent]);
                    }
                }
            }

            return response()->json([
                'status' => '1',
                'message' => 'Column updated successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Something went wrong', 'details' => $e->getMessage()], 500);
        }
    }

    private function createSpecificData(Request $request)
    {
        // Validate the input
        $validator = Validator::make($request->all(), [
            'receiver_id' => 'required|string|max:20',
            'username' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'status' => 'required|string|in:0,1,2,3,4,5,6,7,8', //create name in Room
            'internal_note' => 'nullable|max:500|string',
            'assign_user' => 'nullable|max:255|string', //create assign_user in chatInboxNote
            'notes' => 'nullable|array', // For handling multiple notes
            'notes.*.note_id' => 'nullable|integer|exists:chat_inbox_notes,id',
            'notes.*.note' => 'nullable|string|max:500',
            'tags' => 'nullable|array', // For handling multiple tags
            'tags.*.tag_id' => 'nullable|integer|exists:chatinboxtag,id',
            'tags.*.tag' => 'nullable|string|max:500'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        //checking if any record with this name is already exists or not
        $exists_user = ChatMessageRoom::where('receiver_id', $request->receiver_id)->first();
        if ($exists_user) {
            return response()->json(['error' => 'user with this number already exists'], 500);
        }

        try {
            $sender = User::where('username', $request->username)->select('mobile_no')->first();
            $sender_id = $sender ? $sender->mobile_no : null;
            $assign_user = $request->has('assign_user') ? $request->assign_user : null;
            $internal_note = $request->has('internal_note') ? $request->internal_note : null;
            $status = $request->has('status') ? $request->status : null;
            $name = $request->has('name') ? $request->name : null;

            // Handle notes updates chat_inbox_notes table
            if ($request->has('notes')) {
                foreach ($request->input('notes') as $noteData) {
                    if (isset($noteData['note'])) {
                        $note_user = ChatInboxNote::create([
                            'note' => $noteData['note'],
                            'assign_user' => $assign_user,
                            'username' => $request->username,
                            'receiver_id' => $request->receiver_id,
                        ]);
                    }
                }
            }

            // Handle tags updates in chatinboxtag table
            if ($request->has('tags')) {
                foreach ($request->input('tags') as $tagData) {
                    $note_user = ChatInboxTag::create([
                        'tag' => $tagData['tag'],
                        'assign_user' => $assign_user,
                        'username' => $request->username,
                        'receiver_id' => $request->receiver_id,
                    ]);
                }
            }

            if ($internal_note || $status || $name || $assign_user) {
                $user = ChatMessageRoom::create([
                    'internal_note' => $internal_note,
                    'name' => $name,
                    'status' => $status,
                    'assign_to' => $assign_user,
                    'username' => $request->username,
                    'receiver_id' => $request->receiver_id,
                    'sender_id' => $sender_id
                ]);
            }

            return response()->json([
                'status' => 1,
                'message' => 'record added successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Something went wrong', 'details' => $e->getMessage()], 500);
        }
    }
}
