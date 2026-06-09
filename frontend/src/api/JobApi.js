import axios from "axios";

const API_URL = "http://localhost:5000/api/jobs";

const getHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

export const getJobs = () => {
  return axios.get(`${API_URL}`, getHeaders());
};

export const getSavedJobs = () => {
  return axios.get(`${API_URL}/saved`, getHeaders());
};

export const getAppliedJobs = () => {
  return axios.get(`${API_URL}/applied`, getHeaders());
};

// SAVE / UNSAVE
export const toggleSaveJob = (jobId) => {
  return axios.post(`${API_URL}/${jobId}/save`, {}, getHeaders());
};

// APPLY
export const applyJob = (jobId) => {
  return axios.post(`${API_URL}/${jobId}/apply`, {}, getHeaders());
};

// UNAPPLY
export const unapplyJob = (jobId) => {
  const token = localStorage.getItem("token");

  return axios.delete(`${API_URL}/${jobId}/apply`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};