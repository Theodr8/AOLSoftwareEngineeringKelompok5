import { useEffect, useState } from "react";
import Navbar from "../component/Navbar";
import {
  getJobs,
  toggleSaveJob,
  applyJob,
  getSavedJobs,
  getAppliedJobs,
  unapplyJob,
} from "../api/jobApi";

export default function Explore() {
  const [activeTab, setActiveTab] = useState("for-you");
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const normalizeId = (id: any) => String(id);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);

    try {
      let savedIds: string[] = [];
      let appliedIds: string[] = [];

      const resSaved = await getSavedJobs();
      savedIds = Array.isArray(resSaved.data)
        ? resSaved.data.map((j: any) =>
            normalizeId(j.id || j.jobId || j.job?.id)
          )
        : [];

      const resApplied = await getAppliedJobs();
      appliedIds = Array.isArray(resApplied.data)
        ? resApplied.data.map((j: any) =>
            normalizeId(j.id || j.jobId || j.job?.id)
          )
        : [];

      if (activeTab === "for-you") {
        const res = await getJobs();
        const mainJobs = Array.isArray(res.data) ? res.data : [];

        setJobs(
          mainJobs.map((job: any) => {
            const id = normalizeId(job.id || job.jobId);

            return {
              ...job,
              id,
              saved: savedIds.includes(id),
              applied: appliedIds.includes(id),
            };
          })
        );
      }

      if (activeTab === "saved") {
        const res = await getSavedJobs();
        const raw = Array.isArray(res.data) ? res.data : [];

        setJobs(
          raw.map((job: any) => {
            const id = normalizeId(job.id || job.jobId || job.job?.id);

            return {
              ...job,
              id,
              saved: true,
              applied: appliedIds.includes(id),
            };
          })
        );
      }

      if (activeTab === "applied") {
        const res = await getAppliedJobs();
        const raw = Array.isArray(res.data) ? res.data : [];

        setJobs(
          raw.map((job: any) => {
            const id = normalizeId(job.id || job.jobId || job.job?.id);

            return {
              ...job,
              id,
              saved: savedIds.includes(id),
              applied: true,
            };
          })
        );
      }
    } catch (err) {
      console.log(err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (jobId: string) => {
    const id = normalizeId(jobId);

    try {
      await toggleSaveJob(id);

      setJobs((prev) =>
        prev.map((job) =>
          normalizeId(job.id) === id
            ? { ...job, saved: !job.saved }
            : job
        )
      );
    } catch (err) {
      console.log("Save error:", err);
    }
  };

  const handleApply = async (jobId: string) => {
    const id = normalizeId(jobId);

    try {
      await applyJob(id);

      setJobs((prev) =>
        prev.map((job) =>
          normalizeId(job.id) === id
            ? { ...job, applied: true }
            : job
        )
      );
    } catch (err) {
      console.log("Apply error:", err);
    }
  };

  const handleUnapply = async (jobId: string) => {
    const id = normalizeId(jobId);

    try {
      await unapplyJob(id);

      setJobs((prev) =>
        prev.map((job) =>
          normalizeId(job.id) === id
            ? { ...job, applied: false }
            : job
        )
      );

      if (activeTab === "applied") {
        setJobs((prev) =>
          prev.filter((job) => normalizeId(job.id) !== id)
        );
      }
    } catch (err) {
      console.log("Unapply error:", err);
    }
  };

  return (
    <>
      <Navbar />

      <div style={{ marginLeft: "250px", padding: "30px", fontFamily: "sans-serif" }}>

        {/* TAB */}
        <div style={{
          display: "flex",
          gap: "20px",
          borderBottom: "1px solid #ddd",
          marginBottom: "20px",
          paddingBottom: "10px"
        }}>
          <span
            onClick={() => setActiveTab("for-you")}
            style={{
              cursor: "pointer",
              fontWeight: activeTab === "for-you" ? "bold" : "normal",
              borderBottom: activeTab === "for-you" ? "2px solid black" : "none",
              paddingBottom: "10px",
            }}
          >
            For You
          </span>

          <span
            onClick={() => setActiveTab("saved")}
            style={{
              cursor: "pointer",
              fontWeight: activeTab === "saved" ? "bold" : "normal",
              borderBottom: activeTab === "saved" ? "2px solid black" : "none",
              paddingBottom: "10px",
            }}
          >
            Saved
          </span>

          <span
            onClick={() => setActiveTab("applied")}
            style={{
              cursor: "pointer",
              fontWeight: activeTab === "applied" ? "bold" : "normal",
              borderBottom: activeTab === "applied" ? "2px solid black" : "none",
              paddingBottom: "10px",
            }}
          >
            Applied
          </span>
        </div>

        {loading && <p>Loading...</p>}

        {!loading && jobs.length === 0 && (
          <p style={{ color: "gray" }}>No jobs found.</p>
        )}

        {!loading &&
          jobs.map((job: any) => {
            const id = normalizeId(job.id);

            return (
              <div
                key={id}
                style={{
                  border: "1px solid #ddd",
                  padding: "20px",
                  marginBottom: "15px",
                  borderRadius: "15px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
                }}
              >
                {/* LEFT */}
                <div>
                  <h3 style={{ margin: "0 0 5px 0" }}>{job.title}</h3>
                  <p style={{ color: "gray", margin: "0 0 10px 0" }}>
                    {job.company}
                  </p>

                  <div style={{ display: "flex", gap: "8px" }}>
                    {job.tags?.map((tag: any, idx: any) => (
                      <span
                        key={idx}
                        style={{
                          border: "1px solid #ccc",
                          padding: "3px 10px",
                          borderRadius: "15px",
                          fontSize: "12px"
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* RIGHT */}
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontWeight: "bold", margin: "0 0 15px 0" }}>
                    {job.salary ? job.salary : "Salary Undisclosed"}
                  </p>

                  <div style={{ display: "flex", gap: "10px" }}>
                    
                    {/* SAVE */}
                    <button
                      onClick={() => handleSave(id)}
                      style={{
                        border: "1px solid #ccc",
                        backgroundColor: job.saved ? "#e0e0e0" : "white",
                        padding: "8px 20px",
                        borderRadius: "20px",
                        cursor: "pointer",
                        fontWeight: "bold"
                      }}
                    >
                      {job.saved ? "Unsave" : "Save"}
                    </button>

                    {/* APPLY / CANCEL */}
                    {job.applied ? (
                      <button
                        onClick={() => handleUnapply(id)}
                        style={{
                          backgroundColor: "#ff4d4f",
                          color: "white",
                          border: "none",
                          padding: "8px 20px",
                          borderRadius: "20px",
                          cursor: "pointer",
                          fontWeight: "bold"
                        }}
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApply(id)}
                        style={{
                          backgroundColor: "black",
                          color: "white",
                          border: "none",
                          padding: "8px 20px",
                          borderRadius: "20px",
                          cursor: "pointer",
                          fontWeight: "bold"
                        }}
                      >
                        Apply
                      </button>
                    )}

                  </div>
                </div>

              </div>
            );
          })}
      </div>
    </>
  );
}