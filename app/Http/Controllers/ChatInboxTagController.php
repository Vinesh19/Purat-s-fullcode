<?php

namespace App\Http\Controllers;

use App\Models\ChatInboxTag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ChatInboxTagController extends Controller
{
    public function handleCrud(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'action' => 'required|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 400);
            }

            $action = $request->input('action');

            switch ($action) {
                case 'create':
                    $validator = Validator::make($request->all(), [
                        'username' => 'required|string|max:255|exists:ci_admin,username',
                        'receiver_id' => 'required|string|max:255',
                        'tag' => 'required|string|max:500',
                        'assign_user' => 'nullable|string|max:255|exists:assign_users,assign_user',
                    ]);

                    if ($validator->fails()) {
                        return response()->json(['error' => $validator->errors()], 400);
                    }

                    $chatInboxTag = ChatInboxTag::create($request->all());
                    return response()->json(['message' => 'Record created successfully!', 'data' => $chatInboxTag], 201);

                case 'read':
                    $receiverId = $request->input('receiver_id');

                    $tag = ChatInboxTag::where('receiver_id', $receiverId)
                        ->where('username', $request->username)
                        ->select('id', 'tag', 'assign_user')->get();

                    if (!$tag) {
                        return response()->json(['status' => 0, 'error' => 'record not found Chat message room'], 404);
                    }

                    return response()->json(['status' => 1, 'data' => $tag]);

                case 'update':
                    $id = $request->input('id');
                    if (!$id) {
                        return response()->json(['error' => 'ID is required for updating a record'], 400);
                    }

                    $validator = Validator::make($request->all(), [
                        'username' => 'nullable|string|max:255',
                        'receiver_id' => 'nullable|string|max:255',
                        'tag' => 'nullable|string|max:500',
                        'assign_user' => 'nullable|string|max:255',
                    ]);

                    if ($validator->fails()) {
                        return response()->json(['error' => $validator->errors()], 400);
                    }

                    $chatInboxTag = ChatInboxTag::findOrFail($id);
                    $chatInboxTag->update($request->all());
                    return response()->json(['status' => 1, 'message' => 'Record updated successfully!', 'data' => $chatInboxTag], 200);

                case 'delete':
                    $id = $request->input('id');
                    if (!$id) {
                        return response()->json(['status' => 0, 'error' => 'ID is required for deleting a record'], 400);
                    }

                    $chatInboxTag = ChatInboxTag::findOrFail($id);
                    $chatInboxTag->delete();
                    return response()->json(['status' => 0, 'message' => 'Tag deleted successfully!'], 200);

                default:
                    return response()->json(['error' => 'Invalid action specified'], 400);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Operation failed!', 'details' => $e->getMessage()], 500);
        }
    }
}
