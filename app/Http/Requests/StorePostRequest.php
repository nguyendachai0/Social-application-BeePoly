<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'caption' => 'nullable|string|required_without:attachments',
            'attachments' => 'nullable|array|max:10|required_without:caption',
            'attachments.*' => 'file|max:1024000|mimes:jpg,jpeg,png,pdf,docx,mp4,mov,avi',
            'fanpage_id' => 'nullable|exists:fanpages,id',
        ];
    }

    public function messages()
    {
        return [
            'caption.required_without' => 'Your post is empty',
            'attachments.required_without' => 'You must provide attachments or a caption.',
            'attachments.*.mimes' => 'Each attachment must be one of the following types: jpg, jpeg, png, pdf, docx, mp4, mov, avi.',
            'fanpage_id.exists' => 'The selected fanpage does not exist.',
        ];
    }
}
