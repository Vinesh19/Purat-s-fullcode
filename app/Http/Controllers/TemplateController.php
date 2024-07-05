<?php

namespace App\Http\Controllers;

use App\Models\Template;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TemplateController extends Controller
{
    // fetching templat_name from templates(table)
    public function show_name(Request $request)
    {
        try {
            // Validate the incoming request
            $validator = Validator::make($request->all(), [
                'username' => 'required|string|exists:ci_admin,username'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 0,
                    'message' => $validator->errors()
                ], 422);
            }

            $username = $request->username;

            // Find the template names by username
            $templateNames = Template::where('username', $username)
                ->pluck('template_name', 'id');

            if ($templateNames->isEmpty()) {
                return response()->json([
                    'status' => 0,
                    'message' => 'Template names not found'
                ], 404);
            }

            // Return the template data with a success status
            return response()->json([
                'status' => 1,
                'template' => $templateNames
            ]);
        } catch (\Exception $e) {
            // Handle any other errors
            return response()->json([
                'status' => 0,
                'message' => 'An error occurred: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($template_id)
    {
        try {
            // Find the template by template_id and include the related language data
            $template = Template::with('language')->where('id', $template_id)->first(); // Using first() to avoid exception

            if (!$template) {
                // Handle the case where the template is not found
                return response()->json([
                    'status' => 0,
                    'message' => 'Template not found'
                ], 404);
            }

            // Return the template data with the related language data and a success status
            return response()->json([
                'status' => 1,
                'template' => $template,
                // 'language' => $template->language
            ]);
        } catch (\Exception $e) {
            // Handle any other exceptions
            return response()->json([
                'status' => 0,
                'message' => 'An error occurred while fetching the template',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:255|exists:ci_admin,username',
            'template_name' => 'required|string|max:255',
            'reason' => 'required|string|max:255',
            'category' => 'required|integer',
            'new_category' => 'required|string|max:100',
            'language' => 'required|integer',
            'header_area_type' => 'required|string',
            'header_text' => 'nullable|string|max:65535',
            'header_media_type' => 'nullable|string|max:255',
            'header_media_set' => 'nullable|string|max:65535',
            'template_body' => 'nullable|string|max:2000',
            'template_footer' => 'nullable|string|max:255',
            'button_type_set' => 'nullable|string|max:255',
            'call_action_type_set1' => 'nullable|string|max:255',
            'call_action_type_set2' => 'nullable|string|max:255',
            'call_phone_btn_text' => 'nullable|string|max:255',
            'call_phone_btn_phone_number' => 'nullable|string|max:255',
            'visit_website_btn_text' => 'nullable|string|max:255',
            'visit_website_url_set' => 'nullable|string|max:255',
            'visit_website_url_text' => 'nullable|string|max:255',
            'quick_reply_btn_text1' => 'nullable|string|max:255',
            'quick_reply_btn_text2' => 'nullable|string|max:255',
            'quick_reply_btn_text3' => 'nullable|string|max:255',
            'status' => 'required|integer',
            'template_id' => 'required|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $existingTemplate = Template::where('template_name', $request->template_name)
            ->where('username', $request->username)
            ->first();

        if ($existingTemplate) {
            return response()->json(['error' => 'You already have a template with this name'], 400);
        }

        try {
            $template = Template::create($validator->validated());
            return response()->json([
                'message' => 'Template data inserted successfully!',
                'data' => $template
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create template',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $template_id)
    {
        // Validate the incoming request data
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:255|exists:ci_admin,username',
            'template_name' => 'required|string|max:255',
            'reason' => 'required|string|max:255',
            'category' => 'required|integer',
            'new_category' => 'required|string|max:100',
            'language' => 'required|integer',
            'header_area_type' => 'required|string',
            'header_text' => 'nullable|string|max:65535',
            'header_media_type' => 'nullable|string|max:255',
            'header_media_set' => 'nullable|string|max:65535',
            'template_body' => 'nullable|string|max:2000',
            'template_footer' => 'nullable|string|max:255',
            'button_type_set' => 'nullable|string|max:255',
            'call_action_type_set1' => 'nullable|string|max:255',
            'call_action_type_set2' => 'nullable|string|max:255',
            'call_phone_btn_text' => 'nullable|string|max:255',
            'call_phone_btn_phone_number' => 'nullable|string|max:255',
            'visit_website_btn_text' => 'nullable|string|max:255',
            'visit_website_url_set' => 'nullable|string|max:255',
            'visit_website_url_text' => 'nullable|string|max:255',
            'quick_reply_btn_text1' => 'nullable|string|max:255',
            'quick_reply_btn_text2' => 'nullable|string|max:255',
            'quick_reply_btn_text3' => 'nullable|string|max:255',
            'status' => 'required|integer',
            'template_id' => 'required|string|max:100',
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // Find the template by template_id
            $template = Template::where('id', $template_id)->first(); // Changed: used first() instead of findOrFail

            if (!$template) {
                // Handle the case where the template is not found
                return response()->json([
                    'status' => 0,
                    'message' => 'Template not found'
                ], 404);
            }

            // Update the template with the validated data
            $template->update($validator->validated());

            // Return the updated template data with a success status
            return response()->json([
                'message' => 'Template data updated successfully!',
                'data' => $template
            ], 200);
        } catch (\Exception $e) {
            // Handle any other exceptions
            return response()->json([
                'message' => 'Failed to update template',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
