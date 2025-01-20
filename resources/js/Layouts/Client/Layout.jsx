import Navbar from "@/Components/app/client/navBar/NavBar";
import LeftBar from "@/Components/app/client/leftBar/LeftBar";
import RightBar from "@/Components/app/client/rightBar/RightBar";
import { usePage } from "@inertiajs/react";
import { ToastContainer } from "react-toastify";

const Layout = ({ children, showLeftBar = true, showRightBar = true }) => {
    const { props } = usePage();
    const { url } = usePage();
    return (
        <>
            <Navbar />
            <ToastContainer />
            <div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-6 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
                {showLeftBar && (
                    <div className="hidden lg:block lg:col-span-3">
                        <LeftBar user={props.auth?.user} />
                    </div>
                )}
                <div className={`col-span-12 ${url === '/' ? 'md:col-span-5 lg:col-span-6' : ''} ${url === '/friends' ? 'lg:ml-[19rem] mt-2 lg:mt-[-0.4rem]' : 'mx-2'}`}>
                    {children}
                </div>
                {showRightBar && (
                    <div className="hidden md:block lg:col-span-3">
                        <RightBar />
                    </div>
                )}
            </div >
        </>
    );
};

export default Layout;
