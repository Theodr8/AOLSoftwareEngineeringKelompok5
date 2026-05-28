import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import SuggestedDevelopers from "../component/SuggestedDevelopers";

const Dashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('foryou');

    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchPosts = async () => {
            setLoading(true);
            setPosts([]);
            try {
                const endpoint = activeTab === "foryou" ? 
                "http://localhost:5000/api/posts/foryou" : "http://localhost:5000/api/posts/following";
                
                const response = await fetch(endpoint, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok){
                    throw new Error("Failed getting data");
                }

                const data = await response.json();
                // if (Array.isArray(data)){
                //     setPosts(data);
                // }
                // else if (data.data && Array.isArray(data)) {
                //     setPosts(data.data);
                // }
                // else {
                //     setPosts([]);
                // }
                setPosts(data);
                console.log(data);
            }
            catch(error){
                console.error("ada error", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [activeTab, navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };
    return (
    // Container utama dengan display Flex untuk membuat 3 kolom sejajar
    <div style={{ display: "flex", maxWidth: "1200px", margin: "0 auto", height: "100vh" }}>
      
      {/* ================= KOLOM KIRI: MENU NAVIGASI ================= */}
        <div style={{ width: "250px", borderRight: "1px solid #ccc", padding: "20px" }}>
        <h2>GoDev</h2>
        <ul style={{ listStyle: "none", padding: 0, lineHeight: "2.5" }}>
            <li style={{ fontWeight: "bold" }}>🏠 Home</li>
            <li>🔍 Explore</li>
            <li>💼 Projects</li>
            <li>💬 Chat</li>
            <li>👤 Profile</li>
        </ul>
        <button onClick={handleLogout} style={{ marginTop: "50px", padding: "10px", width: "100%", cursor: "pointer" }}>
            Logout
        </button>
        </div>

      {/* ================= KOLOM TENGAH: FEED POSTINGAN ================= */}
        <div style={{ flex: 1, padding: "0 20px" }}>
        <div style={{ display: "flex", borderBottom: "1px solid #ccc", marginBottom: "20px" }}>
        <div 
            onClick={() => setActiveTab("foryou")}
            style={{ 
            flex: 1, textAlign: "center", padding: "15px", cursor: "pointer",
            fontWeight: activeTab === "foryou" ? "bold" : "normal",
            borderBottom: activeTab === "foryou" ? "3px solid blue" : "none"
            }}>
            For You
        </div>
        <div 
            onClick={() => setActiveTab("following")}
            style={{ 
            flex: 1, textAlign: "center", padding: "15px", cursor: "pointer",
            fontWeight: activeTab === "following" ? "bold" : "normal",
            borderBottom: activeTab === "following" ? "3px solid blue" : "none"
            }}>
            Following
        </div>
        </div>

        <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
        <input type="text" placeholder="What's compiling?" style={{ width: "100%", border: "none", outline: "none", fontSize: "16px" }} />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                <button style={{ background: "black", color: "white", padding: "8px 16px", borderRadius: "20px", border: "none" }}>Post</button>
            </div>
        </div>


        {loading ? (<p style={{textAlign: "center"}}>Loading...</p>) : posts.length ===0 ? 
            (<p style={{textAlign: "center"}}>No post yet</p>) : (
                posts.map((post) => <div key={post.id} style={{ borderBottom: "1px solid #eee", padding: "15px 0" }}>
                    <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                        {post.author?.displayName} <span style={{ color: "gray", fontWeight: "normal" }}> @{post.author?.username}</span>
                    </div>
                    <p>{post.content || post.body}</p>
                    </div>
                    )
            )}
        </div>

      {/* ================= KOLOM KANAN: WIDGET ================= */}
        <div style={{ width: "300px", borderLeft: "1px solid #ccc", padding: "20px" }}>
        <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
            <SuggestedDevelopers/>
            {/* // </SuggestedDevelopers>     */}
        </div>
        </div>

    </div>
    );
}
export default Dashboard;