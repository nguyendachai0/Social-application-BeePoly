import { useEffect, useState, useRef } from "react";
import { usePage } from "@inertiajs/react";
import {  FaRobot, FaTimes, FaPaperPlane} from "react-icons/fa";
import UserAvatar from "../../../UI/client/UserAvatar";


const RightBar = () => {
  const csrfToken = usePage().props.csrfToken;
  const page = usePage();
  const  friends = page.props.friends;
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showAIChat, setShowAIChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you today?",
      sender: "ai",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const isUserOnline = (userId) => !!onlineUsers[userId];

  const getOnlineFriends = () => {
      const onlineUserIds = Object.keys(onlineUsers);
      return friends.filter(friend => 
          onlineUserIds.includes(friend.id.toString())
      );
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const userMessage = {
        id: chatMessages.length + 1,
        text: newMessage,
        sender: "user",
      };
      setChatMessages([...chatMessages, userMessage]);
      setNewMessage("");
      try {
        const response = await fetch("/api/ai-response", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken,
          },
          body: JSON.stringify({ message: newMessage }),
        });

        const data = await response.json();
        const aiResponse = {
          id: chatMessages.length + 2,
          text: data,
          sender: "ai",
        };
        setChatMessages((prevMessages) => [...prevMessages, aiResponse]);
      } catch (error) {
        console.error("Error fetching AI response:", error);
      }
      
    }
  };

      
    
     

    const AIChatAssistant = ({ onClose }) => {
      const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm your AI assistant. How can I help you today?", sender: "ai" }
      ]);
      const [newMessage, setNewMessage] = useState("");
      const messagesEndRef = useRef(null);
    
      const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      };
    
      useEffect(() => {
        scrollToBottom();
      }, [messages]);
    
    
      return (
        <div className="fixed bottom-20 right-4 w-96 bg-white rounded-lg shadow-2xl z-50 border border-purple-200 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <FaRobot className="text-2xl" />
              <h3 className="font-semibold">AI Assistant</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
          <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] p-3 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : "bg-white border border-purple-100"
                  }`}
                >
                  <p className={msg.sender === "ai" ? "text-gray-800" : ""}>{msg.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="p-4 border-t border-purple-100 bg-white">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-purple-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
                disabled={!newMessage.trim()}
              >
                <FaPaperPlane className="text-xl" />
              </button>
            </div>
          </form>
        </div>
      );
    };
    

    useEffect(() => {
        Echo.join("online")
        .here((users) => {
            const onlineUsersObj = Object.fromEntries(users.map(
                (user) =>  [user.id, user]
            ));
            setOnlineUsers((prevOnlineUsers) => {
                return {...prevOnlineUsers,  ...onlineUsersObj};
            });
        })
        .joining((user) => {
            setOnlineUsers((prevOnlineUsers) => {
                const  updatedUsers = {...prevOnlineUsers};
                updatedUsers[user.id] = user;
                return updatedUsers;
            })
        })
        .leaving((user) => {
            setOnlineUsers((prevOnlineUsers) => {
                const  updatedUsers = {...prevOnlineUsers};
                delete updatedUsers[user.id];
                return updatedUsers;
            })
        })
        .error((error) => {
            console.log("error", error);
        });
        
        return () => {
            Echo.leave('online');
        }
    }, []);

    useEffect(() =>  {
    }, [onlineUsers])

    const onlineFriends  = getOnlineFriends();
    return ( 
        <>
            
            <div className="col-span-3 fixed right-0">
          <div className="bg-white rounded-lg shadow-md w-72 mr-3 p-4 mt-4 mb-8">
            <h2 className="text-xl font-semibold mb-4">Who's Online</h2>
            <ul className="space-y-4">
              {onlineFriends.map((friend) => (
                <li key={friend.id} className="flex items-center space-x-2">
                  <div className="relative">
                    <UserAvatar  online={true} user={friend}/>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                  </div>
                  <span>{friend.first_name} {friend.sur_name}</span>
                </li>
              ))}
            </ul>
          </div>


          <button
        onClick={() => setShowAIChat(!showAIChat)}
        className="fixed bottom-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-lg hover:opacity-90 transition-opacity z-40"
      >
        <FaRobot className="text-2xl" />
      </button>

      {/* AI Chat Assistant */}
      {showAIChat && (
          <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-2xl z-50 border border-purple-200 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <FaRobot className="text-2xl" />
                <h3 className="font-semibold">AI Assistant</h3>
              </div>
              <button
                onClick={() => setShowAIChat(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            <div className="h-[24rem] overflow-y-auto p-4 space-y-4 bg-gray-50">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] p-3 rounded-lg ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        : "bg-white border border-purple-100"
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-purple-100 bg-white"
            >
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border border-purple-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
                  disabled={!newMessage.trim()}
                >
                  <FaPaperPlane className="text-xl" />
                </button>
              </div>
            </form>
          </div>
        )}
         
        </div>
        </>

    );

    
};

export default RightBar;