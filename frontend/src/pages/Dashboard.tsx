import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SuggestedDevelopers from "../component/SuggestedDevelopers";
import Navbar from "../component/Navbar";
import CreatePost from "../component/CreatePost";
import PostActions from "../component/postComponent";
import CreatePostDetail from "./CreatePostDetail";


const Dashboard = () => {
    const navigate = useNavigate();
    const myId = localStorage.getItem("id");
    // const [myId, setMyId] = useState<string | null>(localStorage.getItem("id"));
    const [activeTab, setActiveTab] = useState('foryou');

    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");


    const [isModalOpen, setIsModalOpen] = useState(false);

    const handlePostCreated = (newPost: any) => {
        // Tambahkan post baru ke urutan paling atas di layar
        setPosts(prevPosts => [newPost, ...prevPosts]);
    };

    // const [body, setBody] = useState('');

    // useEffect(() => {
    //     if (myId) {
    //         return;
    //     }

    //     const storedToken = localStorage.getItem("token");
    //     if (!storedToken) {
    //         return;
    //     }

    //     try {
    //         const payloadPart = storedToken.split(".")[1];
    //         if (!payloadPart) {
    //             return;
    //         }

    //         const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    //         const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    //         const decoded = JSON.parse(atob(padded));
    //         if (decoded?.userId) {
    //             const resolvedId = String(decoded.userId);
    //             localStorage.setItem("id", resolvedId);
    //             setMyId(resolvedId);
    //         }
    //     }
    //     catch (error) {
    //         console.error("gagal membaca token", error);
    //     }
    // }, [myId]);

    const fetchPosts = async () => {
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

    const getImageUrl = (url: string | null | undefined) => {
        if (!url) return "https://via.placeholder.com/40"; 

        if (url.startsWith("http://") || url.startsWith("https://")) {
            return url;
        }

        return `http://localhost:5000${url}`;
    };

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
                    if (post.author?.id && post.author.id !== myId) {
                        navigate(`/user/${post.author.id}`);
                    }
                    else {
                        navigate(`/profile`)
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
                        getImageUrl(post.author.avatarUrl)
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
            <div style={{ 
                position: "fixed",
                bottom: "40px",
                right: "60px",
                zIndex: 9999,
                height: "80px",  
                width: "80px",
            }}>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    style={{ 
                        width: "100%", 
                        height: "100%", 
                        borderRadius: "50%", 
                        border: "none",           
                        backgroundColor: "#000",  
                        color: "#fff",        
                        cursor: "pointer", 
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)", // 4. BAYANGAN lebih lembut & lebar agar benar-benar "melayang"
                        transition: "transform 0.2s ease-in-out",     // 5. Animasi halus jika diklik
                    }}
                    // Tambahan animasi sederhana saat di-hover (opsional, ditaruh di CSS / styled-components lebih baik)
                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                    {/* 6. Ganti simbol ╋ dengan SVG bawaan yang 100% simetris dan elegan */}
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
                
                <CreatePostDetail
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    onSuccess={handlePostCreated} 
                />
            </div>
    </div>
    );
}
export default Dashboard;