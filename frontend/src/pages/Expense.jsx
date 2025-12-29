import { useState, useEffect } from "react";
import EmployeeLayout from "../layouts/EmployeeLayout";
import { api } from "../api";

const COLORS = {
  PAGE_BG: "#E6EDF3",
  CARD_BG: "#FFFFFF",
  NAVY: "#3A5A7A",
  ACCENT: "#5C8DB8",
  ACCENT_DARK: "#4A7AA3",
  SUCCESS: "#3A7D44",
  WARNING: "#B23A48",
  TEXT_MAIN: "#1F2A37",
  TEXT_MUTED: "#4B5563",
  BORDER: "#B6C7D6",
};

function Expense() {
  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email;

  const [form, setForm] = useState({
    date: "",
    description: "",
    amount: "",
  });

  const [availableBalance, setAvailableBalance] = useState(0);
  const [message, setMessage] = useState("");

  const loadBalance = async () => {
    try {
      const res = await api.get("/get-summary");
      setAvailableBalance(res.data.balance || 0);
    } catch (err) {
      if (err.response?.status === 401) {
        setMessage("Session expired. Please login again.");
        localStorage.clear();
        window.location.href = "/login";
      }
    }
  };

  useEffect(() => {
    loadBalance();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    

    if (parseFloat(form.amount) > availableBalance) {
      setMessage(`Insufficient balance. Available ₹${availableBalance}`);
      return;
    }

    try {
      const res = await api.post("/add-expense", {
        ...form,
        
        email,
      });

      setMessage(res.data.message);
      loadBalance();
      setForm({ date: "", description: "", amount: "" });
     
    } catch (err) {
      if (err.response?.status === 401) {
        setMessage("Session expired. Please login again.");
        localStorage.clear();
        window.location.href = "/login";
        return;
      }
      setMessage("Expense saving failed.");
    }
  };

  return (
    <EmployeeLayout>
      {/* Center Wrapper */}
      <div className="flex flex-col items-center justify-center min-h-[70vh]">

        {/* Page Title */}
        <h2
          className="text-3xl font-semibold mb-6"
          style={{ color: COLORS.NAVY }}
        >
          Add Expense
        </h2>

        {/* Balance Card */}
        <div
          className="w-full max-w-md p-6 mb-8 rounded-xl shadow-sm text-center"
          style={{
            backgroundColor: COLORS.CARD_BG,
            borderLeft: `5px solid ${COLORS.ACCENT}`,
          }}
        >
          <h3
            className="text-lg font-medium"
            style={{ color: COLORS.TEXT_MAIN }}
          >
            Available Balance
          </h3>
          <p
            className="text-3xl font-bold mt-2"
            style={{ color: COLORS.SUCCESS }}
          >
            ₹{availableBalance}
          </p>
        </div>

        {/* Expense Form */}
        <div
          className="w-full max-w-lg p-8 rounded-xl shadow-sm"
          style={{
            backgroundColor: COLORS.CARD_BG,
            borderLeft: `5px solid ${COLORS.ACCENT}`,
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border outline-none"
              style={{ borderColor: COLORS.BORDER }}
              required
            />

            <input
              type="text"
              name="description"
              value={form.description}
              placeholder="Expense description"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border outline-none"
              style={{ borderColor: COLORS.BORDER }}
              required
            />

            <input
              type="number"
              name="amount"
              value={form.amount}
              placeholder="Expense amount"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border outline-none"
              style={{ borderColor: COLORS.BORDER }}
              required
            />

           

            <button
              type="submit"
              className="w-full py-2.5 rounded-md font-semibold text-white transition"
              style={{ backgroundColor: COLORS.ACCENT }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = COLORS.ACCENT_DARK)
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = COLORS.ACCENT)
              }
            >
              Submit Expense
            </button>
          </form>

          {message && (
            <p
              className="text-center mt-4 font-medium"
              style={{ color: COLORS.WARNING }}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </EmployeeLayout>
  );
}

export default Expense;
