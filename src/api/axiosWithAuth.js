import axios from "axios";

export default function axiosWithAuth() {
  const token = localStorage.getItem("token");

  return axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}