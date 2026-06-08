import { useState, useEffect } from "react";
import React from "react";

const SelectSkillForm: React.FC = () => {
    const [availableSkills, setAvailableSkills] = useState<any[]>([]);
    const [selectedSkillId, setSelectedSkillId] = useState<string>("");
    const [mySkills, setMySkills] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchSkills = async () => {
            setLoading(true);
            try {
                if (!token) return;
                const response = await fetch(`http://localhost:5000/api/skill`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });
                if (!response.ok) throw new Error("Gagal mengambil daftar skill");
                const data = await response.json();
                setAvailableSkills(data || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchSkills();
    }, [token]);

    const handleAddSkill = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!selectedSkillId) return;

        setLoading(true);
        try {
            if (!token) return;
            const response = await fetch(`http://localhost:5000/api/skill/addskill/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ skillId: selectedSkillId }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Gagal menambahkan/menarik skill", data);
            } else {
                if (data.skill) {
                    setMySkills((prev) => {
                        if (prev.find((s) => s.id === data.skill.id)) return prev;
                        return [...prev, data.skill];
                    });
                } else if (data.message) {
                    setMySkills((prev) => prev.filter((s) => s.id !== selectedSkillId));
                }
                setSelectedSkillId("");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", maxWidth: "400px", backgroundColor: "white" }}>
            <h3 style={{ marginTop: 0 }}>Keahlian Saya</h3>

            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                
                <select
                    value={selectedSkillId}
                    onChange={(e) => setSelectedSkillId(e.target.value)}
                    style={{ flex: 1, padding: "8px 12px", borderRadius: "6px", border: "1px solid #ccc", outline: "none" }}
                    disabled={loading || availableSkills.length === 0}
                >
                    <option value="" disabled>
                        -- Pilih Keahlian --
                    </option>
                    {availableSkills.map((skill) => (
                        <option key={skill.id} value={skill.id}>
                            {skill.name}
                        </option>
                    ))}
                </select>

                <button
                    type="button" 
                    onClick={handleAddSkill}
                    disabled={loading || !selectedSkillId}
                    style={{ padding: "8px 16px", borderRadius: "6px", backgroundColor: selectedSkillId ? "#000" : "#ccc", color: "#fff", border: "none", cursor: selectedSkillId && !loading ? "pointer" : "not-allowed" }}
                >
                    {loading ? "..." : "Tambah"}
                </button>
                
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {mySkills.length === 0 ? (
                    <span style={{ fontSize: "14px", color: "gray" }}>Belum ada skill yang ditambahkan.</span>
                ) : (
                    mySkills.map((skillItem) => (
                        <div key={skillItem.id} style={{ padding: "6px 12px", backgroundColor: "#f0f2f5", borderRadius: "20px", fontSize: "13px", fontWeight: "bold", border: "1px solid #e4e6eb" }}>
                            {skillItem.name}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SelectSkillForm;