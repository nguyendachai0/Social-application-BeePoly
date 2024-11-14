import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import DashboardOverView from "@/Components/DashboardOverview";

const Admin = ({ auth}) => {
    return (
        <DashboardOverView />
    );
};

Admin.layout = (page) => (
    <AdminLayout>{page}</AdminLayout>
);

export default Admin;
