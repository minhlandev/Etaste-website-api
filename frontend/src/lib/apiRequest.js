import axios from "axios";

const apiRequest = axios.create({
  baseURL: "http://localhost:8800/backend",
  withCredentials: true,
});

export default apiRequest;