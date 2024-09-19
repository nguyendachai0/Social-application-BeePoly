import { usePage } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';
import UserAvatar from '../UserAvatar';
import GroupAvatar from '../GroupAvatar'; // Ensure this import is correct
import MessageInput from '../messages/MessageInput';
import './chatLayout.scss';
import { useEventBus } from '@/EventBus';
import MessageAttachments from '../messages/MessageAttachments';
import AttachmentPreviewModal from '../messages/AttachmentPreviewModal';


const ChatLayout = ({ conversation, newMessage = null, onClose = () => {}, onHide = () => {}, isHidden }) => {
  const page = usePage();
  const currentUser = page.props.auth.user;
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [localMessages, setLocalMessages]  = useState([]);
  const [scrollFromBottom, setScrollFromBottom] = useState(0);
  const {emit, on} = useEventBus();
  const messagesCtrRef = useRef(null);
  const [previewAttachment, setPreviewAttachment] = useState({});
  const [showAttachmentPreview, setShowAttachmentPreview] = useState(false);

  const onAttachmentClick = (attachments, ind) => {
    setPreviewAttachment({
        attachments,
        ind,
    });
    setShowAttachmentPreview(true);
}

  useEffect(() => {
    const fetchMessages = async () => {
      if (conversation) {
        const type = conversation.is_group ? 'group' : 'user';
        try {
          const response = await fetch(`/${type}/${conversation.id}`);
          const data = await response.json();
          console.log('data', data);
          if (data.selectedConversation) {
            setSelectedConversation(data.selectedConversation);
          } else {
            console.warn('No selectedConversation in the response');
          }
          setLocalMessages(data.messages || []);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      }
    };
    fetchMessages();
  }, [conversation]);


  const messageCreated = (message) => {
    if(selectedConversation && selectedConversation.is_group && selectedConversation.id  === message.group_id){
        setLocalMessages((prevMessages) =>
        {
          const updatedMessages = [...prevMessages, message];
          return updatedMessages;
        });
    }

    if(selectedConversation && selectedConversation.is_user && (selectedConversation.id === message.sender_id ||  selectedConversation.id == message.receiver_id))
    {
      setLocalMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, message];
        return updatedMessages;
      });
    }
}






  useEffect(() => {
    const offCreated = on('message.created', messageCreated);
    return () => {
      offCreated();
  }
  }, [selectedConversation]);

  useEffect(()  => {
    if (messagesCtrRef.current) {

      messagesCtrRef.current.scrollTop = messagesCtrRef.current.scrollHeight;

    }
   
  }, [localMessages]);

  if (!selectedConversation) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  return  (
    
    <div className="flex flex-col bg-white border border-gray-300 rounded-lg shadow-lg mx-2 px-1 pt-2 w-80 h-full">
    <div className="flex w-full justify-between gap-1 items-center mb-4">
      {selectedConversation.is_user && <UserAvatar user={selectedConversation} />}
      {selectedConversation.is_group && <GroupAvatar />}
      <div className="flex-1">
        {selectedConversation.is_group ? selectedConversation.name : selectedConversation.first_name}
      </div>
      <div className="flex justify-between">
        <div className="hover:bg-gray-200 rounded-full p-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
            <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="hover:bg-gray-200 rounded-full p-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
            <path d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z" />
          </svg>
        </div>
        <div  onClick={onHide} className="hover:bg-gray-200 rounded-full p-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path fillRule="evenodd" d="M4.25 12a.75.75 0 0 1 .75-.75h14a.75.75 0 0 1 0 1.5H5a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="hover:bg-gray-200 rounded-full p-2"  onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
    <div ref={messagesCtrRef}  className="h-72 overflow-y-auto mb-2">
      {localMessages.map((message, index) => (
        <div key={index} className={`chat ${message.sender_id === currentUser.id ? 'chat-end' : 'chat-start'}`}>
          <UserAvatar user={message.sender} />
          <div className={"chat-bubble chat-bubble-" + (message.sender_id === currentUser.id ? "info" : "secondary")}>{message.message}

          <MessageAttachments
                  attachments={message.attachments}
                  attachmentClick={onAttachmentClick}/>
          </div>
          <div className="chat-footer opacity-50">Delivered</div>
        </div>
      ))}
    </div>
    <MessageInput conversation={selectedConversation} />
    {previewAttachment.attachments && (
          <AttachmentPreviewModal
          attachments={previewAttachment.attachments}
          index={previewAttachment.ind}
          show={showAttachmentPreview}
          onClose={() => setShowAttachmentPreview(false)}
          />
        )}
  </div>

  )
}

export default ChatLayout;
