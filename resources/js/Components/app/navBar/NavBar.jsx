import {  useEffect, useRef, useState } from "react";
import "./navBar.scss";
import { Link, usePage } from "@inertiajs/react";
import { formatMessageDateShort } from "@/helpers";
import ChatLayout from "../chatLayout/ChatLayout";
import { useEventBus } from "@/EventBus";
import UserAvatar from "../UserAvatar";
import GroupAvatar from "../GroupAvatar";
import { GiBee } from "react-icons/gi";
import { FaUser, FaEnvelope, FaBell, FaSearch, FaHeart, FaComment, FaChevronDown } from "react-icons/fa";



    const Navbar = () => {
        const [isChatVisible, setIsChatVisible] = useState(false);
        const [isMenuOpen, setIsMenuOpen] = useState(false);
        const [selectedConversation, setSelectedConversation] = useState([]);
        const page  =  usePage();
        const user = page.props.auth.user;
        const conversations = page.props.conversations;
        const [localConversations, setLocalConversations] = useState([]);
        const [localMessages, setLocalMessages]  = useState([]);
        const conversationMenu = document.getElementById("conversationMenu");
        const [hiddenConversations, setHiddenConversations] = useState({});
        const [searchQuery, setSearchQuery] = useState("");
        const [notifications, setNotifications] = useState(page.props.notifications);
        console.log('notifcations', notifications);
        notifications.map((notification) => ( 
          console.log(
            'noti',notification.content)
        ))
          const markAllAsRead = () => {
            setNotifications(notifications.map(notif => ({ ...notif, read: true })));
          };
        
          const markAsRead = (id) => {
            setNotifications(notifications.map(notif =>
              notif.id === id ? { ...notif, read: true } : notif
            ));
          };

          const getNotificationIcon = (type) => {
            switch(type) {
              case "like": return <FaHeart className="text-red-500" />;
              case "comment": return <FaComment className="text-blue-500" />;
              case "friend": return <FaUser className="text-green-500" />;
              default: return <FaBell className="text-yellow-500" />;
            }
          };
        const unreadNotifications = notifications.filter(notif => !notif.read).length;
        const [showNotifications, setShowNotifications] = useState(false);
        


        const {emit, on} = useEventBus();

        const NavLink = ({ icon, text }) => (
            <button className="flex items-center space-x-2 text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              {icon}
              <span className="font-medium">{text}</span>
            </button>
          );
       
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
                      <details className="dropdown dropdown-end" id="conversationMenu">
   <summary className="flex items-center space-x-2 text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105">                   
   <FaEnvelope className="text-xl" />
   <FaChevronDown className="text-sm" />
                    </summary>
                    <div className="absolute right-0 mt-2 w-96 bg-white/95 backdrop-blur-lg rounded-lg shadow-xl overflow-hidden z-50 border border-purple-200">
                    <div className="p-4 border-b border-purple-100">
                        <h3 className="text-lg font-semibold text-gray-800">Messages</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
        {sortedConversations && sortedConversations.map((conversation) => (
             <div
             key={`${
                 conversation.is_group ? "group_" : "user_"
             }${conversation.id}`}
               className="p-3 hover:bg-purple-50 cursor-pointer border-b border-purple-100"
               onClick={() => handleConversationClick(conversation)}
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
                    
</details>
                      <div className="relative">
                        <button
                          onClick={() => setShowNotifications(!showNotifications)}
                          className="flex items-center space-x-2 text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                        >
                          <div className="relative">
                            <FaBell className="text-xl" />
                            {/* {unreadNotifications > 0 && (
                              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {unreadNotifications}
                              </span>
                            )} */}
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
                                      <UserAvatar user={notification.user} />
                                      <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full">
                                        {getNotificationIcon(notification.type)}
                                      </div>
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm text-gray-800">
                                        <span className="font-semibold">{notification.user.first_name} {notification.user.sur_name}</span>{" "}
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
                {
  isChatVisible && selectedConversation && (
    <>
        <div className="flex w-300 h-98 fixed bottom-0 right-12 z-[1]">
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
            )
        })}
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
              </nav>
    );
  
    }

export default Navbar;
