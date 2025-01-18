import { FaHome, FaUserFriends, FaBookmark, FaCalendar, FaCog } from "react-icons/fa";
import { Link, usePage } from '@inertiajs/react'
const LeftBar = () => {
  const { url } = usePage();
  const NavItem = ({ icon, text, href, isActive }) => {
    return (
      <Link href={href}
        className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${isActive
          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
          : "text-gray-700 hover:bg-purple-50"}`}
      >
        <span className="text-xl">{icon}</span>
        <span className="font-medium">{text}</span>
      </Link>
    );
  };

  const ShortcutItem = ({ text }) => (
    <button className="flex items-center space-x-3 w-full p-2 rounded-lg text-gray-700 hover:bg-purple-50 transition-colors">
      <span className="font-medium text-sm">{text}</span>
    </button>
  );

  return (
    <div className="col-span-3">
      <div className="bg-white/80 backdrop-blur-lg rounded-lg shadow-xl p-6 border border-purple-200 fixed mt-4 w-72 ml-3">
        <div className="space-y-6">
          <NavItem href={route('dashboard')} icon={<FaHome />} text="Home" isActive={url == '/' ? true : false} />
          <NavItem href={route('friends.page')} icon={<FaUserFriends />} text="Friends" isActive={url == '/friends' ? true : false} />
        </div>
        <hr className="my-6 border-purple-100" />


      </div>
    </div>
  );
};

export default LeftBar;
