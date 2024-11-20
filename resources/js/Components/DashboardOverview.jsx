import { Line, Doughnut, Bar } from "react-chartjs-2";
import { FiUsers, FiUserPlus, FiActivity } from "react-icons/fi";
import { BsGlobe } from "react-icons/bs";
import React, { useState, useEffect } from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { MdOutlineContentPaste } from "react-icons/md";
const DashboardOverView = ({stats, userGrowthData, demographicsData, contentStats}) => {
  const iconMap = {
    FiUsers: FiUsers,
    FiUserPlus: FiUserPlus,
    FiActivity: FiActivity,
};
const [healthData, setHealthData] = useState([]);

      return (
        <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = iconMap[stat.icon];
            return (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                role="region"
                aria-label={`${stat.title} statistics`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {stat.value}
                    </h2>
                    <span className="text-sm text-green-500">{stat.change}</span>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full text-blue-600">

                    {IconComponent && <IconComponent className="w-6 h-6" />}
                  </div>
                </div>
              </div>
            );
})}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">User Growth</h3>
            <Line data={userGrowthData} options={{ responsive: true }} />
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Demographics</h3>
            <Doughnut data={demographicsData} options={{ responsive: true }} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
          <div className="flex items-center mb-4">
            <BsGlobe className="w-6 h-6 text-blue-600 mr-2" />
            <h3 className="text-xl font-semibold">Content Stats</h3>
          </div>
          <Bar data={contentStats} options={{ responsive: true }} />
        </div>
      </div>
      );
}

export default DashboardOverView;