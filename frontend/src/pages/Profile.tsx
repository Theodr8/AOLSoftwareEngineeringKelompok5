import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import UserPost from "../component/UserPost";

type ProfileType = {
    id?: string;
    displayName?: string;
    username?: string;
    bio?: string;
    avatarUrl?: string;
    websiteUrl?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    phoneNumber?: string;
    location?: string;
};

const containerStyle: React.CSSProperties = {
    maxWidth: 900,
    margin: "24px auto",
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
};

interface user {
  userId: string;
}

  const backendBaseUrl = "http://localhost:5000";

const Profile = () => {
    const [profile, setProfile] = useState<ProfileType | null>(null);
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const res = await fetch("http://localhost:5000/api/users/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Gagal mengambil data pengguna");
        const data = await res.json();
        setProfile(data);
      } catch (err: any) {
        setErrorMessage(err.message || "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleUpdate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!profile) return;

    try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

      const formData = new FormData();
      formData.append("displayName", profile.displayName || "");
      formData.append("username", profile.username || "");
      formData.append("bio", profile.bio || "");
      formData.append("websiteUrl", profile.websiteUrl || "");
      formData.append("linkedinUrl", profile.linkedinUrl || "");
      formData.append("githubUrl", profile.githubUrl || "");
      formData.append("location", profile.location || "");

      if (avatarFile) {
        formData.append("avatarUrl", avatarFile);
      }

        const res = await fetch("http://localhost:5000/api/users/update", {
            method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || "Gagal memperbarui profil");
        }

        setSuccessMessage("Profil berhasil diperbarui");
        setIsEditing(false);
    } catch (err: any) {
    setErrorMessage(err.message || "Terjadi kesalahan");
    }
};

    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; // Ambil file pertama yang dipilih
        if (file) {
            setAvatarFile(file); // Simpan filenya
            setAvatarPreview(URL.createObjectURL(file)); // Buat URL preview sementaranya
        }
    };

    if (loading) return <p style={{ textAlign: "center" }}>Memuat profil...</p>;
    if (!profile) return <p style={{ textAlign: "center" }}>Gagal memuat profil.</p>;

    const avatarSrc = profile.avatarUrl
      ? `${backendBaseUrl}${profile.avatarUrl}`
      : "https://img.magnific.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?semt=ais_hybrid&w=740&q=80";

  return (
    <div style={{ backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <Navbar />

      <div style={containerStyle}>
        <div style={{ height: 220, background: "linear-gradient(90deg,#eef2ff,#f8fafc)", position: "relative" }}>
          <div style={{ position: "absolute", right: 18, top: 18 }}>
            <button
              onClick={() => setIsEditing((v) => !v)}
              style={{
                border: "1px solid #d1d5db",
                background: "#fff",
                padding: "8px 12px",
                borderRadius: 20,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>

        <div style={{ display: "flex", padding: "24px", gap: 24, alignItems: "flex-start" }}>
          <div style={{ width: 180 }}>
            <div style={{ width: 150, height: 150, borderRadius: "50%", overflow: "hidden", boxShadow: "0 6px 18px rgba(0,0,0,0.08)" }}>
              <img
                src={avatarSrc}
                alt="avatar"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ margin: 0 }}>{profile.displayName}</h2>
                <p style={{ margin: 4, color: "#6b7280" }}>@{profile.username}</p>
              </div>
              <div style={{ color: "#6b7280", fontSize: 13 }}>{profile.location}</div>
            </div>

            <p style={{ marginTop: 12, color: "#374151" }}>{profile.bio || "Belum ada bio. Klik Edit untuk menambahkan."}</p>

            <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
                {profile.githubUrl && <a href={profile.githubUrl} style={{ color: "#111827" }}>{profile.githubUrl.replace("https://", "")}</a>}
                {profile.websiteUrl && <a href={profile.websiteUrl} style={{ color: "#111827" }}>{profile.websiteUrl.replace("https://", "")}</a>}
            </div>
            </div>
        </div>
        
        <UserPost 
            userId={profile.id || ""} 
            displayName={profile.displayName || ""} 
            avatarUrl={profile.avatarUrl || ""} 
        />

        {successMessage && <p style={{ color: "green", textAlign: "center", marginBottom: 12 }}>{successMessage}</p>}

        {isEditing && (
          <div style={{ padding: 24, borderTop: "1px solid #e6e9ee", background: "#fbfdff" }}>
            <form onSubmit={handleUpdate} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ gridColumn: "1 / 3", display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 120, display: "flex", flexDirection: "column", gap: "10px" }}>
                    
                    <img 
                        src={
                            avatarPreview || 
                            (profile.avatarUrl ? `http://localhost:5000${profile.avatarUrl}` : "https://img.magnific.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?semt=ais_hybrid&w=740&q=80")
                        } 
                        alt="avatar-preview" 
                        style={{ width: 120, height: 120, borderRadius: 8, objectFit: "cover", border: "1px solid #ccc" }} 
                    />
                    
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageChange} 
                        style={{ width: "100%", fontSize: "12px" }} 
                    />

                </div>
                <div>
                  <label style={{ display: "block", fontWeight: 600 }}>Display Name</label>
                  <input value={profile.displayName || ""} onChange={(e) => setProfile({ ...profile, displayName: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 600 }}>Username</label>
                <input value={profile.username || ""} onChange={(e) => setProfile({ ...profile, username: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 600 }}>Location</label>
                <input value={profile.location || ""} onChange={(e) => setProfile({ ...profile, location: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
              </div>

              <div style={{ gridColumn: "1 / 3" }}>
                <label style={{ display: "block", fontWeight: 600 }}>Bio</label>
                <textarea value={profile.bio || ""} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} rows={3} style={{ width: "100%", padding: 8, marginTop: 6 }} />
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 600 }}>Website</label>
                <input value={profile.websiteUrl || ""} onChange={(e) => setProfile({ ...profile, websiteUrl: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 600 }}>LinkedIn</label>
                <input value={profile.linkedinUrl || ""} onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 600 }}>GitHub</label>
                <input value={profile.githubUrl || ""} onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 6 }} />
              </div>
 
              <div style={{ gridColumn: "1 / 3", display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 6 }}>
                <button type="button" onClick={() => setIsEditing(false)} style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", cursor: "pointer" }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: "10px 16px", borderRadius: 8, background: "#111827", color: "#fff", border: "none", cursor: "pointer" }}>
                  Save Changes
                </button>
              </div>
            </form>
            {errorMessage && <p style={{ color: "#b91c1c", marginTop: 12 }}>{errorMessage}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
