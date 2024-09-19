const  Contact = () => {
    return  (
        <div className="sm:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      
        <div className="drawer-side">
          <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            {/* Sidebar content here */}
            <li><a><div className="avatar">
        <div className="w-8 rounded-full">
          <img
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            alt="Tailwind-CSS-Avatar-component" />
        </div></div>Tên của tôi</a></li>
          </ul>
        </div>
      </div>
    )
}
export default  Contact;