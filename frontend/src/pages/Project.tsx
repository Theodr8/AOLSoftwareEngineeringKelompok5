import { useEffect,useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import SuggestedDevelopers from "../component/SuggestedDevelopers";
import Navbar from "../component/Navbar";
import CreateProject from "../component/CreateProject";
import ProjectActions from "../component/ProjectComponent";


const Project = () =>{
    const navigate = useNavigate();
    const myId = localStorage.getItem("id");
    // const [myId, setMyId] = useState<string | null>(localStorage.getItem("id"));
    const [activeTab, setActiveTab] = useState('foryou');
    const [projects, setProjects] = useState<any[]>([]);
    const [availableTags, setAvailableTags] = useState<any[]>([]);
    const [selectedTag, setSelectedTag] = useState("");
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");


    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleProjectCreated = (newProject: any) => {
        // Tambahkan project baru ke urutan paling atas di layar
        setProjects(prevProjects => [newProject, ...prevProjects]);
    };

    const fetchProjects = async () => {
        if (!token) {
            navigate("/login");
            return;
        }

        setLoading(true);
        setProjects([]);
        try {
            const endpoint = activeTab === "foryou"
                ? "http://localhost:5000/api/projects/foryou"
                : "http://localhost:5000/api/projects/following";

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
            setProjects(data);
        }
        catch (error) {
            console.error("ada error", error);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [activeTab, navigate]);

    useEffect(() => {
    const fetchTags = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/tags", {
                    method: "GET",
                    headers: {
                        "Authorization" : `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            setAvailableTags(data || []);
        } catch (error) {
            console.error(error);
        }
    };

    fetchTags();
}, []);

    const filteredProjects =
    selectedTag === ""
        ? projects
        : projects.filter((project) =>
              project.tags?.some(
                  (pt: any) =>
                      pt.tag.id === selectedTag
              )
          );

    return(
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
        <div
    style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
    }}
>
    <select
        value={selectedTag}
        onChange={(e) => setSelectedTag(e.target.value)}
        style={{
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
        }}
    >
        <option value="">
            Any Language
        </option>

        {availableTags.map((tag) => (
            <option
                key={tag.id}
                value={tag.id}
            >
                {tag.name}
            </option>
        ))}
    </select>

    <button
        onClick={() => setIsModalOpen(true)}
        style={{
            padding: "10px 16px",
            borderRadius: "20px",
            border: "none",
            background: "black",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
        }}
    >
        + New Project
    </button>
</div>
        {/* <CreateProject /> */}

        {loading ? (<p style={{textAlign: "center"}}>Loading...</p>) : filteredProjects.length ===0 ? 
            (<p style={{textAlign: "center"}}>No project yet</p>) : (
                filteredProjects.map((project) => (
                <div 
                    key={project.id} 
                    style={{ 
                        borderBottom: "1px solid #eee", 
                        padding: "15px 20px",
                        marginLeft: "8px",
                        marginRight: "8px" 
                        }}
                >
            <div
                onClick={() => {
                    // console.log("myId =", myId);
                    // console.log("authorId =", project.author?.id);
                    // console.log("project =", project);
                    if (project.authorId !== myId) {
                        navigate(`/user/${project.authorId}`);
                    }
                    else {
                        navigate(`/profile`)
                    }
                }}
                style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    marginBottom: "10px",
                }}
            >
                <img
                    src={
                        project.author?.avatarUrl 
                        ? `http://localhost:5000${project.author?.avatarUrl}` :
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXIdvC1Q4WL7_zA6cJm3yileyBT2OsWhBb9Q&s"
                    }
                    alt="avatar"
                    style={{
                        width: "40px",
                        height: "40px",
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
                        {project.author?.displayName}
                    </span>

                    <span
                        style={{
                            color: "gray",
                            fontSize: "13px",
                        }}
                    >
                        @{project.author?.username}
                    </span>

                    <span
                        style={{
                            color: "#999",
                            fontSize: "12px",
                        }}
                    >
                        {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </div>

            <h2
                style={{ cursor: "pointer", margin: "0 0 8px 0" }}
                onClick={() => navigate(`/project/${project.id}`)}
            >
                {project.title}
            </h2>

            <p>{project.content || project.description}</p>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "12px",
                        paddingTop: "10px",
                        borderTop: "1px solid #eee"
                    }}
>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                        }}
    >
                        <div
                            style={{
                                width: "10px",
                                height: "10px",
                                borderRadius: "50%",
                                backgroundColor: "#3776AB"
                            }}
                        />

                        <span
                            style={{
                                fontSize: "13px",
                                fontWeight: "500"
                            }}
                        >
                            {project.tags?.[0]?.tag?.name ?? "Unknown"}
                        </span>
                    </div>

                    <ProjectActions
                        projectId={project.id}
                        initialLikes={project._count.likes || 0}
                        commentCount={project._count.comments || 0}
                        initialIsLiked={project.isLikedByMe || false}
                        initialIsSaved={project.isSavedByMe || false}
                        onCommentClick={() =>
                            navigate(`/project/${project.id}`)
                        }
                    />
                </div>
                    </div>
                ))
            )}
        </div>

      {/* ================= KOLOM KANAN: WIDGET ================= */}
        <div style={{ width: "300px", borderLeft: "1px solid #ccc", padding: "20px" }}>
        <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
            <SuggestedDevelopers/>
        </div>
        </div>
                            <div style={{   height: "40px",
                                width: "40px",
                                borderBottom: "1px solid #eee" }}>
                {/* <button 
                    onClick={() => setIsModalOpen(true)}
                    style={{ padding: "15px 14px", borderRadius: "30px", border: "1px solid #ccc", backgroundColor: "white", color: "gray", cursor: "pointer", width: "100%", textAlign: "left" }}
                >
                    ╋
                </button> */}
                <CreateProject
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={handleProjectCreated} 
            />
            </div>
    </div>
    )
};

export default Project;