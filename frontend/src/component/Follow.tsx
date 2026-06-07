import { useEffect, useState } from "react";
import React from "react";

interface FollowProps {
    userId: string;
    initialFollower: number;
    initialFollowing: number;
    initialIsFollowed: boolean;
}

const Follow: React.FC<FollowProps> = ({
    userId,
    initialIsFollowed
}) => {
    const [isFollowed, setIsFollowed] = useState(initialIsFollowed);

    useEffect(() => {
        setIsFollowed(initialIsFollowed);
    }, [initialIsFollowed]);

    const token = localStorage.getItem("token");

    const handleFollow = async () => {
        const prevIsFollowed = isFollowed;
        try{
            setIsFollowed(!prevIsFollowed);

            const response = await fetch(`http://localhost:5000/api/users/${userId}/follow`, {
                method : "POST",
                headers: {
                    "Authorization" : `Bearer ${token}`,
                }
            });
            if (!response.ok) throw new Error();
        }
        catch(error){
            setIsFollowed(prevIsFollowed);
            alert("gagal follow")
            console.error(error);
        }
    };

    return (
        <button 
            onClick={handleFollow}
            style={{
                padding: "10px 24px",
                borderRadius: "30px",
                fontWeight: "bold",
                fontSize: "14px",
                cursor: "pointer",
                border: isFollowed ? "1px solid #ccc" : "none",
                backgroundColor: isFollowed ? "white" : "black",
                color: isFollowed ? "black" : "white",
                transition: "all 0.2s ease"
            }}
        >
            {isFollowed ? "Following" : "Follow"}
        </button>
    )
}

export default Follow;