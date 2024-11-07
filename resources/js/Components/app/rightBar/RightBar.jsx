import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import { FaHome, FaUser, FaEnvelope, FaBell, FaCog, FaUsers, FaCalendar, FaCompass, FaMoon, FaSun, FaHeart, FaComment, FaShare, FaEdit, FaEllipsisH, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import UserAvatar from "../UserAvatar";
import { useDarkMode } from "@/Context/DarkModeContext";
import { IoMdSend } from "react-icons/io";

const RightBar = () => {
    const [userInput, setUserInput] = useState("");
    const [chatMessages, setChatMessages] = useState([]);

    const {darkMode} = useDarkMode();
    const page = usePage();
    const [onlineUsers, setOnlineUsers] = useState([]);
    const isUserOnline = (userId) => !!onlineUsers[userId];
    const  friends = page.props.friends;

    const getOnlineFriends = () => {
        const onlineUserIds = Object.keys(onlineUsers);
        return friends.filter(friend => 
            onlineUserIds.includes(friend.id.toString())
        );

    }

    const handleUserInput = (e) => {
        setUserInput(e.target.value);
      };
    
      const handleSendMessage = () => {
        if (userInput.trim() !== "") {
          setChatMessages([...chatMessages, { type: "user", content: userInput }]);
          setUserInput("");
          // Simulate AI response
          setTimeout(() => {
            setChatMessages([...chatMessages, { type: "user", content: userInput }, { type: "ai", content: "Thank you for your message. How can I assist you today?" }]);
          }, 1000);
        }
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
            
            <aside className="w-1/5 ml-8 hidden lg:block">
          <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md p-4 mb-8`}>
            <h2 className="text-xl font-semibold mb-4">Who's Online</h2>
            <ul className="space-y-4">
              {onlineFriends.map((friend) => (
                <li key={friend.id} className="flex items-center space-x-2">
                  <div className="relative">
                    <UserAvatar user={friend}/>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                  </div>
                  <span>{friend.first_name} {friend.sur_name}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md p-4`}>
            <h2 className="text-xl font-semibold mb-4">AI Assistant</h2>
            <div className="h-64 overflow-y-auto mb-4 border rounded p-2">
              {chatMessages.map((message, index) => (
                <div key={index} className={`mb-2 ${message.type === "user" ? "text-right" : "text-left"}`}>
                  <span className={`inline-block p-2 rounded-lg ${message.type === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                    {message.content}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                value={userInput}
                onChange={handleUserInput}
                placeholder="Type your message..."
                className="flex-grow px-3 py-2 rounded-l-lg border-t border-b border-l focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              >
                <IoMdSend />
              </button>
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Connect with us</h2>
            <div className="flex justify-center space-x-4">
              <a href="#" className="text-blue-600 hover:text-blue-700 transition duration-300"><FaFacebookF /></a>
              <a href="#" className="text-blue-400 hover:text-blue-500 transition duration-300"><FaTwitter /></a>
              <a href="#" className="text-pink-600 hover:text-pink-700 transition duration-300"><FaInstagram /></a>
              <a href="#" className="text-blue-700 hover:text-blue-800 transition duration-300"><FaLinkedinIn /></a>
            </div>
          </div>
        </aside>
        </>

    );
};

export default RightBar;