import { useState } from "react";
import { FiUsers, FiMessageSquare, FiSettings, FiUserPlus, FiActivity } from "react-icons/fi";
import { BsGlobe } from "react-icons/bs";
import { MdOutlineContentPaste } from "react-icons/md";
import { Link } from "@inertiajs/react";

const AdminSidebar = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleActiveTab = (tab) => {
    setActiveTab(tab);
  };


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
          <Link
            href="/admin/overview"
            onClick={() => handleActiveTab("overview")}
            className={`flex items-center w-full p-3 rounded-lg ${activeTab === "overview" ? "bg-blue-500 text-white" : "hover:bg-gray-100"}`}
          >
            <FiUsers className="mr-3" />
            {sidebarOpen && "Overview"}
          </Link>
          <Link
            href="/admin/users"
            onClick={() => handleActiveTab("users")}
            className={`flex items-center w-full p-3 rounded-lg ${activeTab === "users" ? "bg-blue-500 text-white" : "hover:bg-gray-100"}`}
          >
            <FiMessageSquare className="mr-3" />
            {sidebarOpen && "Users"}
          </Link>
          <Link
            href="/admin/reports"
            onClick={() => handleActiveTab("content")}
            className={`flex items-center w-full p-3 rounded-lg ${activeTab === "content" ? "bg-blue-500 text-white" : "hover:bg-gray-100"}`}
          >
            <MdOutlineContentPaste className="mr-3" />
            {sidebarOpen && "Content"}
          </Link>
        </nav>
      </div>
    </div>
  )
}

export default AdminSidebar;