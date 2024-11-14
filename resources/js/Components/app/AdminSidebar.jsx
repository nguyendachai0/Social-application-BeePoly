import { useState } from "react";
import { FiUsers, FiMessageSquare, FiSettings, FiUserPlus, FiActivity} from "react-icons/fi";
import { BsGlobe } from "react-icons/bs";
import { MdOutlineContentPaste } from "react-icons/md";

const AdminSidebar = ()  => {
    const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
    return (
        <div className={`${sidebarOpen ? "w-64" : "w-20"} bg-white shadow-lg transition-all duration-300`}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            {sidebarOpen && <h2 className="text-xl font-bold">Admin Panel</h2>}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
              aria-label="Toggle Sidebar"
            >
              ☰
            </button>
          </div>
          <nav className="mt-8 space-y-4">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center w-full p-3 rounded-lg ${activeTab === "overview" ? "bg-blue-500 text-white" : "hover:bg-gray-100"}`}
            >
              <FiUsers className="mr-3" />
              {sidebarOpen && "Overview"}
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`flex items-center w-full p-3 rounded-lg ${activeTab === "users" ? "bg-blue-500 text-white" : "hover:bg-gray-100"}`}
            >
              <FiMessageSquare className="mr-3" />
              {sidebarOpen && "Users"}
            </button>
            <button
              onClick={() => setActiveTab("content")}
              className={`flex items-center w-full p-3 rounded-lg ${activeTab === "content" ? "bg-blue-500 text-white" : "hover:bg-gray-100"}`}
            >
              <MdOutlineContentPaste className="mr-3" />
              {sidebarOpen && "Content"}
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center w-full p-3 rounded-lg ${activeTab === "settings" ? "bg-blue-500 text-white" : "hover:bg-gray-100"}`}
            >
              <FiSettings className="mr-3" />
              {sidebarOpen && "Settings"}
            </button>
          </nav>
        </div>
      </div>
    )
}

export default AdminSidebar;