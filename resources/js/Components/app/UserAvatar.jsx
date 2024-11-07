const UserAvatar = ({ user, online = null, sizeClass = 8 }) => {
    const onlineClass = online === true ? "online" : online === false ? "offline" : "";

    if (!user) {
        return <div>No user data</div>; // Placeholder or default UI
      }
    return (
        <>

            {user.avatar ? (
                <div className={`chat-image avatar ${onlineClass}`}>
                    <div className={`rounded-full  w-${sizeClass}`}>
                        <img src={`/storage/${user.avatar}`}  alt={`${user.name}'s avatar`} />
                    </div>
                </div>
            ) : (
                <div className={`chat-image avatar placeholder ${onlineClass}`}>
                    <div className={`bg-gray-400 text-gray-800 rounded-full w-${sizeClass}`}>
                        <span className="text-xl">
                            {user.first_name.substring(0, 1)}
                        </span>
                    </div>
                </div>
            )}
        </>
    );
}

export default UserAvatar;
