import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatRoom from "./Chat"; 
import Navbar from "../component/Navbar";

const ChatPage: React.FC = () => {
    const { targetUserId } = useParams<{ targetUserId: string }>();
    const navigate = useNavigate();
    const [contacts, setContacts] = useState<any[]>([]);
    const [loadingContacts, setLoadingContacts] = useState(true);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/chat", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setContacts(data);
                }
            } catch (error) {
                console.error("Gagal menarik kontak", error);
            } finally {
                setLoadingContacts(false);
            }
        };
        fetchContacts();
    }, [token]);

        const getImageUrl = (url: string | null | undefined) => {
            if (!url) return "https://via.placeholder.com/40"; 

            if (url.startsWith("http://") || url.startsWith("https://")) {
                return url;
            }

            return `http://localhost:5000${url}`;
        };

    // Cari data lengkap user target berdasarkan ID di URL
    const activeContact = contacts.find(c => c.userId === targetUserId);

    return (
        <div style={{ display: "flex", height: "100vh", backgroundColor: "#fff" }}>
            
            <Navbar />

            <div style={{ marginLeft:"250px", width: "350px", borderRight: "1px solid #eaeaea", display: "flex", flexDirection: "column" }}>
                <div style={{ backgroundColor:"white" , width: "100%", position:"fixed", padding: "20px", borderBottom: "1px solid #eaeaea" }}>
                    <div style={{ color: "black", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                        <h2 style={{ margin: 0, fontSize: "24px" }}>Messages</h2>
                    </div>
                </div>

                {/* List Kontak */}
                <div style={{ flex: 1, marginTop:"75px", overflowY: "auto" }}>
                    {loadingContacts ? (
                        <p style={{ textAlign: "center", marginTop: "20px", color: "gray" }}>Loading contacts...</p>
                    ) : (
                        contacts.map((contact) => (
                            <div 
                                key={contact.userId} 
                                onClick={() => navigate(`/chat/${contact.userId}`)}
                                style={{ 
                                    display: "flex", 
                                    alignItems: "center", 
                                    padding: "15px 20px", 
                                    cursor: "pointer",
                                    borderBottom: "1px solid #f5f5f5",
                                    // Highlight abu-abu terang jika kontak ini sedang aktif dipilih
                                    backgroundColor: targetUserId === contact.userId ? "#e0e0e0" : "transparent" 
                                }}
                            >
                                <img 
                                    src={getImageUrl(contact.avatarUrl)} 
                                    alt={contact.displayName} 
                                    style={{ width: "45px", height: "45px", borderRadius: "50%", marginRight: "15px", objectFit: "cover" }}
                                />
                                <div>
                                    <div style={{ fontWeight: "bold", color: "#000" }}>{contact.displayName}</div>
                                    <div style={{ fontSize: "13px", color: "gray" }}>@{contact.username}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* chat aktif */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                {targetUserId ? (
                    <ChatRoom 
                        targetUserId={targetUserId} 
                        targetUserName={activeContact?.displayName || "Loading..."} 
                        targetUserAvatarUrl={activeContact?.avatarUrl || "Loading.."}
                    />
                ) : (
                    <div style={{ display: "flex", flex: 1, justifyContent: "center", alignItems: "center", color: "gray", flexDirection: "column" }}>
                        <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01"></path></svg>
                        <h2 style={{ marginTop: "10px", color: "#333" }}>Your Messages</h2>
                        <p>Select a contact from the list to start chatting.</p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default ChatPage;