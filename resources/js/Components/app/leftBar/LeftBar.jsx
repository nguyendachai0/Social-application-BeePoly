import {  FaHome, FaUserFriends, FaBookmark, FaCalendar, FaCog } from "react-icons/fa";
const LeftBar = ({user}) => {

  const NavItem = ({ icon, text, active }) => (
    <button
      className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${active
        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
        : "text-gray-700 hover:bg-purple-50"}`}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium">{text}</span>
    </button>
  );

  const ShortcutItem = ({ text }) => (
    <button className="flex items-center space-x-3 w-full p-2 rounded-lg text-gray-700 hover:bg-purple-50 transition-colors">
      <span className="font-medium text-sm">{text}</span>
    </button>
  );
  
  return (
    <div className="col-span-3">
            <div className="bg-white/80 backdrop-blur-lg rounded-lg shadow-xl p-6 border border-purple-200 sticky top-24">
              <div className="space-y-6">
                <NavItem icon={<FaHome />} text="Home" active />
                <NavItem icon={<FaUserFriends />} text="Friends" />
                <NavItem icon={<FaBookmark />} text="Saved" />
                <NavItem icon={<FaCalendar />} text="Events" />
                <NavItem icon={<FaCog />} text="Settings" />
              </div>
              <hr className="my-6 border-purple-100" />
              <h3 className="font-semibold text-gray-700 mb-4">Your Shortcuts</h3>
              <div className="space-y-4">
                <ShortcutItem text="Web Development" />
                <ShortcutItem text="UI/UX Design" />
                <ShortcutItem text="Digital Marketing" />
              </div>
            </div>
          </div>
  );
};

export default LeftBar;
