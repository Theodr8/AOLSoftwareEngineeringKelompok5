import { useState,useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostComment from "../component/PostComment";
import Navbar from "../component/Navbar";
import PostActions from "../component/postComponent";
import DeletePost from "../component/DeletePost";


const PostDetail = () => {
    const {postId} = useParams();
    const navigate = useNavigate();
    const [loading,setLoading] = useState(true);
    const [post, setPost] = useState<any>(null);
    const myId = localStorage.getItem("id");


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        const fetchPost = async () => {
            try{
                const response = await fetch(`http://localhost:5000/api/posts/${postId}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                if (!response.ok){
                    throw new Error("Gagal memuat postingan")
                }
                const data = await response.json();
                setPost(data);
                console.log(data);
            }
            catch(error){
                console.error(error);
            }
            finally{
                setLoading(false);
            }
        }
        fetchPost();
    }, [postId, navigate])


    if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Memuat profil...</p>;
    if (!post) return <p style={{ textAlign: "center", marginTop: "50px" }}>Postingan tidak ditemukan.</p>;



    const handleRemovePostFromUI = (deletedPostId: string) => {
        // Filter out (buang) post yang ID-nya sama dengan yang baru dihapus
        setPost(prevPosts => prevPosts.filter(post => post.id !== deletedPostId));
    };

    return (
<div style={{ display: "flex", backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
            <Navbar />

            <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
                <div style={{ maxWidth: "700px", margin: "0 auto", backgroundColor: "white", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", padding: "30px" }}>
                    
                    <div style={{display: "flex", justifyContent:"space-between"}}>

                    <button 
                        onClick={() => navigate(-1)} 
                        style={{ display: "flex", alignItems: "center", background: "none", border: "none", color: "gray", cursor: "pointer", fontSize: "14px", marginBottom: "20px", padding: 0 }}
                        >
                        ← Kembali
                    </button>

                        {post.author.id === myId && (
                            <DeletePost 
                            postId={post.id} 
                            onDeleteSuccess={handleRemovePostFromUI} 
                            />
                        )}
                    </div>

                    <div onClick={() => {
                            if (post.author?.id && post.author.id !== myId) {
                                navigate(`/user/${post.author.id}`);
                            }
                            else {
                                navigate(`/profile`)
                            }
                        }
                    }                 
                    style={{ cursor:"pointer", display: "flex", alignItems: "center", marginBottom: "20px" }}>
                        <img 
                            src={post.author?.avatarUrl ? `http://localhost:5000${post.author.avatarUrl}` : "https://via.placeholder.com/50"} 
                            alt="avatar" 
                            style={{ width: "50px", height: "50px", borderRadius: "50%", marginRight: "15px", objectFit: "cover" }} 
                        />
                        <div>
                            <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                                {post.author?.displayName || "User Tidak Diketahui"}
                            </div>
                            <div style={{ color: "gray", fontSize: "14px" }}>
                                {post.author?.username ? `@${post.author.username}` : ""}
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        {post.title && (
                            <h2 style={{ marginTop: 0, marginBottom: "10px", fontSize: "22px" }}>{post.title}</h2>
                        )}
                        <p style={{ fontSize: "18px", lineHeight: "1.6", margin: 0, whiteSpace: "pre-wrap" }}>
                            {post.body}
                        </p>

                        {post.imageUrl && (
                            <div style={{ marginTop: "15px", borderRadius: "8px", overflow: "hidden", border: "1px solid #eee" }}>
                                <img 
                                    src={post.imageUrl ? `http://localhost:5000${post.imageUrl}` : "error"}  
                                    alt="Image post" 
                                    style={{ 
                                        width: "100%", 
                                        maxHeight: "500px", 
                                        objectFit: "cover", 
                                        display: "block" 
                                    }} 
                                />
                            </div>
                        )}
                        
                    </div>

                    <div style={{ color: "gray", fontSize: "13px", paddingBottom: "15px", borderBottom: "1px solid #eee", marginBottom: "20px" }}>
                        {new Date(post.createdAt).toLocaleString()}
                    </div>

                    <PostActions 
                    postId={post.id}
                    initialLikes={post._count.likes || 0}
                    commentCount={post._count.comments || 0}
                    initialIsLiked={post.isLikedByMe || false} 
                    initialIsSaved={post.isSavedByMe || false}
                    onCommentClick={() => navigate(`/post/${post.id}`)} 
                    />

                    {postId && (
                        <PostComment postId={postId} />
                    )}

                </div>
            </div>
        </div>
    );
}

export default PostDetail;