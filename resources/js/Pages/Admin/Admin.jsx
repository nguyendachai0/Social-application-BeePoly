import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import DashboardOverView from "@/Components/UI/admin/DashboardOverview";

const Admin = ({ stats, userGrowthData, demographicsData, contentStats }) => {

    return (
        <DashboardOverView 
        stats={stats} 
        userGrowthData={userGrowthData} 
        demographicsData={demographicsData} 
        contentStats={contentStats} 
        />
    );
};

Admin.layout = (page) => (
    <AdminLayout>{page}</AdminLayout>
);

export default Admin;
