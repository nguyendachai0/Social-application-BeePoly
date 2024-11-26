import { useState } from "react";
const UserAvatar = ({ user, online = null, altText = "User profile picture", size = "medium" }) => {
    const [imageError, setImageError] = useState(false);
    const isOnline = online === true;
    const [isHovered, setIsHovered] = useState(false);
    if (!user) {
        return <div>No user data</div>; 
      }
      const sizeClasses = {
        small: "w-8 h-8",
        medium: "w-12 h-12",
        large: "w-16 h-16",
        huge:  "w-32 h-32"
      };
      

      const bgColors = [
        "bg-blue-500",
        "bg-red-500",
        "bg-green-500",
        "bg-yellow-500",
        "bg-purple-500",
        "bg-pink-500"
      ];

      const getBgColor = (name) => {
        const index = name.length % bgColors.length;
        return bgColors[index];
      };

    return (
        <>

                <div
                className="relative inline-block"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                role="button"
                aria-label={`${altText}${isOnline ? ", User is online" : ", User is offline"}`}
              >
                <div
                  className={`
                    ${sizeClasses[size]}
                    rounded-full
                    overflow-hidden
                    transition-transform duration-300
                    shadow-lg
                    ${isHovered ? "transform scale-105 ring-2 ring-blue-400" : ""}
                    ${isOnline ? "cursor-pointer" : "cursor-default"}
                  `}
                >
                  { user.avatar ? (
                    <img
                      src={`storage/${user.avatar}`}
                      alt={altText}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                    className={`w-full h-full ${getBgColor(
                      user.first_name
                    )} flex items-center justify-center text-white font-semibold `}
                  >
                    {user.first_name.substring(0,1)} {user.sur_name.substring(0,1)}
                  </div>
                  )}
                </div>
          
                
          {isOnline  && (
              <div
              className={`
                absolute -bottom-8 left-1/2 transform -translate-x-1/2
                bg-black text-white text-xs rounded px-2 py-1
                transition-opacity duration-200
                ${isHovered ? "opacity-100" : "opacity-0"}
                `}
                role="tooltip"
                >
                  {isOnline ? "Online" : "Offline"}
                </div>
                )}
              </div>
           
        </>
    );
}

export default UserAvatar;
