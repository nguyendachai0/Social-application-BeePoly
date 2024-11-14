import AdminSidebar from "@/Components/app/AdminSidebar"

const AdminLayout = ({children}) => {
   return (
    <div className="flex">
            <AdminSidebar />
            <main className="flex-1 p-6">
                {children}
            </main>
        </div>
   );
}
export default AdminLayout;