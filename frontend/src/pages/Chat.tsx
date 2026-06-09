import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client"


// Menerima ID dan Nama teman chat dari komponen induk (misal halaman Profile atau MessageList)
interface ChatRoomProps {
    targetUserId: string;
    targetUserName: string;
    targetUserAvatarUrl: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ targetUserId, targetUserName, targetUserAvatarUrl }) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const myId = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    
    // Referensi untuk auto-scroll
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fungsi untuk menggulir layar ke pesan paling bawah
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // auto-scroll ketika pesan baru masuk 
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const fetchMessages = async () => {
            if (!targetUserId) return;
            try {
                const response = await fetch(`http://localhost:5000/api/chat/${targetUserId}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setMessages(data);
                }
            } catch (error) {
                console.error("Gagal menarik riwayat pesan:", error);
            }
        };

        fetchMessages();
    }, [targetUserId, token]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/chat/${targetUserId}/send`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ body: newMessage })
                
            });

            if (response.ok) {
                const sentMessage = await response.json();
                
                setMessages((prev) => [...prev, sentMessage]);
                setNewMessage(""); 
            } else {
                alert("Gagal mengirim pesan");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
      };

      useEffect(() => {
          console.log("ID Saya dari localStorage:", myId); 
          if (!myId) {
              return;
          }

          const socket = io("http://localhost:5000", {
              transports: ["websocket", "polling"]
          });

          socket.on("connect", () => {
              
              socket.emit("join_chat", myId);
          });

          socket.on("pesanBaru", (pesanMasuk) => {
              console.log("[SOCKET FRONTEND] Pesan baru tertangkap!", pesanMasuk);

              if (pesanMasuk.senderId === targetUserId) {
                  console.log("[SOCKET FRONTEND] Pesan cocok, memasukkan ke layar...");
                  setMessages((prevMessages) => [...prevMessages, pesanMasuk]);
              }
          });

          return () => {
              socket.disconnect();
          };
      }, [myId, targetUserId]);

    const getImageUrl = (url: string | null | undefined) => {
        if (!url) return "https://via.placeholder.com/40"; 

        if (url.startsWith("http://") || url.startsWith("https://")) {
            return url;
        }

        return `http://localhost:5000${url}`;
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", backgroundColor: "#fff" }}>
            
            <div style={{ display: "flex", paddingTop:"120px",padding: "20px 30px", borderBottom: "1px solid #eaeaea", backgroundColor: "#fff", alignItems: "center" }}>

                    <img 
                        src={getImageUrl(targetUserAvatarUrl)} 
                        alt={targetUserName} 
                        style={{ width: "45px", height: "45px", borderRadius: "50%", marginRight: "15px", objectFit: "cover" }}
                        />                    
                    <h3 style={{ margin: 0, fontSize: "16px", color: "black ", textTransform: "uppercase" }}>
                        {targetUserName}
                    </h3>
                
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "30px", display: "flex", flexDirection: "column", gap: "15px", backgroundColor: "#fff" }}>
                {messages.length === 0 ? (
                    <div style={{ textAlign: "center", color: "#9ca3af", margin: "auto" }}>
                        Start a conversation with {targetUserName}
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.senderId === myId;
                        
                        return (
                            <div key={msg.id} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start" }}>
                                <div style={{
                                    maxWidth: "65%",
                                    padding: "12px 18px",
                                    backgroundColor: isMe ? "black" : "#f1f3f5",
                                    color: isMe ? "#fff" : "#1f2937",
                                    fontSize: "14px",
                                    lineHeight: "1.5",
                                    wordWrap: "break-word",
                                    borderRadius: "8px",
                                    borderTopRightRadius: isMe ? "0px" : "8px",
                                    borderTopLeftRadius: !isMe ? "0px" : "8px",
                                }}>
                                    {msg.body}
                                </div>
                            </div>
                        );
                    })
                )}
                {/* Elemen pancingan agar scroll selalu ke bawah */}
                <div ref={messagesEndRef} /> 
            </div>

            {/* 5. AREA INPUT PESAN (Disesuaikan agar lebih minimalis) */}
            <form onSubmit={handleSendMessage} style={{ display: "flex", padding: "20px 30px", borderTop: "1px solid #eaeaea", gap: "15px", backgroundColor: "#fff", alignItems: "center" }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Write your message"
                    style={{ flex: 1, padding: "15px 0", border: "none", outline: "none", fontSize: "15px", color: "#333", backgroundColor: "transparent" }}
                    disabled={loading}
                />
                
                {/* Tombol Kirim kotak hitam seperti di desain */}
                <button
                    type="submit"
                    disabled={loading || !newMessage.trim()}
                    style={{ 
                        padding: "12px 16px", 
                        borderRadius: "8px", 
                        border: "none", 
                        backgroundColor: !newMessage.trim() ? "#e0e0e0" : "#000", 
                        color: "#fff", 
                        cursor: !newMessage.trim() ? "not-allowed" : "pointer", 
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "background 0.2s"
                    }}
                >
                    {loading ? "..." : (
                        // Ikon Paper Plane (opsional, jika kamu pakai lucide-react atau sejenisnya)
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path></svg>
                    )}
                </button>
            </form>
        </div>
    );
};

export default ChatRoom;