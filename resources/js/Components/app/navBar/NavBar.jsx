import { useCallback, useEffect, useRef, useState } from "react";
import "./navBar.scss";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import TextInput from "@/Components/TextInput";
import { Link, usePage } from "@inertiajs/react";
import { formatMessageDateShort } from "@/helpers";
import ChatLayout from "../chatLayout/ChatLayout";
import { useEventBus } from "@/EventBus";
import UserAvatar from "../UserAvatar";
import GroupAvatar from "../GroupAvatar";
import Dropdown from '@/Components/Dropdown';

    const Navbar = () => {
        const [isChatVisible, setIsChatVisible] = useState(false);
        const [selectedConversation, setSelectedConversation] = useState([]);
        const page  =  usePage();
        const user = page.props.auth.user;
        const conversations = page.props.conversations;
        const [localConversations, setLocalConversations] = useState([]);
        const [localMessages, setLocalMessages]  = useState([]);
        const conversationMenu = document.getElementById("conversationMenu");
        const [hiddenConversations, setHiddenConversations] = useState({});
        
        const {emit, on} = useEventBus();
       
        const handleConversationClick = (newConversation) => {
            setSelectedConversation((prevSelected) => { 
                const isExisting = prevSelected.some(conv => conv.id === newConversation.id);
                if (isExisting) {
                    return prevSelected;
                }        
                const updated = [...prevSelected, newConversation];
                setIsChatVisible(true);
                conversationMenu.removeAttribute("open");
                return updated;
              });
          
        }
        const messageCreated = (message) => {
            setLocalConversations((oldUsers) => {
                return oldUsers.map((u) => {
                    if(
                        message.receiver_id &&
                        !u.is_group &&
                        (u.id ==  message.sender_id || u.id == message.receiver_id)){
                            u.last_message = message.message;
                            u.last_message_date = message.created_at;
                            return u;
                        }

                    if(message.group_id && 
                        u.is_group &&
                        u.id ==  message.group_id
                    ){
                        u.last_message = message.message;
                        u.last_message_date = message.created_at;
                        return u;
                    }
                    return u;
                        
                })

            })
        }

        
        
        const [sortedConversations, setSortedConversations] = useState([]);
        const onSearch = (ev) => {
            const search = ev.target.value.toLowerCase();
            setLocalConversations(conversations.filter((conversation) => {
                return conversation.name.toLowerCase().includes(search);
            })
        );
        };
       const handleChatClose = (conversationId) => {
        setSelectedConversation((prevSelected) => {
                const updated = prevSelected.filter(conv => conv.id!== conversationId);
                return updated;
            });
        };
       
        const  handleChatHide = (conversationId) => {
            setHiddenConversations((prev) => ({
                ...prev,
                [conversationId]: !prev[conversationId],
            }))
        }
        
        useEffect(() => {
            setSortedConversations(
                localConversations.sort((a, b) => {
                    if(a.blocked_at && b.blocked_at){
                        return a.blocked_at > b.blocked_at ? 1 : -1;
                    }else if  (a.blocked_at){
                        return 1; 
                    }else  if (b.blocked_at){
                        return -1;
                    }
                    if(a.last_message_date && b.last_message_date){
                        return b.last_message_date.localeCompare(
                            a.last_message_date
                        );
                    }else if (a.last_message_date){
                        return -1;
                    }else if (b.last_message_date){
                        return 1;
                    }else {
                        return 0;
                    }
                })
            );
        }, [localConversations]);
    
        useEffect(() => {
            setLocalConversations(conversations);   
        }, [conversations]);

        useEffect(() => {
        }, [sortedConversations])
    
    

        useEffect(() => {
          const offCreated = on('message.created', messageCreated);
          return () => {
              offCreated();
          }

      }, [selectedConversation])  
    
    const subscribedChannels = useRef(new Set());

    useEffect(() => {
        selectedConversation.forEach((conversation) => {
            let channel = `message.group.${conversation.id}`;
            if (conversation.is_user) {
                channel = `message.user.${[
                    parseInt(user.id),
                    parseInt(conversation.id),
                ]
                    .sort((a, b) => a - b)
                    .join("-")}`;
            }
    
            if (!subscribedChannels.current.has(channel)) {
                subscribedChannels.current.add(channel);
    
                Echo.private(channel)
                    .error((error) => {
                        console.error(`Error subscribing to ${channel}:`, error);
                    })
                    .listen("SocketMessage", (e) => {
                        const message = e.message;
                        emit("message.created", message);
    
                        if (message.sender_id !== user.id) {
                            emit("newMessageNotification", {
                                user: message.sender,
                                group_id: message.group_id,
                                message: message.message || `Shared ${
                                    message.attachments.length === 1
                                        ? "an attachment"
                                        : `${message.attachments.length} attachments`
                                }`,
                            });
                        }
                    });
            }
        });

        Echo.private(`user-connected.${user.id}`)
            .error((error) => {
                console.error('Error subscribing to user-connected channel:', error);
            })
            .listen('UserConnected', (event) => {
                const channel = event.channelName;
                if (!subscribedChannels.current.has(channel)) {
                    subscribedChannels.current.add(channel);
    
                    Echo.private(channel)
                        .error((error) => {
                            console.error(`Error subscribing to ${channel}:`, error);
                        })
                        .listen("SocketMessage", (e) => {
                            const message = e.message;
                            emit("message.created", message);
    
                            if (message.sender_id !== user.id) {
                                emit("newMessageNotification", {
                                    user: message.sender,
                                    group_id: message.group_id,
                                    message: message.message || `Shared ${
                                        message.attachments.length === 1
                                            ? "an attachment"
                                            : `${message.attachments.length} attachments`
                                    }`,
                                });
                            }
                        });
                }
            });
       
    }, [selectedConversation, user.id]);
    
    useEffect(() => {
        const friendRequestChannel = `friend-request.user.${user.id}`;
    
        Echo.private(friendRequestChannel)
            .error((error) => {
                console.error(`Error subscribing to ${friendRequestChannel}:`, error);
            })
            .listen("FriendRequestSent", (event) => {
                const senderId = event.senderId;
                emit("friendRequestReceived", { senderId });
            });
    
        return () => {
            Echo.leave(friendRequestChannel);
        };
    }, [user.id]);
      
    return (
<div className="navbar bg-base-100">
  <div className="flex-1">
  <div>
            <Link href={route('dashboard')} className="btn btn-ghost text-xl">
                FootNote
            </Link>
        </div>
            <div className="form-control">
      <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
    </div>
  </div>
  <div className="flex-1">
    <ul className="menu menu-horizontal px-1">
      <li><a><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
</svg>
</a></li>
<li><a><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
</svg>
</a></li>
<li><a><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
</svg>
</a></li>
<li><a><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
</svg>
</a></li>
    </ul>
  </div>
  <div className="flex-none gap-2">
  <ul className="menu menu-horizontal px-1">
    <li><a>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
</svg>

        </a></li>
        <li>


                            <details className="dropdown dropdown-end" id="conversationMenu">
   <summary>                   
                   <svg  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
</svg>
                    </summary>
  <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-auto p-2">
  <div className="flex items-center justify-between py-2 px-3 text-xl font-medium">
            My Conversations
            <div className="tooltip tooltip-left" data-tip="Create" new="">
                <button className="text-gray-400 hover:text-gray-200">
                    <PencilSquareIcon className="w-4 h-4 inline-block ml-2"/>
                </button>
            </div>
    </div>
        <div className="p-3">
            <TextInput onKeyUp={onSearch} placeholder="Filter users and groups" className="w-full"/>
        </div>
        <div className="h-80 overflow-y-auto">

        {sortedConversations && sortedConversations.map((conversation) => (
            <div className="flex gap-3 mb-3" key={`${
                conversation.is_group ? "group_" : "user_"
            }${conversation.id}`} onClick={() => handleConversationClick(conversation)}>
                    <div className="avatar online placeholder">
                    <div className="bg-neutral text-neutral-content w-12 rounded-full">
                      <span className="text-xl">
                      {conversation.is_user ? conversation.first_name.substring(0, 1) : conversation.name.substring(0, 1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 justify-between items-start">
                    <h3 className="text-sm font-semibold">
                        {conversation.is_user ? conversation.first_name : conversation.name}
                    </h3>
                    <div className="flex gap-1">
                    {conversation.last_message &&  (
                        <p className="text-xs text-nowrap overflow-hidden text-ellipsis">
                            {conversation.last_message.substring(0,20) +'...'}
                        </p>
                    )}
                    {conversation.last_message_date  && (
                        <span className="text-nowrap italic">
                            {formatMessageDateShort(conversation.last_message_date)}
                        </span>
                    )}
                    </div>
                
                </div>

            </div>
                  

            ))}
            </div>
  </ul>
                    
</details>
</li>
        <li><a>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
</svg>
</a></li>
<div className="hidden sm:flex sm:items-center sm:ms-6">
                            <div className="ms-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {user.first_name + ' ' + user.last_name}

                                                <svg
                                                    className="ms-2 -me-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

    </ul>
  </div>
  {
  isChatVisible && selectedConversation && (
    <>
        <div className="flex w-300 h-98 fixed bottom-0 right-12">
       { selectedConversation.map((conversation) => {
        const isHidden = hiddenConversations[conversation.id];
            return !isHidden && (
                <ChatLayout
                key={conversation.id}
                conversation={conversation}
                isHidden={isHidden}
                onClose={() => handleChatClose(conversation.id)}
                onHide={() => handleChatHide(conversation.id)}
                />
            );
        })};
        </div>

        <div className="fixed bottom-0 right-2 flex flex-col items end">
            {selectedConversation.map((conversation) => {
                const isHidden =  hiddenConversations[conversation.id];
                return isHidden && (
                    <div 
                    key={conversation.id}
                    className="mb-2 cursor-pointer"
                    onClick={() => handleChatHide(conversation.id)}>
                {conversation.is_user  && <UserAvatar user={conversation} profile={true} className="mr-2"/>}
                {conversation.is_group  && <GroupAvatar group={conversation} size={40} className="mr-2"/>}
                </div>
                )
            })}
        </div>
        </>
      )}
</div>


    );
  
    }

export default Navbar;
