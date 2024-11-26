import Navbar from "@/Components/app/navBar/NavBar";
import LeftBar from "@/Components/app/leftBar/LeftBar";
import RightBar from "@/Components/app/rightBar/RightBar";
import { usePage } from "@inertiajs/react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Layout = ({ children, showLeftBar = true, showRightBar = true}) => {
    const { props } = usePage();  
    console.log('Page Props:', props); 

    return (
        <>
    <Navbar />
            <ToastContainer />
            <div className="grid grid-cols-12 gap-6 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
                 {showLeftBar  && (<LeftBar user={props.auth?.user} />)}
                    {children}
                {showRightBar && (<RightBar />)}
            </div>
        </>
    );
};

export default Layout;
