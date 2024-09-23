import Navbar from "@/Components/app/navBar/NavBar";
import LeftBar from "@/Components/app/leftBar/LeftBar";
import RightBar from "@/Components/app/rightBar/RightBar";
import { usePage } from "@inertiajs/react";

const Layout = ({ children, showLeftBar = true, showRightBar = true}) => {
    const { props } = usePage();  // Access the page props
    console.log('Page Props:', props); // Check what is available in props

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 pb-8 flex">
                 {showLeftBar  && (<LeftBar user={props.auth?.user} />)}
                <div style={{ flex: 6 }}>
                    {children}
                </div>
                {showRightBar && (<RightBar />)}
            </div>
        </>
    );
};

export default Layout;
