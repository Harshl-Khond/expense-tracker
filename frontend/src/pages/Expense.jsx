import { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";
import EmployeeLayout from "../layouts/EmployeeLayout";
import { api } from "../api";

const COLORS = {
  NAVY: "#3A5A7A",
  ACCENT: "#5C8DB8",
  ACCENT_DARK: "#4A7AA3",
  SUCCESS: "#3A7D44",
  WARNING: "#B23A48",
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
    } catch {
      localStorage.clear();
      window.location.href = "/login";
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

    const compressed = await imageCompression(file, {
      maxSizeMB: 0.02,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    });

    const reader = new FileReader();
    reader.onloadend = () => setBillImageBase64(reader.result);
    reader.readAsDataURL(compressed);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      setMessage("Expense saving failed");
    }
  };

  return (
    <EmployeeLayout>
      <div className="flex flex-col items-center min-h-[70vh]">

        <h2 className="text-3xl font-semibold mb-6" style={{ color: COLORS.NAVY }}>
          Add Expense
        </h2>

        <div className="p-6 mb-6">
          <h3>Available Balance</h3>
          <p style={{ color: COLORS.SUCCESS, fontSize: "28px" }}>₹{availableBalance}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="date" name="date" value={form.date} onChange={handleChange} required />
          <input type="text" name="description" value={form.description} onChange={handleChange} required />
          <input type="number" name="amount" value={form.amount} onChange={handleChange} required />
          <input type="file" accept="image/*" onChange={handleImage} />
          <button style={{ background: COLORS.ACCENT }} type="submit">Submit</button>
        </form>

        {message && <p style={{ color: COLORS.WARNING }}>{message}</p>}
      </div>
    </EmployeeLayout>
  );
}

export default Expense;
