import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import EmployeeLayout from "../layouts/EmployeeLayout";
import { api } from "../api";

function UpdateExpense() {
  const { id } = useParams(); // expense id from url
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email;

  const passedExpense = location.state?.expense;

  const [expense, setExpense] = useState(passedExpense || null);
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [billPreview, setBillPreview] = useState(null);
  const [newFile, setNewFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (passedExpense) {
      setExpense(passedExpense);
      setDate(passedExpense.date || "");
      setDescription(passedExpense.description || "");
      setAmount(String(passedExpense.amount || ""));
      setBillPreview(passedExpense.bill_image || null);
    } else {
      // fallback: fetch all expenses and find this one
      const fetchAndFind = async () => {
        try {
          const res = await api.get(`/get-expenses/${email}`);
          const list = res.data.expenses || [];
          const found = list.find((e) => e.id === id);
          if (!found) {
            setMessage("Expense not found");
            return;
          }
          setExpense(found);
          setDate(found.date || "");
          setDescription(found.description || "");
          setAmount(String(found.amount || ""));
          setBillPreview(found.bill_image || null);
        } catch (err) {
          console.error("Error fetching expense", err);
          setMessage("Error fetching expense");
        }
      };
      fetchAndFind();
    }
  }, [passedExpense, id, email]);

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setNewFile(f);
    // preview
    const url = URL.createObjectURL(f);
    setBillPreview(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const payload = {
        expense_id: expense.id || id,
        date,
        description,
        amount,
        // bill_image will be added below only if changed
      };

      if (newFile) {
        const base64 = await fileToBase64(newFile);
        payload.bill_image = base64;
      }

      // Make PUT request
      const res = await api.put("/update-expense", payload);

      if (res.status === 200) {
        setMessage("Expense updated successfully.");
        // navigate back to list after short delay
        setTimeout(() => {
          navigate("/show-expenses");
        }, 900);
      } else {
        setMessage(res.data?.error || "Failed to update expense");
      }
    } catch (err) {
      console.error("Update error:", err);
      const errMsg = err.response?.data?.error || "Internal Server Error";
      setMessage(errMsg);
      if (err.response?.status === 401) {
        localStorage.clear();
        window.location.href = "/login";
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!expense) {
    return (
      <EmployeeLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <p>Loading expense...</p>
        </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div className="max-w-2xl mx-auto py-8">
        <h2 className="text-2xl font-semibold mb-4">Edit Expense</h2>

        {message && <p className="mb-4">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Amount</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Bill (optional)</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {billPreview ? (
              <div className="mt-2">
                <img
                  src={billPreview}
                  alt="bill-preview"
                  className="w-40 h-40 object-cover rounded-md border"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Upload a new file to replace the current bill image.
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-1">No bill image</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-md text-white"
              style={{ backgroundColor: "#4A7AA3" }}
            >
              {submitting ? "Updating..." : "Update Expense"}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-md border"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </EmployeeLayout>
  );
}

export default UpdateExpense;
