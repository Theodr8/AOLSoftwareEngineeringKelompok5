import { useState, useEffect } from "react";

interface SelectProjectTagProps {
    projectId: string;
}

const SelectProjectTag = ({ projectId }: SelectProjectTagProps) => {
    const [availableTags, setAvailableTags] = useState<any[]>([]);
    const [selectedTagId, setSelectedTagId] = useState("");
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchTags = async () => {
            try {
                if (!token) return;

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

        fetchTags();
    }, [token]);

    const handleAddTag = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!selectedTagId) return;

        setLoading(true);

        try {
            const response = await fetch(
                `http://localhost:5000/api/projects/${projectId}/tag`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        tagId: selectedTagId,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                console.error(data);
                return;
            }

            console.log("Tag berhasil disimpan", data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleAddTag}>
            <label>Tag</label>

            <select
                value={selectedTagId}
                onChange={(e) =>
                    setSelectedTagId(e.target.value)
                }
            >
                <option value="">
                    -- Pilih Tag --
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
                type="submit"
                disabled={!selectedTagId || loading}
            >
                {loading ? "Loading..." : "Save"}
            </button>
        </form>
    );
};

export default SelectProjectTag;