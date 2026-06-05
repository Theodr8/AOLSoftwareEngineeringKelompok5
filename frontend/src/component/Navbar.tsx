import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    // 1. Ubah inisialisasi state menjadi null karena ini menampung objek data
    const [profile, setProfile] = useState<any>(null);
    
    useEffect(() => {
        const myProfile = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                return;
            }
            try {
                const response = await fetch(`http://localhost:5000/api/users/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': "application/json"
                    },
                })
                if (!response.ok) {
                    throw new Error("Failed to fetch user");
                }
                const data = await response.json();
                setProfile(data);
            } catch (error: any) {
                console.log(error);
            }
        };
        myProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div style={{ 
            width: "250px", 
            borderRight: "1px solid #ccc", 
            padding: "20px",
            height: "100vh", // Buat tinggi navbar full layar
            display: "flex", 
            flexDirection: "column", // Susun elemen dari atas ke bawah
            boxSizing: "border-box" ,
            position: "fixed"
        }}>
            <h2>GoDev</h2>
            
            {/* flex: 1 akan mendorong elemen di bawahnya (Profile & Logout) ke dasar layar */}
            <ul style={{ listStyle: "none", padding: 0, lineHeight: "2.5", flex: 1 }}>
                <li style={{ fontWeight: "bold" }}>
                    <Link to="/dashboard" style={{ textDecoration: "none", color: "inherit" }}>
                        Home
                    </Link>
                </li>
                <li style={{ fontWeight: "bold" }}>
                    <Link to="/project" style={{ textDecoration: "none", color: "inherit" }}>
                        Project
                    </Link>
                </li>
                <li style={{ fontWeight: "bold" }}>
                    <Link to="/chat" style={{ textDecoration: "none", color: "inherit" }}>
                        Chat
                    </Link>
                </li>
                <li>Analytics</li>
            </ul>

            {/* AREA BAWAH: Profil User & Logout */}
            <div style={{ borderTop: "1px solid #eee", paddingTop: "20px" }}>
                
                {/* Tampilkan kotak profil jika data sudah berhasil di-fetch */}
                {profile && (
                    <Link to="/profile" style={{ textDecoration: "none", color: "inherit" }}>
                        <div style={{ display: "flex", alignItems: "center", marginBottom: "15px", cursor: "pointer" }}>
                            <img 
                                src={profile.avatarUrl ? `http://localhost:5000${profile.avatarUrl}` : "https://via.placeholder.com/40"} 
                                alt="avatar" 
                                style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "12px", objectFit: "cover" }} 
                            />
                            <div style={{ overflow: "hidden" }}>
                                <div style={{ fontWeight: "bold", fontSize: "14px", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                                    {profile.displayName}
                                </div>
                                <div style={{ color: "gray", fontSize: "12px", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                                    @{profile.username}
                                </div>
                            </div>
                        </div>
                    </Link>
                )}

                <button 
                    onClick={handleLogout} 
                    style={{ 
                        color: "white", 
                        backgroundColor: "black", 
                        borderRadius: "30px", 
                        padding: "10px", 
                        width: "100%", 
                        cursor: "pointer",
                        border: "none",
                        fontWeight: "bold"
                    }}
                >
                    Logout
                </button>
            </div>
            
        </div>
    );
}

export default Navbar;