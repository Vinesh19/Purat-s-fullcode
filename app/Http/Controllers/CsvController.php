<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CsvController extends Controller
{
    public function uploadCsv(Request $request)
    {
        // Validate incoming request
        $validator = Validator::make($request->all(), [
            'username' => 'required',
            'name1' => 'nullable',
            'template_name1' => 'required',
            'csv_file' => 'required|mimes:csv,txt', // Adjust max file size as needed
        ]);

        // Return validation errors if any
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            // Extract request data
            $username = $request->input('username');
            $name1 = $request->input('name1');
            $template_name1 = $request->input('template_name1');
            $delivery_date = $request->input('delivery_date');
            $delivery_time = $request->input('delivery_time');

            // Generate request_id
            $request_id = rand(10000000, 99999999);

            // Start transaction
            DB::beginTransaction();

            // Process CSV file
            if ($request->file('csv_file')->isValid()) {
                $csv_file = $request->file('csv_file');
                $file_path = $csv_file->getRealPath();

                // Open the CSV file for reading
                $file_handle = fopen($file_path, "r");

                // Initialize variables
                $total_rows = 0;
                $inserted_rows = 0;
                $missing_rows = [];

                // Prepare insert statement for mob_no3 table
                $insert_sql = "INSERT INTO mob_no3 (receiver, media1, media2, media3, media4, media5, media6, media7, media8, media9, username, template_id, name, status, delivery_date, delivery_time, dat, tim, request_id)
                               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

                // Loop through CSV data
                $isHeader = true; // Flag to skip the header row
                while (($data = fgetcsv($file_handle)) !== false) {
                    if ($isHeader) {
                        $isHeader = false;
                        continue; // Skip header row
                    }
                    $total_rows++;

                    // Check for empty rows
                    if (empty($data)) {
                        $missing_rows[] = $total_rows;
                        continue;
                    }

                    // Extract data from CSV row
                    $receiver = $data[0];
                    $media1 = isset($data[1]) ? $data[1] : '';
                    $media2 = isset($data[2]) ? $data[2] : '';
                    $media3 = isset($data[3]) ? $data[3] : '';
                    $media4 = isset($data[4]) ? $data[4] : '';
                    $media5 = isset($data[5]) ? $data[5] : '';
                    $media6 = isset($data[6]) ? $data[6] : '';
                    $media7 = isset($data[7]) ? $data[7] : '';
                    $media8 = isset($data[8]) ? $data[8] : '';
                    $media9 = isset($data[9]) ? $data[9] : '';

                    // Execute insert query for mob_no3 table
                    // $params = [
                    //     $receiver, $media1, $media2, $media3, $media4, $media5, $media6, $media7, $media8, $media9,
                    //     $username, $template_name1, $name1, 'PP1',
                    //     now()->format('Y-m-d'), now()->format('H:i:s'),
                    //     now()->format('d M Y'), now()->format('H:i'), $request_id
                    // ];

                    // if (DB::insert($insert_sql, $params)) {
                    //     $inserted_rows++;
                    // }

                    // Insert into database
                    $data = DB::table('mob_no3')->insert([
                        // 'receiver' => $receiver,
                        'media1' => $media1,
                        'media2' => $media2,
                        'media3' => $media3,
                        'media4' => $media4,
                        'media5' => $media5,
                        'media6' => $media6,
                        'media7' => $media7,
                        'media8' => $media8,
                        'media9' => $media9,
                        'username' => $username,
                        'template_id' => $template_name1,
                        'name' => $name1,
                        'status' => 'PP1',
                        'delivery_date' => $delivery_date,
                        'delivery_time' => $delivery_time,
                        'dat' => now()->format('d M Y'),
                        'tim' => now()->format('H:i'),
                        'request_id' => $request_id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);

                    if ($data) {
                        $inserted_rows++;
                    } else {
                        // Log error and rollback transaction
                        DB::rollBack();
                        fclose($file_handle);
                        return response()->json(['error' => 'Error inserting record'], 500);
                    }
                }

                // Commit transaction
                DB::commit();
                fclose($file_handle);

                // Response
                return response()->json([
                    'message' => 'CSV file uploaded successfully',
                    'total_rows_processed' => $total_rows,
                    'inserted_rows' => $inserted_rows,
                    'missing_rows' => $missing_rows,
                    'request_id' => $request_id,
                ], 200);
            }
        } catch (\Exception $e) {
            // Rollback transaction on exception
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}




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
