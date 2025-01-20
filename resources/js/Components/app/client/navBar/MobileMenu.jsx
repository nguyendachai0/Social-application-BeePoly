import { FaUserFriends, FaUser, FaBell, FaEnvelope, } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import SearchBar from "./SeachBar";
import { GiBee } from "react-icons/gi";
import UserAvatar from "@/Components/UI/client/UserAvatar";
import GroupAvatar from "@/Components/UI/client/GroupAvatar";
import { formatMessageDateShort } from "@/helpers";


const MobileMenu = ({ notifications, markAllAsRead, handleLogout, getNotificationIcon, closeMenu, NavLink, user, sortedConversations, handleConversationClick }) => {
    const unreadNotifications = notifications.filter(notif => !notif.read).length;

    return (
        <div className="md:hidden py-4 space-y-4 bg-gradient-to-b from-purple-600 to-pink-600 rounded-b-lg  overflow-y-auto">
            <div className="px-4">
                <SearchBar searchQuery="" setSearchQuery={() => { }} />
            </div>
            <div className="flex flex-col space-y-2 px-4">
                <NavLink href="/" icon={<GiBee className="text-xl" />} text="Home" onClick={closeMenu} />
                <NavLink href={`${user.email}`} icon={<FaUser className="text-xl" />} text="Profile" onClick={closeMenu} />
                <NavLink href={route('friends.page')} icon={<FaUserFriends />} text="Friends" onClick={closeMenu} />
                {/* </div> */}
                <details className="dropdown dropdown-end" id="conversationMenu">
                    <summary className="flex items-center space-x-2 text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                        <FaEnvelope className="text-xl" />
                        <span className="font-medium">Messages</span>
                    </summary>
                    <div className="absolute left-0 top-10 mt-2 w-96 bg-white/95 backdrop-blur-lg rounded-lg shadow-xl overflow-hidden z-50 border border-purple-200">
                        <div className="max-h-96 -y-auto  overflow-y-auto">
                            {sortedConversations && sortedConversations.map((conversation) => (
                                <div
                                    key={`${conversation.is_group ? "group_" : "user_"
                                        }${conversation.id}`}
                                    className="p-3 hover:bg-purple-50 cursor-pointer border-b border-purple-100"
                                    onClick={() => {
                                        handleConversationClick(conversation);
                                        closeMenu();
                                    }
                                    }
                                >
                                    <div className="flex items-center space-x-3">
                                        {conversation.is_user && <UserAvatar user={conversation} online={true} />}
                                        {conversation.is_group && <GroupAvatar group={conversation} size={40} className="mr-2" />}
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

                <details className="dropdown dropdown-end" id="notificationMenu">
                    <summary className="flex items-center space-x-2 text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                        <FaBell className="text-xl" />
                        <span className="font-medium">Notifications</span>
                    </summary>
                    <div className="absolute top-10 left-3 mt-2 w-96 bg-white/95 backdrop-blur-lg rounded-lg shadow-xl overflow-hidden z-50 border border-purple-200">
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

                </details>
                <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-white font-medium  flex items-center space-x-2"
                >
                    <IoLogOut className="text-3xl" />
                    Logout</button>
            </div >
        </div >
    );
};

export default MobileMenu;