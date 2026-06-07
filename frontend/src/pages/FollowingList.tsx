import Follow from "../component/Follow";
import { useState,useEffect } from "react";
import Navbar from "../component/Navbar";
import { useNavigate,useParams } from "react-router-dom";

const FollowingList = () => {

    const [userList,setUserList] = useState<any[]>([]);
    const navigate = useNavigate();
    const [loading,setLoading] = useState(true);

    const { userId } = useParams();
    const token = localStorage.getItem("token");
    useEffect(() => {
        const fetchFollowing = async () => {
            if(!token || !userId){
                return;
            }
            try{
                const response = await fetch (`http://localhost:5000/api/users/followinglist/${userId}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                if (!response.ok) {
                    throw new Error("Failed to fetch user");
                }
                const data = await response.json();
                setUserList(data.following ?? []);
                console.log("Data Following dari Backend:", data.following ?? []);
            }
            catch(error){
                console.error(error);
            }
            finally {
                setLoading(false)
            }
        }
        fetchFollowing();
    },[navigate, token, userId])
    if (loading){
        return <p style={{ fontSize: "14px", color: "gray" }}>Mencari developer...</p>;
    }
    return(
        <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9f9f9" }}>
            <Navbar />
            
            <div style={{ flex: 1, padding: "30px", overflowY: "auto" }}>
                <div style={{ maxWidth: "600px", margin: "0 auto", backgroundColor: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                    
                    <h2 style={{ borderBottom: "1px solid #eee", paddingBottom: "15px", marginTop: 0 }}>Following List</h2>
                    
                    {userList.length === 0 ? (
                        <p style={{ fontSize: "14px", color: "gray", textAlign: "center", padding: "20px 0" }}>Tidak ada user yang di-follow saat ini.</p>
                    ) : (
                        userList.map((user) => (
                            <div key={user.following.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 0", borderBottom: "1px solid #eee" }}>
                                
                                {/* Info User (Bisa di-klik untuk pindah profil) */}
                                <div 
                                    style={{ cursor: "pointer", display: "flex", alignItems: "center", flex: 1 }} 
                                    onClick={() => navigate(`/user/${user.following.id}`)}
                                >
                                    <img 
                                        src={user.following.avatarUrl ? `http://localhost:5000${user.following.avatarUrl}` : "https://via.placeholder.com/40"} 
                                        alt="avatar" 
                                        style={{ width: "45px", height: "45px", borderRadius: "50%", marginRight: "15px", objectFit: "cover" }} 
                                    />
                                    <div>
                                        <div style={{ fontWeight: "bold", fontSize: "15px" }}>{user.following.displayName}</div>
                                        <div style={{ color: "gray", fontSize: "13px" }}>@{user.following.username}</div>
                                    </div>
                                </div>

                                <div>
                                    <Follow 
                                        userId={user.following.id}
                                        initialFollower={0}
                                        initialFollowing={0}
                                        initialIsFollowed={user.isFollowedByMe || false}
                                    />
                                </div>
                                
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )


}

export default FollowingList