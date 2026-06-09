import { useState,useEffect } from "react";
import { useNavigate,useParams } from "react-router-dom";
import React from "react";

interface DeletePostProps {
    postId: string;
    onDeleteSuccess: (postId: string) => void;
}

const DeletePost: React.FC<DeletePostProps>= ({postId, onDeleteSuccess}) => {

    const navigate = useNavigate();
    const [isDeleting, setIsDeleting] = useState(false);
    const token = localStorage.getItem("token");
    const handleDelete = async () => {
        if (!token) return;
        const confirmDelete = window.confirm("Yakin ingin menghapus?");

        if (!confirmDelete) return;
        setIsDeleting(true);
        try{
            const response = await fetch(`http://localhost:5000/api/posts/${postId}/delete`, {
                method: "POST",
                headers: {
                    "Authorization" : `Bearer ${token}`
                }

            })
            if (!response.ok){
                throw new Error ("gagal menghapus postingan");
            }
            
            onDeleteSuccess(postId);
            navigate('/profile');
        }
        catch(error){
            console.error(error);
            alert("ada error");
            setIsDeleting(false);
        }
    }

    return(
        <button 
            onClick={handleDelete}
            disabled={isDeleting}
            style={{
                background: "none",
                border: "none",
                color: isDeleting ? "gray" : "#dc2626", 
                fontSize: "27px",
                fontWeight: "bold",
                cursor: isDeleting ? "not-allowed" : "pointer",
                padding: "4px 8px",
                borderRadius: "4px",
                transition: "background 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#fee2e2"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
            {isDeleting ? "🗑 Menghapus..." : "🗑"}
        </button>
    )
}

export default DeletePost