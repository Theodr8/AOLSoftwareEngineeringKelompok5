import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SuggestedDevelopers from "../component/SuggestedDevelopers";
import Navbar from "../component/Navbar";
import CreatePost from "../component/CreatePost";
import PostActions from "../component/postComponent";


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

    useEffect(() => {
        fetchPosts();
    }, [activeTab, navigate]);

    return (
    <div style={{ display: "flex",maxWidth: "1200px", margin: "0 auto", height: "100vh" }}>
        <div>
            <Navbar />
        </div>

      {/* ================= KOLOM TENGAH: FEED POSTINGAN ================= */}
        <div style={{ marginLeft: "250px",flex: 1, padding: "0 20px" }}>
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
            <div
                onClick={() => {
                    if (post.author?.id) {
                        navigate(`/user/${post.author.id}`);
                    }
                }}
                style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "12px",
                }}>
                <img
                    src={
                        post.author?.avatarUrl 
                        ? `http://localhost:5000${post.author?.avatarUrl}` :
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXIdvC1Q4WL7_zA6cJm3yileyBT2OsWhBb9Q&s"
                    }
                    alt="avatar"
                    style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        flexShrink: 0,
                    }}
                />

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                    }}>
                    <span
                        style={{
                            fontWeight: "bold",
                            fontSize: "15px",
                        }}
                    >
                        {post.author?.displayName}
                    </span>

                    <span
                        style={{
                            color: "gray",
                            fontSize: "13px",
                        }}
                    >
                        @{post.author?.username}
                    </span>

                    <span
                        style={{
                            color: "#999",
                            fontSize: "12px",
                        }}
                    >
                        {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </div>

            <h2
                style={{ cursor: "pointer", margin: "0 0 8px 0" }}
                onClick={() => navigate(`/post/${post.id}`)}
            >
                {post.title}
            </h2>

            <p>{post.content || post.body}</p>

                    
                    <PostActions 
                        postId={post.id}
                        initialLikes={post.likeCount || 0}
                        commentCount={post.commentCount || 0}
                        initialIsLiked={post.isLikedByMe || false} 
                        initialIsSaved={post.isSavedByMe || false}
                        onCommentClick={() => navigate(`/post/${post.id}`)} 
                        />
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