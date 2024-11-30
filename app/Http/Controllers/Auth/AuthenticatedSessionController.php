<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(Request $request): Response
    {
        $path = $request->getRequestUri();
        return Inertia::render('Auth/AuthForm', [
            'status' => 200,
            'path' => $path,
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'contactInfo' => [
                'required',
                function ($attribute, $value, $fail) {
                    if (!filter_var($value, FILTER_VALIDATE_EMAIL) && !preg_match('/^[0-9]{10,15}$/', $value)) {
                        $fail('The contact information must be a valid email or phone number.');
                    }
                }
            ],
            'password' => ['required', Rules\Password::defaults()],
        ]);

        if ($validator->fails()) {
            // Log::info('Validation errors:', $validator->errors()->all());
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $contactInfo = $request->input('contactInfo');
        $isEmail = filter_var($contactInfo, FILTER_VALIDATE_EMAIL);

        $credentials = $isEmail
            ? ['email' => $contactInfo, 'password' => $request->password]
            : ['phone' => $contactInfo, 'password' => $request->password];

        if (Auth::attempt($credentials)) {
            // If authentication is successful, regenerate the session and redirect
            $request->session()->regenerate();
            return redirect()->intended(route('dashboard', absolute: false));
        }

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
