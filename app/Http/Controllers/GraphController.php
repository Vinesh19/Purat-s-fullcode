<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\MobNo3;
use Illuminate\Http\Request;
// use Illuminate\Support\Facades\DB;


class GraphController extends Controller
{

    // public function getCountByTimeFrame(Request $request)
    // {
    //     // Validate the request
    //     $request->validate([
    //         'days' => 'sometimes|required|integer|min:1', // days parameter is optional, but required if provided
    //         'date' => 'sometimes|required|date_format:Y-m-d', // date parameter is optional, but required if provided in Y-m-d format
    //     ]);

    //     try {
    //         $count = 0;

    //         if ($request->has('days')) {
    //             // If days parameter is provided, count mobile numbers uploaded in the last X days
    //             $days = $request->input('days');
    //             $startDate = Carbon::now()->subDays($days)->startOfDay();

    //             $count = MobNo3::where('created_at', '>=', $startDate)->count();
    //         } elseif ($request->has('date')) {
    //             // If date parameter is provided, count mobile numbers uploaded on the specific date
    //             $date = $request->input('date');

    //             $count = MobNo3::whereDate('created_at', $date)->count();
    //         } else {
    //             // Handle scenario where neither days nor date parameter is provided
    //             return response()->json(['error' => 'You must provide either "days" or "date" parameter.'], 400);
    //         }

    //         // Prepare response
    //         if ($count === 0) {
    //             return response()->json(['message' => 'No mobile numbers found for the specified criteria.'], 404);
    //         } else {
    //             return response()->json(['count' => $count]);
    //         }
    //     } catch (\Exception $e) {
    //         // Return the exception message
    //         return response()->json(['error' => $e->getMessage()], 500);
    //     }
    // }

    public function getCountByTimeFrame(Request $request)
    {
        // Validate the request
        $request->validate([
            'days' => 'sometimes|required|integer|min:1', // days parameter is optional, but required if provided
            'date' => 'sometimes|required|date_format:Y-m-d', // date parameter is optional, but required if provided in Y-m-d format
        ]);

        try {
            $data = [];
            $totalCount = 0;

            if ($request->has('days')) {
                // If days parameter is provided, count mobile numbers uploaded in the last X days
                $days = $request->input('days');
                $startDate = Carbon::now()->subDays($days - 1)->startOfDay(); // Adjust the start date to include the full range

                // Fetch counts per day
                for ($i = 0; $i < $days; $i++) {
                    $date = $startDate->copy()->addDays($i);
                    $count = MobNo3::whereDate('created_at', $date)->count();
                    $data['Day ' . ($i + 1)] = $count;
                    $totalCount += $count;
                }
            } elseif ($request->has('date')) {
                // If date parameter is provided, count mobile numbers uploaded on the specific date
                $date = $request->input('date');
                $totalCount = MobNo3::whereDate('created_at', $date)->count();
                $data['Date'] = $date;
                $data['Count'] = $totalCount;
            } else {
                // Handle scenario where neither days nor date parameter is provided
                return response()->json(['error' => 'You must provide either "days" or "date" parameter.'], 400);
            }

            // Prepare response
            if ($totalCount === 0) {
                return response()->json(['message' => 'No mobile numbers found for the specified criteria.'], 404);
            } else {
                $data['Total Count'] = $totalCount;
                return response()->json($data);
            }
        } catch (\Exception $e) {
            // Return the exception message
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
