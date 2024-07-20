<?php

namespace App\Http\Controllers;

use App\Models\Template;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TemplateController extends Controller
{

    public function handleTemplate(Request $request)
    {
        //updated start 18-07-2024
        $validator = Validator::make($request->all(), [
            'action' => 'required|string|in:create,read,update,delete|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        //updated end 18-07-2024

        $action = $request->input('action');

        if ($action == 'create') {
            // Validate create-specific fields
            $validator = Validator::make($request->all(), [
                //updated start 18-07-2024
                //added max:255 and template_name
                //updated end 18-07-2024
                'username' => 'required|string|max:255|exists:ci_admin,username|max:255',
                'template_name' => 'required|string|max:255|regex:/^[a-z0-9_]*$/|max:255',
                'reason' => 'required|string|max:255',
                'category' => 'required|integer',
                'new_category' => 'required|string|max:255',
                'language' => 'required|integer|max:15',
                'header_area_type' => 'required|string|max:255',
                'header_text' => 'nullable|string|max:255',
                'header_media_type' => 'nullable|string|max:255',
                'header_media_set' => 'nullable|string|max:255',
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
                'status' => 'integer',
                'template_id' => 'string|max:255',
            ], [
                'template_name.regex' => 'Template name only allowed small letters and underscore',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $data = $validator->validated();

            $existingTemplate = Template::where('template_name', $data['template_name'])
                ->where('username', $data['username'])
                ->first();

            if ($existingTemplate) {
                return response()->json(['error' => 'You already have a template with this name'], 400);
            }

            try {
                $template = Template::create($data);
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
        } elseif ($action == 'read') {

            //updated start 18-07-2024
            // Custom validation logic to ensure either username or id is present
            $validator = Validator::make($request->all(), [
                'username' => 'nullable|string|required_without_all:id',
                'id' => 'nullable|integer|required_without_all:username',
            ], [
                'username.required_without_all' => 'Either username or id is required.',
                'id.required_without_all' => 'Either username or id is required.'
            ]);

            // Check if validation fails
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }
            //updated staendrt 18-07-2024

            $username = $request->input('username');
            $id = $request->input('id');
            if ($username) {
                try {

                    //updated start 18-07-2024
                    //remove validations from here
                    //updated end 18-07-2024

                    // Find the template names by username
                    $templateNames = Template::with('language')->where('username', $username)->get();

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
            } elseif ($id) {
                try {

                    //updated start 18-07-2024
                    //remove validations from here
                    //updated end 18-07-2024

                    // Find the template by template_id and include the related language data
                    $template = Template::with('language')->where('id', $id)->first(); // Using first() to avoid exception

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
        } elseif ($action == 'update') {

            // Validate the incoming request data
            $validator = Validator::make($request->all(), [
                //updated start 18-07-2024
                //added max:255 and template_name
                //updated end 18-07-2024
                'id' => 'required|numeric',
                'username' => 'string|max:255|exists:ci_admin,username',
                'template_name' => 'required|string|max:255|regex:/^[a-z0-9_]*$/|max:255',
                'reason' => 'string|max:255',
                'category' => 'integer',
                'new_category' => 'string|max:100',
                'language' => 'integer|max:255',
                'header_area_type' => 'string|max:255',
                'header_text' => 'nullable|string|max:255',
                'header_media_type' => 'nullable|string|max:255',
                'header_media_set' => 'nullable|string|max:255',
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
                'status' => 'integer',
                'template_id' => 'string|max:255',
            ]);
            $id = $request->input('id');

            // Check if validation fails
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            try {
                // Find the template by template_id
                $template = Template::where('id', $id)->first(); // Changed: used first() instead of findOrFail

                if (!$template) {
                    // Handle the case where the template is not found
                    return response()->json([
                        'status' => 0,
                        'message' => 'Template not found'
                    ], 404);
                }

                // Check if any changes were made
                $changes = array_diff_assoc($validator->validated(), $template->toArray());

                if (empty($changes)) {
                    return response()->json([
                        'message' => 'No changes made to the template'
                    ], 200);
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
        } else {
            return response()->json(['error' => 'Invalid action'], 400);
        }
    }
}
