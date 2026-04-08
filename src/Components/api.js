import axios from "axios";


// const api = axios.create({
//   baseURL: "http://localhost:8080/api",
// });

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL+"/api",
});

api.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;