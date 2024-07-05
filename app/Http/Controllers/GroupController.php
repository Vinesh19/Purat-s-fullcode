<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Contact;
use Illuminate\Http\Request;
use Carbon\Exceptions\Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;


class GroupController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'Group_name' => 'required|string|max:255',
            'is_active' => 'boolean',
            'added_by' => 'required|string|max:30'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        try {
            $groupName = $request->input('Group_name');
            $username = $request->input('added_by');

            // Check if a group with the same name already exists for the user
            $existingGroup = Group::where('Group_name', $groupName)
                ->where('added_by', $username)
                ->first();

            if ($existingGroup) {
                return response()->json(['error' => 'You already have a group with this name'], 400);
            }

            // Use the create method to insert the new group
            $group = Group::create([
                'Group_name' => $request->Group_name,
                'is_active' => $request->is_active,
                'added_by' => $request->added_by
            ]);

            return response()->json(['message' => 'Group created successfully', 'group' => $group], 201);
        } catch (Exception $e) {
            // Handle all exceptions
            return response()->json(['error' => 'Failed to create group due to an error', 'details' => $e->getMessage()], 500);
        }
    }

    public function index(Request $request)
    {
        // Validate the username parameter
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:30'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        try {
            $username = $request->input('username');
            // return $username;

            // Fetch the groups where 'added_by' matches the provided username
            $groups = Group::where('added_by', $username)->pluck('group_name');

            return response()->json($groups);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to fetch groups due to an error', 'details' => $e->getMessage()], 500);
        }
    }

    public function storeContacts(Request $request)
    {
        // Validate the request parameters
        $validator = Validator::make($request->all(), [
            'Contact_group_id' => 'required|integer|exists:groups,id',
            'contact_mobile_number' => 'required|string|regex:/^[0-9\n\s]+$/'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        DB::beginTransaction();

        try {
            $groupId = $request->input('Contact_group_id');
            $mobileNumbers = $request->input('contact_mobile_number');

            // Clean and split mobile numbers
            $numbers = explode("\n", $mobileNumbers);
            $cleanNumbers = array_map('trim', $numbers);

            $totalInserted = 0;

            // Insert contacts in chunks
            $chunkSize = 1000; // Adjust chunk size as needed
            foreach (array_chunk($cleanNumbers, $chunkSize) as $chunk) {
                $contacts = [];
                foreach ($chunk as $number) {
                    $contacts[] = [
                        'Contact_group_id' => $groupId,
                        'contact_mobile_number' => $number,
                        'is_active' => 1, // Assuming default active status
                        'added_by' => auth()->user()->username ?? 'unknown', // Replace with actual logic to fetch username
                        'created_at' => now(),
                        'updated_at' => now()
                    ];
                }
                // Insert chunk into database using a single insert statement
                Contact::insert($contacts);
                $totalInserted += count($contacts);
            }


            DB::commit();

            return response()->json(['message' => 'Contacts added successfully', 'total_inserted' => $totalInserted], 201);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to add contacts due to an error', 'details' => $e->getMessage()], 500);
        }
    }


    // public function storeContacts(Request $request)
    // {
    //     // Validate the request parameters
    //     $validator = Validator::make($request->all(), [
    //         'Contact_group_id' => 'required|integer|exists:groups,id',
    //         'contact_mobile_number' => 'required|string'
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json($validator->errors(), 400);
    //     }

    //     try {
    //         $groupId = $request->input('Contact_group_id');
    //         $mobileNumbers = $request->input('contact_mobile_number');

    //         // Clean and split mobile numbers
    //         $numbers = explode("\n", $mobileNumbers);
    //         $cleanNumbers = array_map('trim', $numbers); // Remove whitespaces
    //         $cleanNumbers = array_filter($cleanNumbers, function ($number) {
    //             return preg_match('/^[0-9]+$/', $number); // Validate number
    //         });

    //         // Insert contacts in chunks
    //         $chunkSize = 1000; // Adjust chunk size as needed
    //         $contacts = [];
    //         foreach (array_chunk($cleanNumbers, $chunkSize) as $chunk) {
    //             foreach ($chunk as $number) {
    //                 $contacts[] = [
    //                     'Contact_group_id' => $groupId,
    //                     'contact_mobile_number' => $number,
    //                     'is_active' => 1, // Assuming default active status
    //                     'added_by' => auth()->user()->username ?? 'unknown', // Replace with actual logic to fetch username
    //                     'created_at' => now(),
    //                     'updated_at' => now()
    //                 ];
    //             }
    //             // Insert chunk into database
    //             Contact::insert($contacts);
    //             $contacts = []; // Reset contacts array
    //         }

    //         return response()->json(['message' => 'Contacts added successfully'], 201);
    //     } catch (Exception $e) {
    //         return response()->json(['error' => 'Failed to add contacts due to an error', 'details' => $e->getMessage()], 500);
    //     }
    // }
}
