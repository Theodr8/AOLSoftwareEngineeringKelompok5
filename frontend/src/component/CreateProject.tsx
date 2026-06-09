import React, { useState,useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

interface CreateProjectProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (project: any) => void;
}

const CreateProject: React.FC<CreateProjectProps> = ({isOpen, onClose, onSuccess}) => {
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");
    const [availableTags, setAvailableTags] = useState<any[]>([]);
    const [selectedTagId, setSelectedTagId] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    
    const navigate = useNavigate();
    useEffect(() => {
        const fetchTags = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch(
                    "http://localhost:5000/api/tags",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            setAvailableTags(data || []);
        } catch (error) {
            console.error(error);
        }
    };
        if(isOpen){
            fetchTags();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleCreateProject = async(e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setLoading(true);

        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        try{
            const response = await fetch ("http://localhost:5000/api/projects/", {
                method: 'POST',
                headers : {
                    "Authorization": `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                body: JSON.stringify({title, description, tagId: selectedTagId}),
            });

            const data = await response.json();
            console.log("Response:", data);

            if (!response.ok){
                // throw new Error(data.message || 'create projects failed');
                throw new Error(
        JSON.stringify(data)
    );
            }
            onSuccess(data);
            setTitle("");
            setDescription("");
            setSelectedTagId("");
            onClose();

        } catch (error:any){
            setErrorMessage(error.message);
        } finally{
            setLoading(false);
        }
    };
    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
            }}
        >
            <div
                style={{
                    backgroundColor: "white",
                    width: "600px",
                    maxWidth: "90%",
                    borderRadius: "12px",
                    padding: "20px",
                    boxShadow:
                        "0 4px 20px rgba(0,0,0,0.2)",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: "center",
                        marginBottom: "20px",
                    }}
                >
                    <h2
                        style={{
                            margin: 0,
                        }}
                    >
                        Create Project
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            border: "none",
                            background: "none",
                            fontSize: "22px",
                            cursor: "pointer",
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleCreateProject}
                >
                    <input
                        type="text"
                        placeholder="Project Title"
                        value={title}
                        onChange={(e) =>
                            setTitle(
                                e.target.value
                            )
                        }
                        required
                        style={{
                            width: "100%",
                            padding: "10px",
                            border:
                                "1px solid #ddd",
                            borderRadius:
                                "8px",
                            marginBottom:
                                "15px",
                        }}
                    />

                    <textarea
                        placeholder="Project Description"
                        value={description}
                        onChange={(e) =>
                            setDescription(
                                e.target.value
                            )
                        }
                        required
                        rows={5}
                        style={{
                            width: "100%",
                            padding: "10px",
                            border:
                                "1px solid #ddd",
                            borderRadius:
                                "8px",
                            resize: "vertical",
                            marginBottom:
                                "15px",
                        }}
                    />

                    <div
                        style={{
                            marginBottom:
                                "20px",
                        }}
                    >
                        <label
                            style={{
                                display:
                                    "block",
                                marginBottom:
                                    "5px",
                                fontWeight:
                                    "bold",
                            }}
                        >
                            Language
                        </label>

                        <select
                            value={
                                selectedTagId
                            }
                            onChange={(e) =>
                                setSelectedTagId(
                                    e.target
                                        .value
                                )
                            }
                            required
                            style={{
                                width:
                                    "100%",
                                padding:
                                    "10px",
                                border:
                                    "1px solid #ddd",
                                borderRadius:
                                    "8px",
                            }}
                        >
                            <option value="">
                                Select
                                Language
                            </option>

                            {availableTags.map(
                                (tag) => (
                                    <option
                                        key={
                                            tag.id
                                        }
                                        value={
                                            tag.id
                                        }
                                    >
                                        {
                                            tag.name
                                        }
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    {errorMessage && (
                        <p
                            style={{
                                color: "red",
                                marginBottom:
                                    "15px",
                            }}
                        >
                            {
                                errorMessage
                            }
                        </p>
                    )}

                    <div
                        style={{
                            display:
                                "flex",
                            justifyContent:
                                "flex-end",
                        }}
                    >
                        <button
                            type="submit"
                            disabled={
                                loading
                            }
                            style={{
                                backgroundColor:
                                    "black",
                                color:
                                    "white",
                                border:
                                    "none",
                                padding:
                                    "10px 20px",
                                borderRadius:
                                    "20px",
                                cursor:
                                    "pointer",
                            }}
                        >
                            {loading
                                ? "Posting..."
                                : "Post"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default CreateProject;