import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

const COLORS = {
  PAGE_BG: "#E6EDF3",
  CARD_BG: "#FFFFFF",
  NAVY: "#3A5A7A",
  ACCENT: "#5C8DB8",
  ACCENT_HOVER: "#4A7AA3",
  TEXT_MAIN: "#1F2A37",
  TEXT_MUTED: "#4B5563",
  BORDER: "#B6C7D6",
};

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // prevent double submit

    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("/login", form);

      // Save session + user
      localStorage.setItem("session", res.data.session);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Redirect by role
      if (res.data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/employee-dashboard");
      }
    } catch (err) {
      if (err.response) {
        setMessage(err.response.data.error);
      } else {
        setMessage("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: COLORS.PAGE_BG }}
    >
      <div
        className="w-full max-w-md p-10 rounded-xl shadow-sm"
        style={{
          backgroundColor: COLORS.CARD_BG,
          borderLeft: `5px solid ${COLORS.ACCENT}`,
        }}
      >
        <h2
          className="text-3xl font-semibold text-center mb-6"
          style={{ color: COLORS.NAVY }}
        >
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* EMAIL */}
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border outline-none"
            style={{ borderColor: COLORS.BORDER }}
            required
          />

          {/* PASSWORD WITH TOGGLE */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border outline-none"
              style={{ borderColor: COLORS.BORDER }}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
              style={{ color: COLORS.ACCENT }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-md font-semibold text-white transition"
            style={{
              backgroundColor: loading ? COLORS.TEXT_MUTED : COLORS.ACCENT,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            onMouseOver={(e) => {
              if (!loading)
                e.currentTarget.style.backgroundColor = COLORS.ACCENT_HOVER;
            }}
            onMouseOut={(e) => {
              if (!loading)
                e.currentTarget.style.backgroundColor = COLORS.ACCENT;
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* MESSAGE */}
        {message && (
          <p
            className="text-center mt-4 font-medium"
            style={{ color: COLORS.NAVY }}
          >
            {message}
          </p>
        )}

        {/* SIGNUP */}
        <button
          onClick={() => navigate("/")}
          className="w-full mt-6 py-2 rounded-md border transition"
          style={{
            borderColor: COLORS.BORDER,
            color: COLORS.TEXT_MAIN,
          }}
        >
          Create Account / Signup
        </button>
      </div>
    </div>
  );
}

export default Login;


// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { api } from "../api";

// const COLORS = {
//   PAGE_BG: "#E6EDF3",
//   CARD_BG: "#FFFFFF",
//   NAVY: "#3A5A7A",
//   ACCENT: "#5C8DB8",
//   ACCENT_HOVER: "#4A7AA3",
//   TEXT_MAIN: "#1F2A37",
//   TEXT_MUTED: "#4B5563",
//   BORDER: "#B6C7D6",
// };

// function Login() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({ email: "", password: "" });
//   const [message, setMessage] = useState("");

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await api.post("/login", form);

//       setMessage(res.data.message);

//       // Save session + user
//       localStorage.setItem("session", res.data.session);
//       localStorage.setItem("user", JSON.stringify(res.data.user));

//       // Redirect by role
//       if (res.data.user.role === "admin") {
//         navigate("/admin-dashboard");
//       } else {
//         navigate("/employee-dashboard");
//       }
//     } catch (err) {
//       if (err.response) setMessage(err.response.data.error);
//       else setMessage("Something went wrong");
//     }
//   };

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center px-4"
//       style={{ backgroundColor: COLORS.PAGE_BG }}
//     >
//       {/* Card */}
//       <div
//         className="w-full max-w-md p-10 rounded-xl shadow-sm"
//         style={{
//           backgroundColor: COLORS.CARD_BG,
//           borderLeft: `5px solid ${COLORS.ACCENT}`,
//         }}
//       >
//         <h2
//           className="text-3xl font-semibold text-center mb-6"
//           style={{ color: COLORS.NAVY }}
//         >
//           Login
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <input
//             name="email"
//             type="email"
//             placeholder="Email"
//             onChange={handleChange}
//             className="w-full px-4 py-2 rounded-md border outline-none"
//             style={{ borderColor: COLORS.BORDER }}
//             required
//           />

//           <input
//             name="password"
//             type="password"
//             placeholder="Password"
//             onChange={handleChange}
//             className="w-full px-4 py-2 rounded-md border outline-none"
//             style={{ borderColor: COLORS.BORDER }}
//             required
//           />

//           <button
//             type="submit"
//             className="w-full py-2.5 rounded-md font-semibold text-white transition"
//             style={{ backgroundColor: COLORS.ACCENT }}
//             onMouseOver={(e) =>
//               (e.currentTarget.style.backgroundColor = COLORS.ACCENT_HOVER)
//             }
//             onMouseOut={(e) =>
//               (e.currentTarget.style.backgroundColor = COLORS.ACCENT)
//             }
//           >
//             Login
//           </button>
//         </form>

//         {message && (
//           <p
//             className="text-center mt-4 font-medium"
//             style={{ color: COLORS.NAVY }}
//           >
//             {message}
//           </p>
//         )}

//         <button
//           onClick={() => navigate("/")}
//           className="w-full mt-6 py-2 rounded-md border transition"
//           style={{
//             borderColor: COLORS.BORDER,
//             color: COLORS.TEXT_MAIN,
//           }}
//         >
//           Create Account / Signup
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Login;
