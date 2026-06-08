import React, { useState,useEffect } from "react";

interface createPostProps{
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (newPost: any) => void
}

const CreatePostDetail: React.FC<createPostProps> = ({isOpen, onClose, onSuccess}) => {
    const[title,setTitle] = useState('');
    const[body,setBody] = useState('');
    const[imageUrl,setImageUrl] = useState<File | null>(null);
    const [imagePreview, setImagePreview]= useState<string | null>(null);

    const [loading, setLoading] = useState(false);
    const[errorMessage, setErrorMessage] = useState('');
    
    if (!isOpen) return null;

    const token = localStorage.getItem("token");


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageUrl(file);
            setImagePreview(URL.createObjectURL(file)); 
        }
    };


    const handleRemoveImage = () => {
        setImageUrl(null);
        setImagePreview(null);
    };

    const handleCreatePost = async(e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        if (!token) {
            return;
        }

        if(!body.trim() && !title.trim()){
            alert("postingan tidak boleh kosong");
            return;
        }
        setLoading(true);

        try{

            const formData = new FormData();
            formData.append("title",title);
            formData.append("body", body);

            if (imageUrl) {
                formData.append("imageUrl", imageUrl);
            }

            const response = await fetch (`http://localhost:5000/api/posts/`, {
                method: 'POST',
                headers : {
                    "Authorization": `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                body: formData,
            });

            if(!response.ok){
                throw new Error("Gagal memuat postingan");
            }

            const newPost = await response.json();

            setTitle("");
            setBody("");
            handleRemoveImage();
            onSuccess(newPost);
            onClose();


        } catch (error:any){
            setErrorMessage(error.message);
        }
        finally{
            setLoading(false);
        }
    }
    return (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
            
            {/* Kotak Modal */}
            <div style={{ backgroundColor: "white", width: "100%", maxWidth: "500px", borderRadius: "12px", padding: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", position: "relative" }}>
                
                <button onClick={onClose} style={{ position: "absolute", top: "15px", right: "15px", background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#666" }}>
                    &times;
                </button>

                <h2 style={{ marginTop: 0, borderBottom: "1px solid #eee", paddingBottom: "15px" }}>Buat Postingan Baru</h2>

                <form onSubmit={handleCreatePost} style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "15px" }}>
                    
                    <input 
                        type="text" 
                        placeholder="Title" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc", outline: "none", fontSize: "15px" }}
                        disabled={loading}
                    />

                    <textarea 
                        placeholder="Share what is on your mind" 
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc", outline: "none", minHeight: "120px", fontSize: "15px", resize: "none" }}
                        disabled={loading}
                        required
                    />

                    {imagePreview && (
                        <div style={{ position: "relative", width: "100%", maxHeight: "300px", overflow: "hidden", borderRadius: "8px", border: "1px solid #eee" }}>
                            <img src={imagePreview} alt="Preview" style={{ width: "100%", height: "auto", objectFit: "cover" }} />
                            <button 
                                type="button"
                                onClick={handleRemoveImage}
                                style={{ position: "absolute", top: "10px", right: "10px", backgroundColor: "rgba(0,0,0,0.6)", color: "white", border: "none", borderRadius: "50%", width: "30px", height: "30px", cursor: "pointer", fontWeight: "bold" }}
                            >
                                &times;
                            </button>
                        </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #eee", paddingTop: "15px" }}>
                        
                        <label style={{ cursor: "pointer", color: "#2563eb", fontWeight: "bold", fontSize: "14px", display: "flex", alignItems: "center", gap: "5px" }}>
                            <span>🗀</span>
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageChange} 
                                style={{ display: "none" }} 
                                disabled={loading}
                            />
                        </label>

                        <button 
                            type="submit" 
                            disabled={loading || !body.trim()}
                            style={{ padding: "10px 24px", backgroundColor: !body.trim() ? "#ccc" : "#000", color: "white", borderRadius: "30px", border: "none", fontWeight: "bold", cursor: !body.trim() ? "not-allowed" : "pointer", transition: "all 0.2s" }}
                        >
                            {loading ? "Memposting..." : "Posting"}
                        </button>

                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreatePostDetail;