<?php

// namespace App\Http\Controllers;

// use Illuminate\Http\Request;
// use App\Models\MobNo3; // Replace with your Eloquent model for mob_no3
// use App\Models\User; // Replace with your Eloquent model for ci_admin
// use App\Models\CampaignDetail; // Replace with your Eloquent model for campaign_details
// use DateTime;
// use Illuminate\Support\Facades\DB; // To use DB facade for transactions


// class CsvNewController extends Controller
// {
//     public function importCsv(Request $request)
//     {
//         // return $request;
//         // Validate the request
//         $request->validate([
//             'username' => 'required',
//             'name1' => 'required', //name1 is for sender id which will be submitted in campaign_details
//             'template_name1' => 'required',
//             'csv_file' => 'required|mimes:csv,txt',
//         ]);

//         try {
//             // Retrieve form data
//             $username1 = $request->input('username');
//             $name1 = $request->input('name1'); //senser_id aaegi isme
//             $template_name1 = $request->input('template_name1');

            // // Get the uploaded file
            // $file = $request->file('csv_file');
            // $filePath = $file->getPathname();

            // // Open the CSV file for reading
            // $file_handle = fopen($filePath, "r");

            // // Initialize variables
            // $total_rows = 0;
            // $inserted_rows = 0;
            // $missing_rows = [];

            // // Begin transaction
            // DB::beginTransaction();

            // // Process CSV file
            // // while (($data = fgetcsv($file_handle)) !== false) {
            // $isHeader = true; // Flag to skip the header row
            // while (($data = fgetcsv($file_handle)) !== false) {
            //     if ($isHeader) {
            //         $isHeader = false;
            //         continue; // Skip header row
            //     }
            //     $total_rows++;

                // Check for empty rows
                // if (empty($data)) {
                //     $missing_rows[] = $total_rows;
                //     continue;
                // }

                // // Extract data from CSV row
                // $receiver = $data[0];
                // $media1 = isset($data[1]) ? $data[1] : null;
                // $media2 = isset($data[2]) ? $data[2] : null;
                // $media3 = isset($data[3]) ? $data[3] : null;
                // $media4 = isset($data[4]) ? $data[4] : null;
                // $media5 = isset($data[5]) ? $data[5] : null;
                // $media6 = isset($data[6]) ? $data[6] : null;
                // $media7 = isset($data[7]) ? $data[7] : null;
                // $media8 = isset($data[8]) ? $data[8] : null;
                // $media9 = isset($data[9]) ? $data[9] : null;

                // // Insert data into database using Eloquent ORM
                // $newRecord = new MobNo3();
                // $newRecord->receiver = $receiver;
                // $newRecord->media1 = $media1;
                // $newRecord->media2 = $media2;
                // $newRecord->media3 = $media3;
                // $newRecord->media4 = $media4;
                // $newRecord->media5 = $media5;
                // $newRecord->media6 = $media6;
                // $newRecord->media7 = $media7;
                // $newRecord->media8 = $media8;
                // $newRecord->media9 = $media9;
                // $newRecord->username = $username1;
                // $newRecord->template_id = $template_name1;
                // $newRecord->name = $name1;
                // $newRecord->status = 'PP1';
                // $newRecord->delivery_date = date('Y-m-d');
                // $newRecord->delivery_time = date('H:i:s');
                // $newRecord->dat = date('d M Y');
                // $newRecord->tim = date('H:i');
                // $newRecord->request_id = rand(10000000, 99999999);
                // $newRecord->save();

                // $inserted_rows++;

                // Output progress if needed
            // }

            // Commit transaction
            // DB::commit();

            // // Close file handle
            // fclose($file_handle);

            // // Update email credits
            // // User::where('username', $username1)->decrement('email_credits', $inserted_rows);

            // // Insert into campaign_details table
            // CampaignDetail::create([
            //     'username' => $username1,
            //     'senderid' => $name1,
            //     'numbers' => $inserted_rows,
            //     'dat' => date('d M Y'),
            //     'date' => date('Y-m-d'),
            //     'request_id' => $newRecord->request_id,
            //     'queue_no' => $template_name1,
//             // ]);

//             // Output summary
//             echo "<p>Total rows processed: $total_rows</p>";
//             echo "<p>Inserted rows: $inserted_rows</p>";
//             echo "<p>Missing rows: " . implode(", ", $missing_rows) . "</p>";

//             // Redirect to another page after a delay
//             echo "<script>setTimeout(function(){ window.location.href = 'https://wa20.nuke.co.in/v5/broadcast/email_credits'; }, 6000);</script>";
//         } catch (\Exception $e) {
//             // Handle any exceptions
//             DB::rollBack();
//             echo "<p>An error occurred: " . $e->getMessage() . "</p>";
//         }
//     }
// }
















// class CsvController extends Controller
// {
//     public function uploadCsv(Request $request)
//     {
//         // Validate incoming request
//         $validator = Validator::make($request->all(), [
//             'username' => 'required',
//             'name1' => 'nullable',
//             'template_name1' => 'required',
//             'csv_file' => 'required|mimes:csv,txt', // Adjust max file size as needed
//         ]);

//         // Return validation errors if any
//         if ($validator->fails()) {
//             return response()->json(['errors' => $validator->errors()], 400);
//         }

//         try {
//             // Extract request data
//             $username = $request->input('username');
//             $name1 = $request->input('name1');
//             $template_name1 = $request->input('template_name1');
//             $delivery_date = $request->input('delivery_date');
//             $delivery_time = $request->input('delivery_time');

//             // Generate request_id
//             $request_id = rand(10000000, 99999999);

//             // Start transaction
//             DB::beginTransaction();

//             // Process CSV file
//             if ($request->file('csv_file')->isValid()) {
//                 $csv_file = $request->file('csv_file');
//                 $file_path = $csv_file->getRealPath();

//                 // Open the CSV file for reading
//                 $file_handle = fopen($file_path, "r");

//                 // Initialize variables
//                 $total_rows = 0;
//                 $inserted_rows = 0;
//                 $missing_rows = [];

//                 // Prepare insert statement for mob_no3 table
//                 $insert_sql = "INSERT INTO mob_no3 (receiver, media1, media2, media3, media4, media5, media6, media7, media8, media9, username, template_id, name, status, delivery_date, delivery_time, dat, tim, request_id)
//                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

//                 // Loop through CSV data
//                 $isHeader = true; // Flag to skip the header row
//                 while (($data = fgetcsv($file_handle)) !== false) {
//                     if ($isHeader) {
//                         $isHeader = false;
//                         continue; // Skip header row
//                     }
//                     $total_rows++;

//                     // Check for empty rows
//                     if (empty($data)) {
//                         $missing_rows[] = $total_rows;
//                         continue;
//                     }

//                     // Extract data from CSV row
//                     $receiver = $data[0];
//                     $media1 = isset($data[1]) ? $data[1] : '';
//                     $media2 = isset($data[2]) ? $data[2] : '';
//                     $media3 = isset($data[3]) ? $data[3] : '';
//                     $media4 = isset($data[4]) ? $data[4] : '';
//                     $media5 = isset($data[5]) ? $data[5] : '';
//                     $media6 = isset($data[6]) ? $data[6] : '';
//                     $media7 = isset($data[7]) ? $data[7] : '';
//                     $media8 = isset($data[8]) ? $data[8] : '';
//                     $media9 = isset($data[9]) ? $data[9] : '';

//                     // Execute insert query for mob_no3 table
//                     // $params = [
//                     //     $receiver, $media1, $media2, $media3, $media4, $media5, $media6, $media7, $media8, $media9,
//                     //     $username, $template_name1, $name1, 'PP1',
//                     //     now()->format('Y-m-d'), now()->format('H:i:s'),
//                     //     now()->format('d M Y'), now()->format('H:i'), $request_id
//                     // ];

//                     // if (DB::insert($insert_sql, $params)) {
//                     //     $inserted_rows++;
//                     // }

//                     // Insert into database
//                     $data = DB::table('mob_no3')->insert([
//                         // 'receiver' => $receiver,
//                         'media1' => $media1,
//                         'media2' => $media2,
//                         'media3' => $media3,
//                         'media4' => $media4,
//                         'media5' => $media5,
//                         'media6' => $media6,
//                         'media7' => $media7,
//                         'media8' => $media8,
//                         'media9' => $media9,
//                         'username' => $username,
//                         'template_id' => $template_name1,
//                         'name' => $name1,
//                         'status' => 'PP1',
//                         'delivery_date' => $delivery_date,
//                         'delivery_time' => $delivery_time,
//                         'dat' => now()->format('d M Y'),
//                         'tim' => now()->format('H:i'),
//                         'request_id' => $request_id,
//                         'created_at' => now(),
//                         'updated_at' => now(),
//                     ]);

//                     if ($data) {
//                         $inserted_rows++;
//                     } else {
//                         // Log error and rollback transaction
//                         DB::rollBack();
//                         fclose($file_handle);
//                         return response()->json(['error' => 'Error inserting record'], 500);
//                     }
//                 }

//                 // Commit transaction
//                 DB::commit();
//                 fclose($file_handle);

//                 // Response
//                 return response()->json([
//                     'message' => 'CSV file uploaded successfully',
//                     'total_rows_processed' => $total_rows,
//                     'inserted_rows' => $inserted_rows,
//                     'missing_rows' => $missing_rows,
//                     'request_id' => $request_id,
//                 ], 200);
//             }
//         } catch (\Exception $e) {
//             // Rollback transaction on exception
//             DB::rollBack();
//             return response()->json(['error' => $e->getMessage()], 500);
//         }
//     }
// }







// <?php

// namespace App\Http\Controllers;

// use Illuminate\Http\Request;
// use App\Models\Broadcast_trial;
// use App\Models\Mob_no3_trial;
// use App\Models\Campaign_detail_trial;
// use Illuminate\Support\Facades\Validator;

// class DataInsertionController extends Controller
// {
//     public function store(Request $request)
//     {
//         // Define the validation rules based on the fields of all three tables
//         $validator = Validator::make($request->all(), [
//             'username' => 'required|string|max:255',
//             'template_id' => 'required|integer',
//             'message' => 'nullable|string',
//             'broadcast_name' => 'nullable|string',
//             'broadcast_number' => 'nullable|string',
//             'schedule_date' => 'nullable|date',
//             'schedule_time' => 'nullable|date_format:H:i:s',
//             'contacts' => 'nullable|string',
//             'created_at' => 'nullable|date',
//             'status' => 'nullable|integer',
//             'success_full_per' => 'nullable|string|max:45',
//             'media1' => 'nullable|string',
//             'media2' => 'nullable|string',
//             'media3' => 'nullable|string',
//             'media4' => 'nullable|string',
//             'media5' => 'nullable|string',
//             'media6' => 'nullable|string',
//             'media7' => 'nullable|string',
//             'media8' => 'nullable|string',
//             'broadcast_message' => 'nullable|string',
//             'lineCount' => 'nullable|string|max:50',
//             'group_table_length' => 'nullable|string|max:50',
//             'receiver' => 'nullable|integer',
//             'whatsappid' => 'nullable|string|max:500',
//             'senderid' => 'nullable|string|max:500',
//             'senderpwd' => 'nullable|string|max:100',
//             'name' => 'nullable|string|max:50|collation:utf8mb4_unicode_ci',
//             'reseller' => 'nullable|string|max:50',
//             'masterreseller' => 'nullable|string|max:1000|collation:utf8mb4_unicode_ci',
//             'dat' => 'nullable|string|max:30',
//             'tim' => 'nullable|string|max:30',
//             'credits' => 'nullable|string|max:10',
//             'request_id' => 'nullable|string|max:30',
//             'delivery_time' => 'nullable|string|max:30',
//             'delivery_date' => 'nullable|string',
//             'base64' => 'nullable|string',
//             'button1_value' => 'nullable|string|max:100',
//             'button2_value' => 'nullable|string|max:100',
//             'button3_value' => 'nullable|string|max:100',
//             'call_title' => 'nullable|string|max:100',
//             'call_number' => 'nullable|string|max:100',
//             'url_title' => 'nullable|string|max:100',
//             'url_value' => 'nullable|string|max:100',
//             'text' => 'nullable|string|max:1100',
//             'Reseller' => 'nullable|string|max:200',
//             'estimated_time' => 'nullable|string|max:200',
//             'date' => 'nullable|string|max:100',
//             'numbers' => 'nullable|string|max:200',
//             'queue_no' => 'nullable|string|max:200',
//             'file' => 'nullable|mimes:csv,txt'
//         ]);

//         // Handle validation failure
//         if ($validator->fails()) {
//             return response()->json(['errors' => $validator->errors()], 422);
//         }

//         // Assign input data to variables
//         $username = $request->input('username');
//         $template_id = $request->input('template_id');
//         $message = $request->input('message');
//         $broadcast_name = $request->input('broadcast_name');
//         $broadcast_number = $request->input('broadcast_number');
//         $schedule_date = $request->input('schedule_date');
//         $schedule_time = $request->input('schedule_time');
//         $contacts = $request->input('contacts');
//         $created_at = $request->input('created_at');
//         $status = $request->input('status');
//         $success_full_per = $request->input('success_full_per');
//         $media1 = $request->input('media1');
//         $media2 = $request->input('media2');
//         $media3 = $request->input('media3');
//         $media4 = $request->input('media4');
//         $media5 = $request->input('media5');
//         $media6 = $request->input('media6');
//         $media7 = $request->input('media7');
//         $media8 = $request->input('media8');
//         $broadcast_message = $request->input('broadcast_message');
//         $lineCount = $request->input('lineCount');
//         $group_table_length = $request->input('group_table_length');
//         $receiver = $request->input('receiver');
//         $whatsappid = $request->input('whatsappid');
//         $senderid = $request->input('senderid');
//         $senderpwd = $request->input('senderpwd');
//         $name = $request->input('name');
//         $reseller = $request->input('reseller');
//         $masterreseller = $request->input('masterreseller');
//         $dat = $request->input('dat');
//         $tim = $request->input('tim');
//         $credits = $request->input('credits');
//         // $request_id = $request->input('request_id');
//         $request_id = rand(111111, 999999);
//         $delivery_time = $request->input('delivery_time');
//         $delivery_date = $request->input('delivery_date');
//         $base64 = $request->input('base64');
//         $button1_value = $request->input('button1_value');
//         $button2_value = $request->input('button2_value');
//         $button3_value = $request->input('button3_value');
//         $call_title = $request->input('call_title');
//         $call_number = $request->input('call_number');
//         $url_title = $request->input('url_title');
//         $url_value = $request->input('url_value');
//         $text = $request->input('text');
//         $reseller_campaign = $request->input('Reseller');
//         $estimated_time = $request->input('estimated_time');
//         $date_campaign = $request->input('date');
//         $numbers = $request->input('numbers');
//         $queue_no = $request->input('queue_no');
//         $status_campaign = $request->input('status');
//         $campaign_date = $request->input('date');

//         // Insert data into broadcBroadcast_trialast_trials
//         Broadcast_trial::create([
//             'username' => $username,
//             'template_id' => $template_id,
//             'message' => $message,
//             'broadcast_name' => $broadcast_name,
//             'broadcast_number' => $broadcast_number,
//             'schedule_date' => $schedule_date,
//             'schedule_time' => $schedule_time,
//             'contacts' => $contacts,
//             'created_at' => $created_at,
//             'status' => $status,
//             'success_full_per' => $success_full_per,
//             'media1' => $media1,
//             'media2' => $media2,
//             'media3' => $media3,
//             'media4' => $media4,
//             'media5' => $media5,
//             'media6' => $media6,
//             'media7' => $media7,
//             'media8' => $media8,
//             'broadcast_message' => $broadcast_message,
//             'lineCount' => $lineCount,
//             'group_table_length' => $group_table_length
//         ]);

//         // Insert data into mob_no3_trials
//         if ($request->hasFile('file')) {
//             $path = $request->file('file')->getRealPath();
//             $data = array_map('str_getcsv', file($path));

//             foreach ($data as $index => $row) {
//                 Mob_no3_trial::create([
//                     'receiver' => $row[0] ?? $receiver,
//                     'whatsappid' => $whatsappid,
//                     'senderid' => $senderid,
//                     'senderpwd' => $senderpwd,
//                     'name' => $name,
//                     'username' => $username,
//                     'reseller' => $reseller,
//                     'masterreseller' => $masterreseller,
//                     'status' => $status,
//                     'dat' => $dat,
//                     'tim' => $tim,
//                     'credits' => $credits,
//                     'request_id' => $request_id,
//                     'delivery_time' => $delivery_time,
//                     'delivery_date' => $delivery_date,
//                     'template_id' => $template_id,
//                     'message' => $message,
//                     'schedule_date' => $schedule_date,
//                     'schedule_time' => $schedule_time,
//                     'success_full_per' => $success_full_per,
//                     'media1' => $row[1] ?? $media1,
//                     'media2' => $row[2] ?? $media2,
//                     'media3' => $row[3] ?? $media3,
//                     'media4' => $row[4] ?? $media4,
//                     'media5' => $row[5] ?? $media5,
//                     'media6' => $row[6] ?? $media6,
//                     'media7' => $row[7] ?? $media7,
//                     'media8' => $row[8] ?? $media8,
//                     'media9' => $row[9] ?? null,
//                     'media10' => $row[10] ?? null,
//                     'media11' => $row[11] ?? null,
//                     'media12' => $row[12] ?? null,
//                     'media13' => $row[13] ?? null,
//                     'base64' => $base64,
//                     'button1_value' => $button1_value,
//                     'button2_value' => $button2_value,
//                     'button3_value' => $button3_value,
//                     'call_title' => $call_title,
//                     'call_number' => $call_number,
//                     'url_title' => $url_title,
//                     'url_value' => $url_value,
//                     'text' => $text,
//                 ]);
//             }
//         } else {
//             Mob_no3_trial::create([
                // 'receiver' => $receiver,
                // 'whatsappid' => $whatsappid,
                // 'senderid' => $senderid,
                // 'senderpwd' => $senderpwd,
                // 'name' => $name,
                // 'username' => $username,
                // 'reseller' => $reseller,
                // 'masterreseller' => $masterreseller,
                // 'status' => $status,
                // 'dat' => $dat,
                // 'tim' => $tim,
                // 'credits' => $credits,
                // 'request_id' => $request_id,
                // 'delivery_time' => $delivery_time,
                // 'delivery_date' => $delivery_date,
                // 'template_id' => $template_id,
                // 'message' => $message,
                // 'schedule_date' => $schedule_date,
                // 'schedule_time' => $schedule_time,
                // 'success_full_per' => $success_full_per,
                // 'base64' => $base64,
                // 'button1_value' => $button1_value,
                // 'button2_value' => $button2_value,
//                 'button3_value' => $button3_value,
//                 'call_title' => $call_title,
//                 'call_number' => $call_number,
//                 'url_title' => $url_title,
//                 'url_value' => $url_value,
//                 'text' => $text,
//             ]);
//         }

//         // Insert data into campaign_details_trials
//         Campaign_detail_trial::create([
//             'username' => $username,
//             'senderid' => $senderid,
//             'request_id' => $request_id,
//             'Reseller' => $reseller_campaign,
//             'dat' => $dat,
//             'estimated_time' => $estimated_time,
//             'date' => $campaign_date,
//             'status' => $status_campaign,
//             'numbers' => $numbers,
//             'queue_no' => $queue_no,
//         ]);

//         return response()->json(['message' => 'Data inserted successfully'], 201);
//     }
// }


//******************************broadcast data insertion******************************************/
// namespace App\Http\Controllers;
// use Illuminate\Http\Request;
// use App\Models\BroadcastTable;
// use Illuminate\Support\Facades\Validator;
// class BroadcastTableController extends Controller
// {
// public function store(Request $request)
// {
// // Manually validate incoming request
// $validator = Validator::make($request->all(), [
// 'username' => 'required|string',
// 'template_id' => 'required|integer',
// 'message' => 'nullable|string',
// 'broadcast_name' => 'required|string',
// 'broadcast_number' => 'nullable|string',
// 'contacts' => 'string',
// 'status' => 'integer',
// 'success_full_per' => 'nullable|string|max:45',
// 'media1' => 'nullable|mimes:avif,jpg,png,jpeg|max:3000',
// 'media2' => 'nullable|string',
// 'media3' => 'nullable|string',
// 'media4' => 'nullable|string',
// 'media5' => 'nullable|string',
// 'media6' => 'nullable|string',
// 'media7' => 'nullable|string',
// 'media8' => 'nullable|string',
// 'broadcast_message' => 'nullable|string',
// 'lineCount' => 'nullable|string|max:50',
// 'group_table_length' => 'nullable|string|max:50',
// ]);

// // Check if validation fails
// if ($validator->fails()) {
// return response()->json(['status' => 0, 'errors' => $validator->errors()], 400);
// }

// // Handle file upload for media1
// if ($request->hasFile('media1')) {
// $media1 = $request->file('media1');
// $media1Path = $media1->store('media', 'public'); // Store the file in the 'public/media' directory
// $request->merge(['media1' => $media1Path]); // Merge the file path into the request data
// }

// // Create new record in database using Eloquent ORM
// try {
// $broadcast = BroadcastTable::create($request->all());

// // Optionally, you can perform additional actions here before returning success
// // For example, sending notifications or triggering other events

// return response()->json(['status' => 1], 200);
// } catch (\Exception $e) {
// // Log or handle error appropriately
// return response()->json(['status' => 0, 'error' => $e->getMessage()], 500);
// }
// }

// public function store(Request $request)
// {
// // Manually validate incoming request
// $validator = Validator::make($request->all(), [
// 'username' => 'required|string',
// 'template_id' => 'required|integer',
// 'message' => 'nullable|string',
// 'broadcast_name' => 'required|string',
// 'broadcast_number' => 'nullable|string',
// 'contacts' => 'string',
// 'status' => 'integer',
// 'success_full_per' => 'nullable|string|max:45',
// 'media1' => 'nullable|string',
// 'media2' => 'nullable|string',
// 'media3' => 'nullable|string',
// 'media4' => 'nullable|string',
// 'media5' => 'nullable|string',
// 'media6' => 'nullable|string',
// 'media7' => 'nullable|string',
// 'media8' => 'nullable|string',
// 'broadcast_message' => 'nullable|string',
// 'lineCount' => 'nullable|string|max:50',
// 'group_table_length' => 'nullable|string|max:50',
// ]);

// // Check if validation fails
// if ($validator->fails()) {
// return response()->json(['status' => 0, 'errors' => $validator->errors()], 400);
// }

// // Create new record in database using Eloquent ORM
// try {
// $broadcast = BroadcastTable::create($request->all());

// // Optionally, you can perform additional actions here before returning success
// // For example, sending notifications or triggering other events

// return response()->json(['status' => 1], 200);
// } catch (\Exception $e) {
// // Log or handle error appropriately
// return response()->json(['status' => 0, 'error' => $e->getMessage()], 500);
// }
// }
