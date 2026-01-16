import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EmployeeLayout from "../layouts/EmployeeLayout";
import { api } from "../api";

function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    date: "",
    description: "",
    amount: ""
  });

  useEffect(() => {
    const load = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await api.get(`/get-expenses/${user.email}`);
      const exp = res.data.expenses.find((e) => e.id === id);
      if (exp) setForm(exp);
    };
    load();
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const updateExpense = async () => {
    try {
      await api.put("/update-expense", {
        expense_id: id,
        date: form.date,
        description: form.description,
        amount: form.amount
      });

      alert("Expense updated successfully ✅");
      navigate("/my-expenses");
    } catch (err) {
      alert(err.response?.data?.error || "Update failed");
    }
  };

  return (
    <EmployeeLayout>
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl mb-4 text-center">Edit Expense</h2>

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border p-2 mb-2"
        />

        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 mb-2"
        />

        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          className="w-full border p-2 mb-4"
        />

        <button
          onClick={updateExpense}
          className="bg-green-600 text-white w-full py-2 rounded"
        >
          Update Expense
        </button>
      </div>
    </EmployeeLayout>
  );
}

export default EditExpense;
