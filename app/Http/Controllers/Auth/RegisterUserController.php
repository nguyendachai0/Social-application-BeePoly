<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Carbon;

class RegisterUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'firstName' => 'required|string|max:255',
            'surName' => 'required|string|max:255',
            'contactInfo' => [
                'required',
                function ($attribute, $value, $fail) {
                    if (!filter_var($value, FILTER_VALIDATE_EMAIL) && !preg_match('/^[0-9]{10,15}$/', $value)) {
                        $fail('The contact information must be a valid email or phone number.');
                    }
                }
            ],
            'dateOfBirth' => 'required|date_format:d/m/Y',
            'gender' => 'required|string',
            'password' => ['required', Rules\Password::defaults()],
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif',
        ]);


        if ($validator->fails()) {
            // Log::info('Validation errors:', $validator->errors()->all());
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $contactInfo = $request->input('contactInfo');
        $isEmail = filter_var($contactInfo, FILTER_VALIDATE_EMAIL);

        $avatarPath = null;
        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
        }

        $dateOfBirth = Carbon::parse($request->date_of_birth)->format('Y-m-d');

        $user = User::create([
            'first_name' => $request->firstName,
            'sur_name' => $request->surName,
            $isEmail ? 'email' : 'mobile' => $contactInfo,
            'password' => Hash::make($request->password),
            'date_of_birth' => $dateOfBirth,
            'gender' => $request->gender,
            'avatar' => $avatarPath,
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect()->route('dashboard')->with('success', 'User registered successfully!');
    }
}
