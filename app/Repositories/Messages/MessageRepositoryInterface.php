<?php

namespace App\Repositories\Messages;

use App\Models\Message;

interface  MessageRepositoryInterface
{
    public function getMessagesByUser($userId, $authId);
    public function getMessagesByGroup($groupId);
    public function loadOlderMessages(Message $message);
    public function storeMessage($data);
    public function deleteMessage(Message $message);
}
