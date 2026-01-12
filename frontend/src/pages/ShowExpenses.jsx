import { useEffect, useState } from "react";
import EmployeeLayout from "../layouts/EmployeeLayout";
import { api } from "../api";

function ShowExpenses() {
  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email;

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadExpenses = async () => {
    try {
      const res = await api.get(`/get-expenses/${email}`);
      setExpenses(res.data.expenses || []);
      setMessage("");
    } catch (err) {
      if (err.response?.status === 401) {
        setMessage("Session expired. Please login again.");
        localStorage.clear();
        window.location.href = "/login";
      } else if (err.response?.status === 403) {
        setMessage("Unauthorized access.");
      } else {
        setMessage("Failed to load expenses");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  return (
    <EmployeeLayout>
      <div className="max-w-6xl mx-auto">

        <h2 className="text-2xl font-semibold mb-4 text-[#1F2A37]">
          My Expenses
        </h2>

        {message && (
          <p className="mb-4 text-red-600 text-center">{message}</p>
        )}

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full text-sm">
              <thead className="bg-[#E6EDF3] text-[#1F2A37]">
                <tr>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Bill</th>
                </tr>
              </thead>

              <tbody>
                {expenses.length > 0 ? (
                  expenses.map((e) => (
                    <tr key={e.id} className="border-t">
                      <td className="p-3">{e.date}</td>
                      <td className="p-3">{e.description}</td>
                      <td className="p-3 font-semibold text-[#3A5A7A]">
                        ₹{e.amount}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            e.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {e.status}
                        </span>
                      </td>
                      <td className="p-3">
  {e.bill_image ? (
    <img
      src={e.bill_image}
      alt="Bill"
      className="w-16 h-16 object-cover rounded border cursor-pointer hover:scale-105 transition"
      onClick={() => window.open(e.bill_image, "_blank")}
    />
  ) : (
    "-"
  )}
</td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-6 text-center text-gray-500"
                    >
                      No expenses found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
}

export default ShowExpenses;
