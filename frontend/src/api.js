import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:5000",
});

// Automatically attach session_token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("session");

  if (token) {
    if (config.method === "get") {
      config.params = config.params || {};
      config.params.session_token = token;
    } else {
      config.data = config.data || {};
      config.data.session_token = token;
    }
  }

  return config;
});
