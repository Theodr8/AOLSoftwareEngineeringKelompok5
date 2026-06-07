import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostActions from "./postComponent";

interface UserPostsProps {
    userId: string;
    displayName: string;
    avatarUrl: string;
}

const UserPost: React.FC<UserPostsProps> = ({ userId, displayName, avatarUrl }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('posts');
    const [activeDropdown, setActiveDropdown] = useState('posts');

    const [posts, setPosts] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const myId = localStorage.getItem("id");

    useEffect(() => {
        const fetchPost = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            setLoading(true);
            setPosts([]);
            setProjects([]);
            
            try {
                let endpoint = "";
                
                if (activeTab === "posts") {
                    endpoint = `http://localhost:5000/api/posts/user/${userId}`;
                } 
                else if (activeTab === "projects") {
                    endpoint = `http://localhost:5000/api/projects/user/${userId}`;
                } 
                else if (activeTab === "liked") {
                    if (activeDropdown === "posts") {
                        endpoint = `http://localhost:5000/api/posts/likedpost/${userId}`;
                    } else if (activeDropdown === "projects") {
                        endpoint = `http://localhost:5000/api/projects/likedproject/${userId}`;
                    }
                } 
                else if (activeTab === "saved") {
                    if (activeDropdown === "posts") {
                        endpoint = `http://localhost:5000/api/posts/savepost/${userId}`;
                    } else if (activeDropdown === "projects") {
                        endpoint = `http://localhost:5000/api/projects/saveproject/${userId}`;
                    }
                }

                const response = await fetch(endpoint, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                
                if (!response.ok) throw new Error("Gagal memuat");

                const data = await response.json();
                
                if (activeTab === "posts" || (activeTab === "liked" && activeDropdown === "posts") || (activeTab === "saved" && activeDropdown === "posts")) {
                    setPosts(data);
                } else {
                    setProjects(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [userId, activeTab, activeDropdown, navigate]);

    const isShowingProjects = activeTab === "projects" || ((activeTab === "liked" || activeTab === "saved") && activeDropdown === "projects");
    const displayData = isShowingProjects ? projects : posts;

    if (loading) return <p style={{ color: "gray", textAlign: "center", padding: "20px 0" }}>Memuat data...</p>;

    return (
        <div style={{ borderTop: "1px solid #eee", padding: "20px 30px" }}>
            
            <div style={{ display: "flex", borderBottom: "1px solid #ccc", marginBottom: "15px" }}>
                <div onClick={() => { setActiveTab("posts"); setActiveDropdown("posts"); }}
                    style={{ flex: 1, textAlign: "center", padding: "15px", cursor: "pointer", fontWeight: activeTab === "posts" ? "bold" : "normal", borderBottom: activeTab === "posts" ? "3px solid blue" : "none" }}>
                    Posts
                </div>
                <div onClick={() => { setActiveTab("projects"); setActiveDropdown("projects"); }}
                    style={{ flex: 1, textAlign: "center", padding: "15px", cursor: "pointer", fontWeight: activeTab === "projects" ? "bold" : "normal", borderBottom: activeTab === "projects" ? "3px solid blue" : "none" }}>
                    Projects
                </div>
                <div onClick={() => setActiveTab("liked")}
                    style={{ flex: 1, textAlign: "center", padding: "15px", cursor: "pointer", fontWeight: activeTab === "liked" ? "bold" : "normal", borderBottom: activeTab === "liked" ? "3px solid blue" : "none" }}>
                    Liked
                </div>
                <div onClick={() => setActiveTab("saved")}
                    style={{ flex: 1, textAlign: "center", padding: "15px", cursor: "pointer", fontWeight: activeTab === "saved" ? "bold" : "normal", borderBottom: activeTab === "saved" ? "3px solid blue" : "none" }}>
                    Saved
                </div>
            </div>

            {(activeTab === "liked" || activeTab === "saved") && (
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
                    <select 
                        value={activeDropdown} 
                        onChange={(e) => setActiveDropdown(e.target.value)}
                        style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #ccc", outline: "none", cursor: "pointer" }}
                    >
                        <option value="posts">Tampilkan Posts</option>
                        <option value="projects">Tampilkan Projects</option>
                    </select>
                </div>
            )}

            {displayData.length === 0 ? (
                <p style={{ color: "gray", textAlign: "center", padding: "20px 0" }}>Belum ada {isShowingProjects ? "project" : "postingan"}.</p>
            ) : (
                displayData.map(item => {
                    const postAuthorName = item.author?.displayName || displayName;
                    
                    const postAvatarUrl = item.author?.avatarUrl 
                        ? `http://localhost:5000${item.author?.avatarUrl}`
                        : (avatarUrl ? `http://localhost:5000${avatarUrl}` : "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg");

                    return (
                        <div key={item.id} style={{ border: "1px solid #eee", borderRadius: "8px", padding: "15px", marginBottom: "15px" }}>
                            <div 
                                onClick={() => {
                                    if (item.author?.id && item.author.id !== myId) {
                                        navigate(`/user/${item.author.id}`);
                                    }
                                    else {
                                        navigate(`/profile`)
                                    }
                                }}
                                style={{cursor:"pointer",  display: "flex", alignItems: "center", marginBottom: "10px" }}>
                                    
                                
                                <img 
                                    src={postAvatarUrl} 
                                    alt="avatar" 
                                    style={{ width: "35px", height: "35px", borderRadius: "50%", marginRight: "10px", objectFit: "cover" }} 
                                />
                                <div style={{flex:1}}>
                                    <div style={{ fontWeight: "bold", fontSize: "14px" }}>
                                        {postAuthorName}
                                    </div>
                                    
                                    {item.author?.username && (
                                        <div style={{ color: "gray", fontSize: "11px" }}>@{item.author.username}</div>
                                    )}

                                    <div style={{ color: "gray", fontSize: "12px" }}>
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                            <div style={{cursor:"pointer"}} onClick={() => navigate(`/post/${item.id}`)} >

                            <h1>{item.title}</h1>
                            <p
                            style={{ fontSize: "15px", margin: 0 }}>
                                {item.body  || item.description} 
                            </p>
                            </div>
                                <PostActions 
                                postId={item.id}
                                initialLikes={item.likeCount || 0}
                                commentCount={item.commentCount || 0}
                                initialIsLiked={item.isLikedByMe || false} 
                                initialIsSaved={item.isSavedByMe || false}
                                onCommentClick={() => navigate(`/post/${item.id}`)} 
                                />
                        </div>
                    );
                })
            )}
        </div>
    )
}

export default UserPost;