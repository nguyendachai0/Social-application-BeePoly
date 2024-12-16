import { usePage } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';
import UserAvatar from '../UserAvatar';
import GroupAvatar from '../GroupAvatar'; // Ensure this import is correct
import MessageInput from '../messages/MessageInput';
import './chatLayout.scss';
import { useEventBus } from '@/EventBus';
import MessageAttachments from '../messages/MessageAttachments';
import AttachmentPreviewModal from '../messages/AttachmentPreviewModal';
import { FaPhone, FaVideo, FaTimes, FaMinus } from 'react-icons/fa';
import { formatMessageDateShort } from '@/helpers';


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
    return <div className="flex justify-center items-center h-full">Loading</div>;
  }

  return  (
    
    <div className="fixed bottom-4 right-4 w-96 bg-white/95 backdrop-blur-lg rounded-lg shadow-2xl z-50 border border-purple-200">
                <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                <div className="flex items-center space-x-3">
                {selectedConversation.is_user && <UserAvatar user={selectedConversation} />}
      {selectedConversation.is_group && <GroupAvatar group={selectedConversation} />}
      <div className="flex-1">
        {selectedConversation.is_group ? selectedConversation.name : selectedConversation.first_name}
      </div>
      </div>
      <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                      <FaPhone className="text-lg" />
                    </button>
                    <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                      <FaVideo className="text-lg" />
                    </button>
                    <button
                      onClick={onHide} 
                      className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <FaMinus className="text-lg" />
                    </button>
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <FaTimes className="text-lg" />
                    </button>
                  </div>
    </div>
    <div ref={messagesCtrRef}  className="h-96 overflow-y-auto p-4 space-y-4">
      {localMessages.map((message, index) => (
        <div key={index} className={`flex ${message.sender_id === currentUser.id ? 'justify-end' : 'justify-start'} gap-3`}>
        {message.sender_id !== currentUser.id && <UserAvatar user={message.sender} />}  
          <div className={`max-w-[70%] p-3 rounded-lg relative ${message.sender_id === currentUser.id 
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white after:content-[''] after:absolute after:border-8 after:border-pink-600 after:border-t-transparent after:border-r-transparent after:right-0 after:top-[50%] after:translate-x-[100%] after:-translate-y-[50%]" 
                : "bg-gray-100 text-gray-800 after:content-[''] after:absolute after:border-8 after:border-gray-100 after:border-t-transparent after:border-l-transparent after:left-0 after:top-[50%] after:-translate-x-[100%] after:-translate-y-[50%]"}`}>
                  <p>{message.message}</p>
          <MessageAttachments
                  attachments={message.attachments}
                  attachmentClick={onAttachmentClick}/>
                  <span className="text-xs mt-1 block opacity-70">{formatMessageDateShort(message.created_at)}</span>
          </div>
          {message.sender_id === currentUser.id && <UserAvatar user={message.sender} />} 
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
