import { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";
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
  const [billImageBase64, setBillImageBase64] = useState(null);
  const [message, setMessage] = useState("");

  const loadBalance = async () => {
    try {
      const res = await api.get("/get-summary");
      setAvailableBalance(res.data.balance || 0);
    } catch (err) {
      if (err.response?.status === 401) {
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

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.02,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      });

      const reader = new FileReader();
      reader.onloadend = () => setBillImageBase64(reader.result);
      reader.readAsDataURL(compressed);
    } catch {
      setMessage("Image compression failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const amt = parseFloat(form.amount);
    if (amt > availableBalance) {
      setMessage(`Insufficient balance. Available ₹${availableBalance}`);
      return;
    }

    try {
      const res = await api.post("/add-expense", {
        ...form,
        bill_image: billImageBase64,
        email,
      });

      setAvailableBalance(res.data.new_balance);
      setMessage(res.data.message);
      setForm({ date: "", description: "", amount: "" });
      setBillImageBase64(null);
    } catch (err) {
      if (err.response?.data?.available_balance !== undefined) {
        setAvailableBalance(err.response.data.available_balance);
        setMessage(`Insufficient balance. Available ₹${err.response.data.available_balance}`);
        return;
      }
      setMessage("Expense saving failed.");
    }
  };

  return (
    <EmployeeLayout>
      <div className="flex flex-col items-center min-h-[70vh]">
        <h2 className="text-3xl font-semibold mb-6" style={{ color: COLORS.NAVY }}>
          Add Expense
        </h2>

        <div className="w-full max-w-md p-6 mb-8 rounded-xl shadow-sm text-center"
          style={{ backgroundColor: COLORS.CARD_BG, borderLeft: `5px solid ${COLORS.ACCENT}` }}>
          <h3>Available Balance</h3>
          <p className="text-3xl font-bold" style={{ color: COLORS.SUCCESS }}>
            ₹{availableBalance}
          </p>
        </div>

        <div className="w-full max-w-lg p-8 rounded-xl shadow-sm"
          style={{ backgroundColor: COLORS.CARD_BG, borderLeft: `5px solid ${COLORS.ACCENT}` }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input type="date" name="date" value={form.date} onChange={handleChange} required />
            <input type="text" name="description" value={form.description} onChange={handleChange} required />
            <input type="number" name="amount" value={form.amount} onChange={handleChange} required />
            <input type="file" accept="image/*" onChange={handleImage} />
            <button type="submit">Submit Expense</button>
          </form>
          {message && <p>{message}</p>}
        </div>
      </div>
    </EmployeeLayout>
  );
}

export default Expense;
