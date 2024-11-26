import { UserIcon } from  "@heroicons/react/24/solid";

const GroupAvatar = ({group,   size = "medium"})  => {

    const sizeClasses = {
        small: "w-8 h-8",
        medium: "w-12 h-12",
        large: "w-16 h-16"
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

      const groupMembers = group.users;
      
    return(
        <div className="relative w-12 h-12">           
            {
                group.avatar  ?  (      
        <img
          src={`https://${group.avatar}`}
          alt={group.name}
          className="w-12 h-12 rounded-full absolute top-0 left-0"
        />
        )
        :
        (
            <div
            className={`w-full h-full ${getBgColor(
                group.name
            )} flex items-center rounded-full justify-center text-white font-semibold`}
            >
            {group.name.substring(0, 1)}
            </div>
        )
    }
        <div className="absolute -bottom-2 -right-2 flex -space-x-2">
          {group.users.slice(0, 2).map((user, index) => (

        <div key={user.id}>
            {user.avatar ? (
            <img
              src={`https://${user.avatar}`}
              alt={user.name}
              className="w-6 h-6 rounded-full border-2 border-white"
            />
        ) : (
            <div
            className={`w-6 h-6 ${getBgColor(user.first_name)} flex items-center rounded-full justify-center text-white font-semibold`}
          >
            {user.first_name.substring(0, 1)}
          </div>       
          )}

        </div>
         ))}
      </div>
      </div>
  );
};

export default GroupAvatar;