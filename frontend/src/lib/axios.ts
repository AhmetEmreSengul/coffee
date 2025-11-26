import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development" ? "http://localhost:3000" : "https://timeslot-dtqf.onrender.com",
  withCredentials: true,
});
