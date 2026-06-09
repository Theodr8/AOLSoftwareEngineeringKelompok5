import { useState,useEffect } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";

interface PostCommentProps {
    postId: string;
}

const PostComment: React.FC<PostCommentProps> = ({postId}) => {
    const [comments, setComments] = useState<any[]>([]);
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    // const token = localStorage.getItem("token");

    const token = localStorage.getItem("token");
    useEffect(()=> {
        if (!token) {
            navigate("/login");
            return;
        }
        const fetchComment = async() => {
            try{
                const response = await fetch(`http://localhost:5000/api/posts/${postId}/comment`, {
                    method : "GET",
                    headers : {
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (!response.ok) throw new Error("gagal memuat komentar");

                const data = await response.json();
                setComments(data);
            }
            catch(error){
                console.error(error);
            }
            finally{
                setLoading(false)
            }
        };
        fetchComment();
    },[postId,token, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;
        try{
            const response = await fetch(`http://localhost:5000/api/posts/${postId}/postcomment`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ body:inputText })

            });
            if (!response.ok) throw new Error("gagal mengirim komentar")
            
            const newComment = await response.json();

            setComments((prev) => [...prev, newComment]);
            setInputText("");
        }
        catch(error){
            alert("gagal mengirim komentar")
        }
    };

    if (loading) return <div style={{ fontSize: "12px", color: "gray", padding: "10px 0" }}>Memuat komentar...</div>;

    const getImageUrl = (url: string | null | undefined) => {
        if (!url) return "https://via.placeholder.com/40"; 

        if (url.startsWith("http://") || url.startsWith("https://")) {
            return url;
        }

        return `http://localhost:5000${url}`;
    };

    return (
        <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px dashed #eee" }}>
            
            {/* DAFTAR KOMENTAR */}
            <div style={{ maxHeight: "200px", overflowY: "auto", marginBottom: "15px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {comments.length === 0 ? (
                    <p style={{ color: "gray", fontSize: "12px", textAlign: "center", margin: 0 }}>Belum ada komentar. Jadilah yang pertama!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} style={{ display: "flex", gap: "10px" }}>
                            <img 
                                src={getImageUrl(comment.author.avatarUrl)} 
                                alt="avatar" 
                                style={{ width: "25px", height: "25px", borderRadius: "50%", objectFit: "cover" }} 
                            />
                            <div style={{ backgroundColor: "#f0f2f5", padding: "8px 12px", borderRadius: "15px", fontSize: "13px", flex: 1 }}>
                                <span style={{ fontWeight: "bold", marginRight: "5px" }}>
                                    {comment.author?.displayName || "User"}
                                </span>
                                {comment.text || comment.body}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px" }}>
                <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Tulis komentar..." 
                    style={{ flex: 1, padding: "8px 12px", borderRadius: "20px", border: "1px solid #ccc", outline: "none", fontSize: "13px" }}
                />
                <button 
                    type="submit" 
                    disabled={!inputText.trim()} 
                    style={{ background: "none", border: "none", color: inputText.trim() ? "blue" : "gray", fontWeight: "bold", cursor: inputText.trim() ? "pointer" : "not-allowed" }}
                >
                    Kirim
                </button>
            </form>
        </div>
    )
}

export default PostComment;