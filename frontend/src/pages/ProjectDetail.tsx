import { useState,useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProjectComment from "../component/ProjectComment";
import Navbar from "../component/Navbar";
import ProjectActions from "../component/ProjectComponent";
import DeleteProject from "../component/DeleteProject";


const ProjectDetail = () => {
    const {projectId} = useParams();
    const navigate = useNavigate();
    const [loading,setLoading] = useState(true);
    const [project, setProject] = useState<any>(null);
    const myId = localStorage.getItem("id");


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        const fetchProject = async () => {
            try{
                const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        // "Content-Type": "application/json"
                    }
                });
                if (!response.ok){
                    throw new Error("Gagal memuat project")
                }
                const data = await response.json();
                setProject(data);
                console.log(data);
            }
            catch(error){
                console.error(error);
            }
            finally{
                setLoading(false);
            }
        }
        fetchProject();
    }, [projectId, navigate])


    if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Memuat profil...</p>;
    if (!project) return <p style={{ textAlign: "center", marginTop: "50px" }}>Project tidak ditemukan.</p>;

    const language = project.tags?.[0]?.tag?.name || "Unknown";

    const handleRemovePostFromUI = (deletedProjId: string) => {
        // Filter out (buang) project yang ID-nya sama dengan yang baru dihapus
        setProject(prevProjects => prevProjects.filter(proj => proj.id !== deletedProjId));
    };

    const getImageUrl = (url: string | null | undefined) => {
        if (!url) return "https://via.placeholder.com/40"; 

        if (url.startsWith("http://") || url.startsWith("https://")) {
            return url;
        }

        return `http://localhost:5000${url}`;
    };

    return (
<div style={{ display: "flex", backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
            <Navbar />

            <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
                <div style={{ maxWidth: "700px", margin: "0 auto", backgroundColor: "white", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", padding: "30px" }}>
                    
                    <div style={{display: "flex", justifyContent:"space-between"}}>


                    <button 
                        onClick={() => navigate(-1)} // navigate(-1) berarti kembali ke halaman sebelumnya
                        style={{ display: "flex", alignItems: "center", background: "none", border: "none", color: "gray", cursor: "pointer", fontSize: "14px", marginBottom: "20px", padding: 0 }}
                    >
                        ← Kembali
                    </button>

                        {project.author.id === myId && (
                            <DeleteProject 
                                projectId={project.id} 
                                onDeleteSuccess={handleRemovePostFromUI} 
                            />
                        )}
                    </div>

                    <div onClick={() => {
                            if (project.author?.id && project.author.id !== myId) {
                                navigate(`/user/${project.author.id}`);
                            }
                            else {
                                navigate(`/profile`)
                            }
                        }
                    }                 
                    style={{ cursor:"pointer", display: "flex", alignItems: "center", marginBottom: "20px" }}>
                        <img 
                            src={getImageUrl(project.author.avatarUrl)} 
                            alt="avatar" 
                            style={{ width: "50px", height: "50px", borderRadius: "50%", marginRight: "15px", objectFit: "cover" }} 
                        />
                        <div>
                            <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                                {project.author?.displayName || "User Tidak Diketahui"}
                            </div>
                            <div style={{ color: "gray", fontSize: "14px" }}>
                                {project.author?.username ? `@${project.author.username}` : ""}
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        {project.title && (
                            <h2 style={{ marginTop: 0, marginBottom: "10px", fontSize: "22px" }}>{project.title}</h2>
                        )}
                        <p style={{ fontSize: "18px", lineHeight: "1.6", margin: 0, whiteSpace: "pre-wrap" }}>
                            {project.description}
                        </p>

                        {project.repositoryUrl && (
                        <div
                            style={{
                                marginTop: "20px",
                            }}
                        >
                            <a
                                href={
                                    project.repositoryUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    color: "#2563eb",
                                    textDecoration:
                                        "none",
                                }}
                            >
                                🔗 Repository URL
                            </a>
                        </div>
                    )}

                        
                    </div>

                    <div style={{ color: "gray", fontSize: "13px", paddingBottom: "10px", borderBottom: "1px solid #eee", marginBottom: "10px" }}>
                        {new Date(project.createdAt).toLocaleString()}
                    </div>

                    <div
                            style={{
                                background:
                                    "#f3f4f6",
                                padding:
                                    "6px 12px",
                                borderRadius:
                                    "20px",
                                fontSize:
                                    "14px",
                                fontWeight:
                                    "bold",
                                marginBottom: "10px",
                            }}
                        >
                            {language}
                        </div>

                    <ProjectActions 
                    projectId={project.id}
                    initialLikes={project._count.likes || 0}
                    commentCount={project._count.comments || 0}
                    initialIsLiked={project.isLikedByMe || false} 
                    initialIsSaved={project.isSavedByMe || false}
                    onCommentClick={() => navigate(`/project/${project.id}`)} 
                    />

                    {project.id && (
                        <ProjectComment projectId={project.id} />
                    )}

                </div>
            </div>
        </div>
    );
}

export default ProjectDetail;