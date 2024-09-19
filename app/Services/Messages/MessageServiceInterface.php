<?php

namespace App\Services\Messages;

use App\Models\Message;

interface  MessageServiceInterface
{
    public function getMessagesByUser($userId, $authId);
    public function getMessagesByGroup($groupId);
    public function loadOlderMessages(Message $message);
    public function storeMessage($data, $files);
    public function deleteMessage(Message $message);
}
