import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import Follow from "./Follow";

const SuggestedDevelopers = () => {
    const [developers, setDevelopers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSuggestions = async () => {
            const token = localStorage.getItem("token");
            if (!token){
                return;
            }
            try {
                const response = await fetch("http://localhost:5000/api/users/suggestions", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch user");
                }
                const data = await response.json();
                setDevelopers(data);
                console.log(data);
            }
            catch(error){
                console.error(error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchSuggestions();
    }, [navigate]);
    if (loading){
        return <p style={{ fontSize: "14px", color: "gray" }}>Mencari developer...</p>;
    }
    return (
    <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
      <h4 style={{ marginTop: 0 }}>Suggested Developers</h4>
      
      {developers.length === 0 ? (
        <p style={{ fontSize: "14px", color: "gray" }}>Tidak ada saran saat ini.</p>
      ) : (
        developers.map((dev) => (
          <div key={dev.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <div style={{cursor:"pointer"}} onClick={() => navigate(`/user/${dev.id}`)}>

              <div style={{ fontWeight: "bold", fontSize: "14px" }}>                   
                                <img 
                                    src={`http://localhost:5000${dev.avatarUrl}` ? `http://localhost:5000${dev.avatarUrl}` : dev.avatarUrl} 
                                    alt="avatar" 
                                    style={{ width: "35px", height: "35px", borderRadius: "50%", marginRight: "10px", objectFit: "cover" }} 
                                /></div>
              <div style={{ fontWeight: "bold", fontSize: "14px" }}>{dev.displayName}</div>
              <div style={{ color: "gray", fontSize: "12px" }}>@{dev.username}</div>
            </div>
            {/* Tombol follow sementara hanya visual */}
            {/* <button style={{ padding: "5px 10px", background: "blue", color: "white", border: "none", borderRadius: "15px", cursor: "pointer", fontSize: "12px" }}>
              Follow
            </button> */}
            <Follow 
              userId= {dev.id}
              initialFollower = {0}
              initialFollowing= {0}
              initialIsFollowed = {dev.isFollowedByMe || false}
            />

          </div>
        ))
      )}
    </div>
  );
}

export default SuggestedDevelopers;