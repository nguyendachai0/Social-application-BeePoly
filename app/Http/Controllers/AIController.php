<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class AIController extends Controller
{
    public function getResponse(Request $request)
    {
        Log::info(['requset' => $request->all()]);

        $url = 'https://api.groq.com/openai/v1/chat/completions';
        $apiKey = env('GROQ_API_KEY');

        $payload = [
            'model' => 'llama3-8b-8192',
            'messages' => [
                ['role' => 'system', 'content' => 'You are a helpful assistant.'],
                ['role' => 'user', 'content' => $request->input('message')],
            ],
            'temperature' => 1,
            'max_tokens' => 1024,
            'top_p' => 1,
            'stream' => false, // Change this to `true` if you want streaming responses
            'stop' => null, // Add any custom stop tokens here if needed
        ];
        try {
            // Make the request to Groq AI
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->post($url, $payload);

            // Log the response
            Log::info(['groq_ai_response' => $response->json()]);

            // Return the assistant's reply
            return response()->json($response->json()['choices'][0]['message']['content']);
        } catch (\Exception $e) {
            // Handle exceptions and log errors
            Log::error(['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to fetch response from Groq AI.'], 500);
        }
    }
}
