import { useEffect, useState } from "react";
import "./rightBar.scss";
import { usePage } from "@inertiajs/react";
import UserAvatar from "../UserAvatar";
const RightBar = () => {
    const page = usePage();
    const [onlineUsers, setOnlineUsers] = useState([]);
    const isUserOnline = (userId) => !!onlineUsers[userId];
    const  friends = page.props.friends;

    const getOnlineFriends = () => {
        const onlineUserIds = Object.keys(onlineUsers);
        return friends.filter(friend => 
            onlineUserIds.includes(friend.id.toString())
        );

    }
   

    useEffect(() => {
        Echo.join("online")
        .here((users) => {
            const onlineUsersObj = Object.fromEntries(users.map(
                (user) =>  [user.id, user]
            ));
            setOnlineUsers((prevOnlineUsers) => {
                return {...prevOnlineUsers,  ...onlineUsersObj};
            });
        })
        .joining((user) => {
            setOnlineUsers((prevOnlineUsers) => {
                const  updatedUsers = {...prevOnlineUsers};
                updatedUsers[user.id] = user;
                return updatedUsers;
            })
        })
        .leaving((user) => {
            setOnlineUsers((prevOnlineUsers) => {
                const  updatedUsers = {...prevOnlineUsers};
                delete updatedUsers[user.id];
                return updatedUsers;
            })
        })
        .error((error) => {
            console.log("error", error);
        });
        
        return () => {
            Echo.leave('online');
        }
    }, []);

    useEffect(() =>  {
    }, [onlineUsers])

    const onlineFriends  = getOnlineFriends();
    return ( 
        <div className="rightBar">
            <div className="container">
                <div className="item">
                    <span>Gợi ý cho bạn</span>
                    <div className="user">
                        <div className="userInfo">
                            <img 
                                src="https://scontent.fdad1-2.fna.fbcdn.net/v/t39.30808-1/272362123_694636348557125_8039652474921985497_n.jpg?stp=dst-jpg_p120x120&_nc_cat=102&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=t5Z-RWRGv0EQ7kNvgE1_rJ6&_nc_ht=scontent.fdad1-2.fna&oh=00_AYDekLc2863XF8ekb3777z870ZJBCNILqNJKRuXcigy5jA&oe=66B2C6B1"
                                alt="" 
                            />
                            <span>Đức Hải</span>
                        </div>
                        <div className="buttons">
                            <button>Đồng ý</button>
                            <button>Từ chối</button>
                        </div>
                    </div>
                    <div className="user">
                        <div className="userInfo">
                            <img 
                                src="https://scontent.fdad1-2.fna.fbcdn.net/v/t39.30808-1/272362123_694636348557125_8039652474921985497_n.jpg?stp=dst-jpg_p120x120&_nc_cat=102&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=t5Z-RWRGv0EQ7kNvgE1_rJ6&_nc_ht=scontent.fdad1-2.fna&oh=00_AYDekLc2863XF8ekb3777z870ZJBCNILqNJKRuXcigy5jA&oe=66B2C6B1"
                                alt="" 
                            />
                            <span>Ngọc Đức</span>
                        </div>
                        <div className="buttons">
                            <button>Đồng ý</button>
                            <button>Từ chối</button>
                        </div>
                    </div>
                </div>
                <div className="item">
                    <span>Hoạt động mới nhất</span>
                    <div className="user">
                        <div className="userInfo">
                            <img 
                                src="https://scontent.fdad1-2.fna.fbcdn.net/v/t39.30808-1/272362123_694636348557125_8039652474921985497_n.jpg?stp=dst-jpg_p120x120&_nc_cat=102&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=t5Z-RWRGv0EQ7kNvgE1_rJ6&_nc_ht=scontent.fdad1-2.fna&oh=00_AYDekLc2863XF8ekb3777z870ZJBCNILqNJKRuXcigy5jA&oe=66B2C6B1"
                                alt="" 
                            />
                            <p><span>Đức Hải</span> Chia sẻ video</p>
                        </div>
                        <span>10 phút trước</span>
                    </div>
                    <div className="user">
                        <div className="userInfo">
                            <img 
                                src="https://scontent.fdad1-2.fna.fbcdn.net/v/t39.30808-1/272362123_694636348557125_8039652474921985497_n.jpg?stp=dst-jpg_p120x120&_nc_cat=102&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=t5Z-RWRGv0EQ7kNvgE1_rJ6&_nc_ht=scontent.fdad1-2.fna&oh=00_AYDekLc2863XF8ekb3777z870ZJBCNILqNJKRuXcigy5jA&oe=66B2C6B1"
                                alt="" 
                            />
                            <p><span>Ngọc Đức</span> Đã thay đổi ảnh bìa của họ</p>
                        </div>
                        <span>5 phút trước</span>
                    </div>
                    <div className="user">
                        <div className="userInfo">
                            <img 
                                src="https://scontent.fdad1-3.fna.fbcdn.net/v/t39.30808-1/358439054_816747766761639_650919250803168650_n.jpg?stp=cp0_dst-jpg_p74x74&_nc_cat=111&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=_M4CETGy7qsQ7kNvgHSPacO&_nc_ht=scontent.fdad1-3.fna&oh=00_AYBUiitiOJafL3J1lDfZcqtZ4he6TFWC5eeeNjTMgakQgA&oe=66B2AC2B"
                                alt="" 
                            />
                            <p><span>Huỳnh Nam</span> Chia sẻ 1 video</p>
                        </div>
                        <span>2 tiếng trước</span>
                    </div>
                </div>
                <div className="item">
                    <span>Người liên hệ</span>
                    {onlineFriends.length > 0 ? (
                        onlineFriends.map(friend => (
                                <div className="flex items-center gap-2 p-2" key={friend.id}>
                                <UserAvatar user={friend} online={true} />
                                <div>{friend.first_name} {friend.last_name}</div>
                            </div>
                            // <div className="user" key={friend.id}>
                            //     <div className="userInfo">
                            //         <img 
                            //             src="https://scontent.fdad1-2.fna.fbcdn.net/v/t39.30808-1/429677665_356934373886100_8496529619463221698_n.jpg?stp=cp0_dst-jpg_p74x74&_nc_cat=106&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=ykzxiAh72MEQ7kNvgG7aaO_&_nc_ht=scontent.fdad1-2.fna&oh=00_AYCgANVlJVkxz3t_jgb8yT6xsyvG_OPJTZes4flhm1XieA&oe=66B2AC98"
                            //             alt="" 
                            //         />
                            //         <div className="online/>"></div>
                            //     </div>
                            // </div>
                        ))
                    ) : (
                        <p>No online friends</p>
                    )}
                </div>
            </div>
        </div>

    );
};

export default RightBar;