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

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/signup", form);
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      if (err.response) setMessage(err.response.data.error);
      else setMessage("Something went wrong");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: COLORS.PAGE_BG }}
    >
      {/* Card */}
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
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border outline-none"
            style={{ borderColor: COLORS.BORDER }}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border outline-none"
            style={{ borderColor: COLORS.BORDER }}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border outline-none"
            style={{ borderColor: COLORS.BORDER }}
            required
          />

          <select
            name="role"
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border outline-none"
            style={{ borderColor: COLORS.BORDER }}
            required
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
          </select>

          <button
            type="submit"
            className="w-full py-2.5 rounded-md font-semibold text-white transition"
            style={{ backgroundColor: COLORS.ACCENT }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = COLORS.ACCENT_HOVER)
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = COLORS.ACCENT)
            }
          >
            Signup
          </button>
        </form>

        {message && (
          <p
            className="text-center mt-4 font-medium"
            style={{ color: COLORS.NAVY }}
          >
            {message}
          </p>
        )}

        <button
          onClick={() => navigate("/login")}
          className="w-full mt-6 py-2 rounded-md border transition"
          style={{
            borderColor: COLORS.BORDER,
            color: COLORS.TEXT_MAIN,
          }}
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}

export default Signup;
