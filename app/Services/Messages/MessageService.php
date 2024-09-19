<?php

namespace App\Services\Messages;

use App\Events\SocketMessage;
use App\Models\Attachment;
use App\Models\Conversation;
use App\Models\Group;
use App\Models\Message;
use App\Repositories\Messages\MessageRepositoryInterface;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;


class MessageService implements MessageServiceInterface
{
    protected $messageRepository;
    public function __construct(MessageRepositoryInterface $messageRepository)
    {
        $this->messageRepository = $messageRepository;
    }
    public function getMessagesByUser($userId, $authId)
    {
        return $this->messageRepository->getMessagesByUser($userId, $authId);
    }
    public function getMessagesByGroup($groupId)
    {
        return $this->messageRepository->getMessagesByGroup($groupId);
    }
    public  function loadOlderMessages(Message $message)
    {
        return $this->messageRepository->loadOlderMessages($message);
    }
    public function storeMessage($data, $files)
    {
        $data['sender_id'] = auth()->id();
        $message = $this->messageRepository->storeMessage($data);
        $attachments = [];
        if ($files) {
            foreach ($files as $file) {
                $directory = 'attachments/' . Str::random(32);
                Storage::makeDirectory($directory);

                $model = [
                    'message_id' => $message->id,
                    'name' => $file->getClientOriginalName(),
                    'mime' => $file->getClientMimeType(),
                    'size' => $file->getSize(),
                    'path' => $file->store($directory, 'public'),
                ];
                $attachment = Attachment::create($model);
                $attachments[] = $attachment;
            }
            $message->attachments = $attachments;
        }

        if (isset($data['receiver_id'])) {
            Conversation::updateConversationWithMessage($data['receiver_id'], auth()->id(), $message);
        }

        if (isset($data['group_id'])) {
            Group::updateGroupWithMessage($data['group_id'], $message);
        }

        SocketMessage::dispatch($message);
        return $message;
    }

    public function deleteMessage(Message $message)
    {
        if ($message->sender_id === auth()->id()) {
            return $this->messageRepository->deleteMessage($message);
        }
        return  false;
    }
}
