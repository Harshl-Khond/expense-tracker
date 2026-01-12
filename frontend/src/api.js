import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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

// import axios from "axios";

// export const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
// });

// // Automatically attach session_token to every request
// api.interceptors.request.use((config) => {
//   const session = JSON.parse(localStorage.getItem("session"));

//   if (session?.session_token) {
//     if (config.method === "get") {
//       config.params = {
//         ...config.params,
//         session_token: session.session_token,
//       };
//     } else {
//       config.data = {
//         ...config.data,
//         session_token: session.session_token,
//       };
//     }
//   }

//   return config;
// });
