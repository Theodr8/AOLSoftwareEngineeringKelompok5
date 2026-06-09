import React, { useState,useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const CreatePost = () => {
    const[body,setBody] = useState('');
    const[title,setTitle] = useState('');
    // const[imageUrl,setImageUrl] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    
    const navigate = useNavigate();

    const handleCreatePost = async(e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        try{
            const response = await fetch ("http://localhost:5000/api/posts/", {
                method: 'POST',
                headers : {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({title,body}),
            });

            const data = await response.json();

            if (!response.ok){
                throw new Error(data.message || 'create posts failed');
            }
            
            setTitle("");
            setBody("");
            alert ("berhasil posting");

        } catch (error:any){
            setErrorMessage(error.message);
        }
    }
    return (
        <form onSubmit={handleCreatePost} style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
        <input type = "text" placeholder="Put your title" 
        value={title} onChange={(e) => setTitle(e.target.value)} 
        style={{ width: "30%", border: "none", outline: "none", fontSize: "16px" }}/>
        
        <hr style={{opacity:"40%"}}></hr>
        <input type="text" placeholder="What's compiling?" 
        value={body} onChange={(e) => setBody(e.target.value)} required
        style={{ width: "100%", border: "none", outline: "none", fontSize: "16px" }} />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                <button type="submit" style={{ background: "black", color: "white", padding: "8px 16px", borderRadius: "20px", border: "none" }}>Post</button>
            </div>
        {/* <input type="text" value={imageUrl} onChange={(e) => setImageUrl("")} /> */}
        </form> 
    )
}

export default CreatePost;