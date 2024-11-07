import { useDarkMode } from "@/Context/DarkModeContext";
import UserAvatar from "../UserAvatar";
import {  FaMoon, FaSun, FaEdit, } from "react-icons/fa";
import { RiUserStarFill, RiGroupFill, RiCalendarEventFill, RiCompass3Fill } from "react-icons/ri";

import { Link } from "@inertiajs/react";
const LeftBar = ({user}) => {
  const {darkMode, toggleDarkMode} = useDarkMode();
  return (
    <aside className={`w-64 fixed left-0 top-20 bottom-0 ${darkMode ? "bg-gray-800" : "bg-white"} p-4 overflow-y-auto hidden md:block`}>
    <div className="mb-8 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
      <div className="flex items-center space-x-4 mb-4">
        {/* <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt="John Doe"
          className="w-16 h-16 rounded-full border-2 border-white"
        /> */}
        <UserAvatar  user={user} sizeClass={15}/>
        <div>
          <h3 className="font-semibold text-lg">{user.first_name} {user.sur_nameF}</h3>
          <p className="text-sm text-gray-200">Web Developer</p>
        </div>
      </div>
      <button className="w-full py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105">
        <FaEdit className="inline mr-2" /> Edit Profile
      </button>
    </div>
    <nav className="space-y-4">
      <a href="#" className="flex items-center space-x-2 hover:text-blue-500 transition duration-300 ease-in-out transform hover:translate-x-2">
        <RiUserStarFill className="text-2xl text-purple-500" /> <span>Friends</span>
      </a>
      <a href="#" className="flex items-center space-x-2 hover:text-blue-500 transition duration-300 ease-in-out transform hover:translate-x-2">
        <RiGroupFill className="text-2xl text-green-500" /> <span>Groups</span>
      </a>
      <a href="#" className="flex items-center space-x-2 hover:text-blue-500 transition duration-300 ease-in-out transform hover:translate-x-2">
        <RiCalendarEventFill className="text-2xl text-yellow-500" /> <span>Events</span>
      </a>
      <a href="#" className="flex items-center space-x-2 hover:text-blue-500 transition duration-300 ease-in-out transform hover:translate-x-2">
        <RiCompass3Fill className="text-2xl text-red-500" /> <span>Explore</span>
      </a>
    </nav>
    <button
      onClick={toggleDarkMode}
      className={`mt-8 flex items-center space-x-2 ${darkMode ? "text-yellow-400" : "text-gray-600"} transition duration-300 ease-in-out transform hover:scale-110`}
    >
      {darkMode ? <FaSun className="text-2xl text-yellow-400" /> : <FaMoon className="text-2xl text-blue-400" />}
      <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
    </button>
  </aside>
  );
};

export default LeftBar;
