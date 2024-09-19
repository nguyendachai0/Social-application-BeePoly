<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMessageRequest;
use App\Http\Resources\MessageResource;
use App\Models\Group;
use App\Models\Message;
use App\Models\User;
use App\Services\Messages\MessageServiceInterface;
use Illuminate\Support\Facades\Log;

class MessageController extends Controller
{
    protected $messageService;
    public function __construct(MessageServiceInterface $messageService)
    {
        $this->messageService = $messageService;
    }
    public function byUser(User $user)
    {
        $messages = $this->messageService->getMessagesByUser($user->id, auth()->id());
        return   [
            'selectedConversation' => $user->toConversationArray(),
            'messages'  => MessageResource::collection($messages)
        ];
    }

    public function byGroup(Group $group)
    {
        $messages = $this->messageService->getMessagesByGroup($group->id);
        return [
            'selectedConversation' => $group->toConversationArray(),
            'messages' => MessageResource::collection($messages),
        ];
    }

    public function loadOlder(Message $message)
    {
        $messages = $this->messageService->loadOlderMessages($message);
        return MessageResource::collection($messages);
    }

    public function store(StoreMessageRequest $request)
    {
        $data = $request->validated();
        $files = $request->attachments ?? [];
        $message = $this->messageService->storeMessage($data, $files);
        return new MessageResource($message);
    }

    public function destroy(Message $message)
    {
        if ($this->messageService->deleteMessage($message)) {
            return response('', 204);
        }
        return response()->json(['message' => 'Forbidden'], 403);
    }
}
