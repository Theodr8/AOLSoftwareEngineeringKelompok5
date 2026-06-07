import { useState,useEffect } from "react";
import React from "react";

interface PostActionsProps {
    postId: string;
    initialLikes: number;
    commentCount: number;
    initialIsLiked: boolean;
    initialIsSaved: boolean;
    onCommentClick: () => void; 
}

const PostActions: React.FC<PostActionsProps> = ({ 
    postId, 
    initialLikes, 
    commentCount,
    initialIsLiked, 
    initialIsSaved,
    onCommentClick 
}) => {
    // State lokal agar UI berubah secara instan (Real-time) saat diklik
    const [likesCount, setLikesCount] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [isSaved, setIsSaved] = useState(initialIsSaved);

    const token = localStorage.getItem("token");


    
    const handleLike = async () => {
        try {
            setIsLiked(!isLiked);
            setLikesCount(prev => isLiked ? prev - 1 : prev + 1);

            const response = await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!response.ok) throw new Error();
        } catch (error) {
            setIsLiked(isLiked);
            setLikesCount(likesCount);
            alert("Gagal menyukai postingan");
        }
    };

    const handleSave = async () => {
        try {
            setIsSaved(!isSaved);
            
            const response = await fetch(`http://localhost:5000/api/posts/${postId}/save`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!response.ok) throw new Error();
        } catch (error) {
            setIsSaved(isSaved);
            alert("Gagal menyimpan postingan");
        }
    };

    const handleShare = () => {
        const postUrl = `${window.location.origin}/post/${postId}`;
        navigator.clipboard.writeText(postUrl);
        alert("Link postingan berhasil disalin ke clipboard!");
    };

    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "15px", paddingTop: "10px", borderTop: "1px solid #eee" }}>
            
            <div style={{ display: "flex", gap: "20px" }}>
                
                <button onClick={handleLike} style={{ display: "flex", alignItems: "center", gap: "5px", background: "none", border: "none", cursor: "pointer", color: isLiked ? "red" : "black", fontSize: "14px" }}>
                    {isLiked ? "❤" : "♡"} <span style={{ color: "black" }}>{likesCount}</span>
                </button>

                <button onClick={onCommentClick} style={{ display: "flex", alignItems: "center", gap: "5px", background: "none", border: "none", cursor: "pointer", fontSize: "14px" }}>
                    {commentCount} Comment 💬
                </button>

                <button onClick={handleShare} style={{ display: "flex", alignItems: "center", gap: "5px", background: "none", border: "none", cursor: "pointer", fontSize: "14px" }}>
                    Share
                </button>

            </div>

            <div>
                <button onClick={handleSave} style={{ background: "none", border: "none", cursor: "pointer", color: isSaved ? "blue" : "black", fontSize: "14px" }}>
                    {isSaved ? "Saved ⛉" : "Save"}
                </button>
            </div>

        </div>
    );
};

export default PostActions;