import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SuggestedDevelopers from "../component/SuggestedDevelopers";
import Navbar from "../component/Navbar";
import CreatePost from "../component/CreatePost";

const Dashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('foryou');

    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    // const [body, setBody] = useState('');

    const fetchPosts = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        setLoading(true);
        setPosts([]);
        try {
            const endpoint = activeTab === "foryou"
                ? "http://localhost:5000/api/posts/foryou"
                : "http://localhost:5000/api/posts/following";

            const response = await fetch(endpoint, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("Failed getting data");
            }

            const data = await response.json();
            setPosts(data);
        }
        catch (error) {
            console.error("ada error", error);
        }
        finally {
            setLoading(false);
        }
    };

    // const handleCreatePost = async (event: React.FormEvent<HTMLFormElement>) => {
    //     event.preventDefault();

    //     const token = localStorage.getItem("token");
    //     if (!token) {
    //         navigate("/login");
    //         return;
    //     }

    //     if (!body.trim()) {
    //         return;
    //     }

    //     try {
    //         const response = await fetch("http://localhost:5000/api/posts/", {
    //             method: "POST",
    //             headers: {
    //                 "Authorization": `Bearer ${token}`,
    //                 "Content-Type": "application/json"
    //             },
    //             body: JSON.stringify({ body })
    //         });

    //         const data = await response.json();

    //         if (!response.ok) {
    //             throw new Error(data.message || "posts failed");
    //         }

    //         setBody("");
    //         await fetchPosts();
    //     }
    //     catch (error) {
    //         alert(error);
    //         console.error("ada error: ", error);
    //     }
    // };

    useEffect(() => {
        fetchPosts();
    }, [activeTab, navigate]);

    

    // const handleLogout = () => {
    //     localStorage.removeItem("token");
    //     navigate("/login");
    // };
    return (
    <div style={{ display: "flex", maxWidth: "1200px", margin: "0 auto", height: "100vh" }}>
        <div>
            <Navbar />
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

        {/* <form onSubmit={handleCreatePost} style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
        <input type="text" placeholder="What's compiling?" value={body} onChange={(e) => setBody(e.target.value)} required
        style={{ width: "100%", border: "none", outline: "none", fontSize: "16px" }} />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                <button type="submit" style={{ background: "black", color: "white", padding: "8px 16px", borderRadius: "20px", border: "none" }}>Post</button>
            </div>
        </form> */}
        <CreatePost />


        {loading ? (<p style={{textAlign: "center"}}>Loading...</p>) : posts.length ===0 ? 
            (<p style={{textAlign: "center"}}>No post yet</p>) : (
                posts.map((post) => <div key={post.id} style={{ borderBottom: "1px solid #eee", padding: "15px 0" }}>
                    <div>

                        <img 
                            src={post.author.avatarUrl} 
                            alt="avatar" 
                            style={{ width: "35px", height: "35px", borderRadius: "50%", marginRight: "10px", objectFit: "cover" }} 
                            />
                    </div>
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
        </div>
        </div>

    </div>
    );
}
export default Dashboard;