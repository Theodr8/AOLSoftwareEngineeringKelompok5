import { useEffect,useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Follow from "./Follow";
import UserPost from "../component/UserPost";

// interface UserProps{
//     userId: string;
// }

const UserDetail= () =>{
    const {userId} = useParams();
    const navigate = useNavigate();

    const [userProfile, setUserProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect ( () => {

        const fetchUserProfile = async () => {

                const token = localStorage.getItem("token");
                if (!token){
                    return;
                }
                
                try{
                    const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
                        method: 'GET',
                        headers : {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type" : "application/json"
                        }
                    });
                    if (!response.ok) {
                    throw new Error("Failed to fetch user");
                }
                const data = await response.json();
                const formattedProfile = data?.formattedProfile ?? data;
                setUserProfile(formattedProfile);
                console.log("Fetched user profile:", formattedProfile);
                }
                catch(error){
                    console.error(error);
                }
                finally{
                    setLoading(false);
                }
        }
        if (userId) {
            fetchUserProfile();
        }
    },[userId, navigate]);

    if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Memuat profil...</p>;
    if (!userProfile) return <p style={{ textAlign: "center", marginTop: "50px" }}>User tidak ditemukan.</p>;
    
    return(
        <div style={{ display: "flex", backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
            <Navbar />
            
            <div style={{marginLeft: "250px", flex: 1, padding: "20px", overflowY: "auto" }}>
                <div style={{ maxWidth: "800px", margin: "0 auto", backgroundColor: "white", borderRadius: "10px", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
                    
                    {/* --- BAGIAN BANNER & INFO (Mirip dengan Profile.tsx tapi tanpa tombol Edit) --- */}
                    <div style={{ height: "200px", backgroundColor: "#e2e2e2", position: "relative" }}>

                    </div>

                    <div style={{ padding: "0 30px 30px 30px", position: "relative" }}>
                        <div style={{ position: "relative", width: "150px", height: "150px", marginTop: "-75px", borderRadius: "50%", backgroundColor: "white", padding: "4px" }}>
                            <img 
                                src={userProfile.avatarUrl ? `http://localhost:5000${userProfile.avatarUrl}` : "https://via.placeholder.com/150"} 
                                alt="Avatar" 
                                style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} 
                            />
                        </div>
                        <div style={{flex:1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>

                        <div style={{ marginTop: "10px" }}>
                            <h1 style={{ margin: "0", fontSize: "28px" }}>{userProfile.displayName}</h1>
                            <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: "15px" }}>@{userProfile.username}</p>

                        </div>
                        <div>

                        <Follow 
                        userId= {userProfile.id}
                        initialFollower = {0}
                        initialFollowing= {0}
                        initialIsFollowed = {userProfile.isFollowedByMe ?? userProfile.isFollowedByme ?? false}
                        />
                        </div>
                        </div>

                        <p style={{ marginTop: "20px", fontSize: "15px", lineHeight: "1.5", color: "#333" }}>
                            {userProfile.bio || "Tidak ada bio."}
                        </p>

                        <div>
              <br />
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                Skill:
                  {userProfile.skills && userProfile.skills.length > 0 ? (
                      userProfile.skills.map((skill: any) => (
                          
                          <span 
                              key={skill.id} 
                              style={{ 
                                  padding: "6px 14px", 
                                  backgroundColor: "#f1f5f9", // Warna abu-abu soft
                                  color: "#334155",
                                  borderRadius: "20px", 
                                  fontSize: "13px", 
                                  fontWeight: "600",
                                  border: "1px solid #e2e8f0"
                              }}
                          >
                              {skill.name}
                          </span>
                      ))
                  ) : (
                      <span style={{ fontSize: "13px", color: "#94a3b8" }}>
                        No skill added at the moment
                      </span>
                  )}
              </div>
            </div>

                        <div
                            style={{
                                display: "flex",
                                gap: "20px",
                                marginTop: "20px",
                                fontSize: "15px",
                            }}>

                            <div style={{cursor:"pointer"}}
                                onClick={() => navigate(`/followerlist/${userProfile.id}`)}>
                                <span style={{ fontWeight: "bold", color: "#000" }}>
                                    {userProfile.followerCount || 0}
                                </span>
                                <span style={{ color: "#666", marginLeft: "4px" }}>
                                    Followers
                                </span>
                            </div>

                            <div style={{cursor:"pointer"}}
                                onClick={() => navigate(`/followinglist/${userProfile.id}`)}>
                                <span style={{ fontWeight: "bold", color: "#000" }}>
                                    {userProfile.followingCount || 0}
                                </span>
                                <span style={{ color: "#666", marginLeft: "4px" }}>
                                    Following
                                </span>
                            </div>
                        </div>
                    </div>


                    {/* --- BAGIAN POSTINGAN (Daur Ulang Komponen) --- */}
                    {/* Karena kita butuh userId-nya berformat string sesuai props, dan TypeScript kadang membaca useParams bisa undefined, kita pastikan userId ada */}
                    {userId && (
                        <UserPost 
                            userId={userId} 
                            displayName={userProfile.displayName} 
                            avatarUrl={userProfile.avatarUrl} 
                        />
                    )}

                </div>
            </div>
        </div>
    )
}

export default UserDetail;