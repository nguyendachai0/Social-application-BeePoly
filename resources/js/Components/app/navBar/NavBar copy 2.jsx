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
import { FaUser, FaEnvelope, FaBell, FaSearch, FaCamera, FaEdit, FaHeart, FaComment, FaShare, FaSmile, FaPaperclip, FaPaperPlane, FaTimes, FaVideo, FaFile, FaPhone, FaChevronDown } from "react-icons/fa";
import { GiBee } from "react-icons/gi";
import { formatDistanceToNow, parseISO } from 'date-fns';

    const Navbar = () => {
        const page  =  usePage();
        const user = page.props.auth.user;
        const conversations = page.props.conversations;
        console.log('conversations', conversations);
        const [selectedChat, setSelectedChat] = useState(null);
        const [message, setMessage] = useState("");
        const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "like",
      user: "John Doe",
      content: "liked your post",
      time: "2 minutes ago",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
      read: false
    },
    {
      id: 2,
      type: "comment",
      user: "Jane Smith",
      content: "commented on your photo",
      time: "5 minutes ago",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      read: false
    },
    {
      id: 3,
      type: "friend",
      user: "Mike Johnson",
      content: "sent you a friend request",
      time: "10 minutes ago",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
      read: true
    }
  ]);
        const [isChatVisible, setIsChatVisible] = useState(false);
        const [selectedConversation, setSelectedConversation] = useState([]);
        const [localConversations, setLocalConversations] = useState([]);
        const [localMessages, setLocalMessages]  = useState([]);
        const conversationMenu = document.getElementById("conversationMenu");
        const [hiddenConversations, setHiddenConversations] = useState({});

        const NavigationBar = ({conversations, notifications, setNotifications }) => {
            const [isMenuOpen, setIsMenuOpen] = useState(false);
            const [searchQuery, setSearchQuery] = useState("");
            const [showMessenger, setShowMessenger] = useState(false);
            const [showNotifications, setShowNotifications] = useState(false);
            const [selectedChat, setSelectedChat] = useState(null);
          
            const unreadNotifications = notifications.filter(notif => !notif.read).length;
          
            const markAllAsRead = () => {
              setNotifications(notifications.map(notif => ({ ...notif, read: true })));
            };
          
            const markAsRead = (id) => {
              setNotifications(notifications.map(notif =>
                notif.id === id ? { ...notif, read: true } : notif
              ));
            };
          
            // const conversations = [
            //   {
            //     id: 1,
            //     name: "John Doe",
            //     avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
            //     lastMessage: "Hey, how are you?",
            //     timestamp: "10:00 AM",
            //     unread: 2,
            //     online: true,
            //     messages: [
            //       { id: 1, text: "Hey, how are you?", sender: "them", time: "10:00 AM" },
            //       { id: 2, text: "I'm good, thanks!", sender: "me", time: "10:01 AM" }
            //     ]
            //   },
            //   {
            //     id: 2,
            //     name: "Jane Smith",
            //     avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
            //     lastMessage: "Let's catch up soon!",
            //     timestamp: "9:45 AM",
            //     unread: 0,
            //     online: false,
            //     messages: [
            //       { id: 1, text: "Let's catch up soon!", sender: "them", time: "9:45 AM" }
            //     ]
            //   }
            // ];
          
            const getNotificationIcon = (type) => {
              switch(type) {
                case "like": return <FaHeart className="text-red-500" />;
                case "comment": return <FaComment className="text-blue-500" />;
                case "friend": return <FaUser className="text-green-500" />;
                default: return <FaBell className="text-yellow-500" />;
              }
            };
          
            return (
              <nav className="sticky top-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 shadow-lg z-50">
                <div className="max-w-7xl mx-auto px-4">
                  <div className="flex justify-between items-center h-20">
                    <div className="flex items-center">
                      <div className="flex items-center space-x-2">
                        <GiBee className="text-4xl text-white" />
                        <span className="text-2xl font-bold text-white">Bee Poly</span>
                      </div>
                      <div className="hidden md:flex items-center ml-6 space-x-4">
                        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                      </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                      <NavLink icon={<GiBee className="text-xl" />} text="Home" />
                      <NavLink icon={<FaUser className="text-xl" />} text="Profile" />
                      <div className="relative">
                        <button 
                          onClick={() => setShowMessenger(!showMessenger)}
                          className="flex items-center space-x-2 text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                        >
                          <FaEnvelope className="text-xl" />
                          <FaChevronDown className="text-sm" />
                        </button>
                        {showMessenger && (
                          <div className="absolute right-0 mt-2 w-96 bg-white/95 backdrop-blur-lg rounded-lg shadow-xl overflow-hidden z-50 border border-purple-200">
                            <div className="p-4 border-b border-purple-100">
                              <h3 className="text-lg font-semibold text-gray-800">Messages</h3>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                              {conversations.map((conversation) => (
                                <div
                                key={`${
                                    conversation.is_group ? "group_" : "user_"
                                }${conversation.id}`}
                                  className="p-3 hover:bg-purple-50 cursor-pointer border-b border-purple-100"
                                  onClick={() => setSelectedChat(conversation)}
                                >
                                  <div className="flex items-center space-x-3">
                                  {conversation.is_user  && <UserAvatar user={conversation} online={true} />}
                                  {conversation.is_group  && <GroupAvatar group={conversation} size={40} className="mr-2"/>}
                                    <div className="flex-1">
                                      <div className="flex justify-between items-center">
                                        <h4 className="font-semibold text-gray-800">{conversation.name}</h4>
                                        <span className="text-xs text-gray-500">{formatMessageDateShort(conversation.last_message_date)}</span>
                                      </div>
                                      <p className="text-sm text-gray-600 truncate">{conversation.last_message}</p>
                                    </div>
                                    {conversation.unread > 0 && (
                                      <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full px-2 py-1 text-xs">
                                        {conversation.unread}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => setShowNotifications(!showNotifications)}
                          className="flex items-center space-x-2 text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                        >
                          <div className="relative">
                            <FaBell className="text-xl" />
                            {unreadNotifications > 0 && (
                              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {unreadNotifications}
                              </span>
                            )}
                          </div>
                        </button>
                        {showNotifications && (
                          <div className="absolute right-0 mt-2 w-96 bg-white/95 backdrop-blur-lg rounded-lg shadow-xl overflow-hidden z-50 border border-purple-200">
                            <div className="p-4 border-b border-purple-100 flex justify-between items-center">
                              <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                              <button
                                onClick={markAllAsRead}
                                className="text-sm text-purple-600 hover:text-purple-800"
                              >
                                Mark all as read
                              </button>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                              {notifications.map((notification) => (
                                <div
                                  key={notification.id}
                                  className={`p-4 border-b border-purple-100 hover:bg-purple-50 ${!notification.read ? "bg-purple-50" : ""}`}
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="relative">
                                      <img
                                        src={notification.avatar}
                                        alt={notification.user}
                                        className="w-12 h-12 rounded-full"
                                      />
                                      <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full">
                                        {getNotificationIcon(notification.type)}
                                      </div>
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm text-gray-800">
                                        <span className="font-semibold">{notification.user}</span>{" "}
                                        {notification.content}
                                      </p>
                                      <span className="text-xs text-gray-500">{notification.time}</span>
                                    </div>
                                    {!notification.read && (
                                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      className="md:hidden text-white"
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                      </svg>
                    </button>
                  </div>
                  {isMenuOpen && <MobileMenu notifications={notifications} />}
                </div>
                {selectedChat && (
                  <ChatWindow
                    chat={selectedConversation}
                    onClose={() => setSelectedChat(null)}
                  />
                )}
              </nav>
            );
          };
          
          const ChatWindow = ({ chat, onClose }) => {
            console.log('chat', chat)
            const [message, setMessage] = useState("");
            const messagesEndRef = useRef(null);
          
            const scrollToBottom = () => {
              messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            };
          
            useEffect(() => {
              scrollToBottom();
            }, [chat.messages]);
          
            const handleSendMessage = (e) => {
              e.preventDefault();
              if (message.trim()) {
                setMessage("");
              }
            };
          
            return (
              <div className="fixed bottom-4 right-4 w-96 bg-white/95 backdrop-blur-lg rounded-lg shadow-2xl z-50 border border-purple-200">
                <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                  <div className="flex items-center space-x-3">
                    <img src={chat.avatar} alt={chat.name} className="w-10 h-10 rounded-full border-2 border-white" />
                    <div>
                      <h3 className="font-semibold">{chat.name}</h3>
                      <span className="text-sm text-white/80">{chat.online ? "Online" : "Offline"}</span>
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
                      onClick={onClose}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <FaTimes className="text-lg" />
                    </button>
                  </div>
                </div>
                <div className="h-96 overflow-y-auto p-4 space-y-4">
                  {chat.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          msg.sender === "me"
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p>{msg.text}</p>
                        <span className="text-xs mt-1 block opacity-70">{msg.time}</span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="p-4 border-t border-purple-100">
                  <div className="flex items-center space-x-2">
                    <button type="button" className="p-2 text-gray-500 hover:text-purple-600 transition-colors">
                      <FaSmile className="text-xl" />
                    </button>
                    <button type="button" className="p-2 text-gray-500 hover:text-purple-600 transition-colors">
                      <FaPaperclip className="text-xl" />
                    </button>
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 p-2 border border-purple-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/50"
                    />
                    <button
                      type="submit"
                      className="p-2 text-purple-600 hover:text-purple-800 transition-colors disabled:opacity-50"
                      disabled={!message.trim()}
                    >
                      <FaPaperPlane className="text-xl" />
                    </button>
                  </div>
                </form>
              </div>
            );
          };
          
          const NavLink = ({ icon, text }) => (
            <button className="flex items-center space-x-2 text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              {icon}
              <span className="font-medium">{text}</span>
            </button>
          );
          
          const SearchBar = ({ searchQuery, setSearchQuery }) => (
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-72 px-5 py-3 rounded-full bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/70 backdrop-blur-sm"
              />
              <FaSearch className="absolute right-4 top-3.5 text-white/70" />
            </div>
          );
          
          const MobileMenu = ({ notifications }) => {
            const unreadNotifications = notifications.filter(notif => !notif.read).length;
          
            return (
              <div className="md:hidden py-4 space-y-4 bg-gradient-to-b from-purple-600 to-pink-600 rounded-b-lg">
                <div className="px-4">
                  <SearchBar />
                </div>
                <div className="flex flex-col space-y-2 px-4">
                  <NavLink icon={<GiBee className="text-xl" />} text="Home" />
                  <NavLink icon={<FaUser className="text-xl" />} text="Profile" />
                  <div className="relative">
                    <NavLink
                      icon={
                        <div className="relative">
                          <FaBell className="text-xl" />
                          {unreadNotifications > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {unreadNotifications}
                            </span>
                          )}
                        </div>
                      }
                      text="Notifications"
                    />
                  </div>
                </div>
              </div>
            );
          };
        
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
            console.log('localConversation', localConversations)
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
            })
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
<div className="bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <NavigationBar conversations={conversations} notifications={notifications} setNotifications={setNotifications} />
    </div>
    );

    
  
    }

export default Navbar;
