import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client"


// Menerima ID dan Nama teman chat dari komponen induk (misal halaman Profile atau MessageList)
interface ChatRoomProps {
    targetUserId: string;
    targetUserName: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ targetUserId, targetUserName }) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const myId = localStorage.getItem("id"); // ID kamu yang sedang login
    const token = localStorage.getItem("token");
    
    // Referensi untuk auto-scroll
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fungsi untuk menggulir layar ke pesan paling bawah
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Panggil auto-scroll setiap kali array messages berubah
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
                
                // Tambahkan pesan baru ke layar seketika tanpa perlu me-refresh API
                setMessages((prev) => [...prev, sentMessage]);
                setNewMessage(""); // Kosongkan kolom input
            } else {
                alert("Gagal mengirim pesan");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
      };
// ... (di dalam komponen ChatRoom)

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
    
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "500px", border: "1px solid #ddd", borderRadius: "12px", backgroundColor: "#fff", overflow: "hidden", maxWidth: "600px", margin: "0 auto" }}>
            
            {/* Header Ruang Chat */}
            <div style={{ padding: "15px 20px", borderBottom: "1px solid #eee", backgroundColor: "#f8f9fa", fontWeight: "bold", fontSize: "16px" }}>
                Chat dengan {targetUserName}
            </div>

            {/* Area Obrolan Utama */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "12px", backgroundColor: "#fafafa" }}>
                {messages.length === 0 ? (
                    <div style={{ textAlign: "center", color: "#9ca3af", margin: "auto" }}>
                        Belum ada pesan. Mulai sapa {targetUserName}!
                    </div>
                ) : (
                    messages.map((msg) => {
                        // Cek apakah pesan ini dikirim olehmu atau orang lain
                        const isMe = msg.senderId === myId;
                        
                        return (
                            <div key={msg.id} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start" }}>
                                <div style={{
                                    maxWidth: "75%",
                                    padding: "10px 16px",
                                    borderRadius: "20px",
                                    // Bikin sudut chat melengkung ala iMessage
                                    borderBottomRightRadius: isMe ? "4px" : "20px",
                                    borderBottomLeftRadius: !isMe ? "4px" : "20px",
                                    backgroundColor: isMe ? "#000" : "#e5e7eb",
                                    color: isMe ? "#fff" : "#1f2937",
                                    fontSize: "15px",
                                    lineHeight: "1.4",
                                    wordWrap: "break-word"
                                }}>
                                    {msg.body}
                                </div>
                            </div>
                        );
                    })
                )}
                {/* Elemen pancingan agar scrollIntoView tahu titik terbawahnya */}
                <div ref={messagesEndRef} /> 
            </div>

            {/* Area Input Pesan */}
            <form onSubmit={handleSendMessage} style={{ display: "flex", padding: "15px", borderTop: "1px solid #eee", gap: "10px", backgroundColor: "#fff" }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Ketik pesan..."
                    style={{ flex: 1, padding: "12px 16px", borderRadius: "30px", border: "1px solid #ddd", outline: "none", fontSize: "15px" }}
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading || !newMessage.trim()}
                    style={{ 
                        padding: "10px 24px", 
                        borderRadius: "30px", 
                        border: "none", 
                        backgroundColor: !newMessage.trim() ? "#d1d5db" : "#000", 
                        color: "#fff", 
                        cursor: !newMessage.trim() ? "not-allowed" : "pointer", 
                        fontWeight: "bold",
                        transition: "background 0.2s"
                    }}
                >
                    {loading ? "..." : "Kirim"}
                </button>
            </form>
        </div>
    );
};

export default ChatRoom;