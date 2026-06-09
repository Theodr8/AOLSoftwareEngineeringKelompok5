import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
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
            height: "100vh", 
            display: "flex", 
            flexDirection: "column", 
            boxSizing: "border-box" ,
            position: "fixed"
        }}>
            <h2>GoDev</h2>
            
            <nav style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <NavLink to="/dashboard" style={({ isActive }) => ({
                    textDecoration: "none",
                    fontSize: "18px",
                    fontWeight: isActive ? "bold" : "normal",
                    color: isActive ? "#1800ad" : "#666" 
                })}>
                        Home
                </NavLink>
                <NavLink to="/explore" style={({ isActive }) => ({
                    textDecoration: "none",
                    fontSize: "18px",
                    fontWeight: isActive ? "bold" : "normal",
                    color: isActive ? "#1800ad" : "#666" 
                })}>
                        Explore
                </NavLink>
                <NavLink to="/project"  style={({ isActive }) => ({
                    textDecoration: "none",
                    fontSize: "18px",
                    fontWeight: isActive ? "bold" : "normal",
                    color: isActive ? "#1800ad" : "#666" 
                })}>
                        Project
                </NavLink>
                <NavLink to="/chat" style={({ isActive }) => ({
                    textDecoration: "none",
                    fontSize: "18px",
                    fontWeight: isActive ? "bold" : "normal",
                    color: isActive ? "#1800ad" : "#666" 
                })}>
                        Chat
                </NavLink>
                {/* <navlink>Analytics</navlink> */}
            </nav>

            <div style={{  paddingTop: "350px" }}>
                
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