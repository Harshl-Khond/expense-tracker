import { useEffect, useState } from "react";
import EmployeeLayout from "../layouts/EmployeeLayout";
import { api } from "../api";

const COLORS = {
  PAGE_BG: "#E6EDF3",
  CARD_BG: "#FFFFFF",
  NAVY: "#3A5A7A",
  ACCENT: "#5C8DB8",
  ACCENT_DARK: "#4A7AA3",
  SUCCESS: "#3A7D44",
  TEXT_MAIN: "#1F2A37",
  TEXT_MUTED: "#4B5563",
  BORDER: "#B6C7D6",
};

function ShowExpenses() {
  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email;

  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [filterDescription, setFilterDescription] = useState("");
  const [message, setMessage] = useState("");

  const fetchExpenses = async () => {
    try {
      const res = await api.get(`/get-expenses/${email}`);
      setExpenses(res.data.expenses || []);
      setFilteredExpenses(res.data.expenses || []);
    } catch (err) {
      console.log("Error fetching expenses", err);
      if (err.response?.status === 401) {
        setMessage("Session expired. Please login again.");
        localStorage.clear();
        window.location.href = "/login";
      }
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    let data = [...expenses];

    if (filterDate) {
      data = data.filter((exp) => exp.date === filterDate);
    }
    if (filterDescription) {
      data = data.filter((exp) =>
        exp.description.toLowerCase().includes(filterDescription.toLowerCase())
      );
    }
    setFilteredExpenses(data);
  }, [filterDate, filterDescription, expenses]);

  return (
    <EmployeeLayout>
      {/* Center Wrapper */}
      <div className="flex flex-col items-center justify-center min-h-[70vh]">

        {/* Title */}
        <h2
          className="text-3xl font-semibold mb-2"
          style={{ color: COLORS.NAVY }}
        >
          My Expenses
        </h2>
        <p className="mb-6 text-center" style={{ color: COLORS.TEXT_MUTED }}>
          View, filter, and review all your past expenses
        </p>

        {message && (
          <p className="mb-4 font-medium" style={{ color: COLORS.ACCENT_DARK }}>
            {message}
          </p>
        )}

        {/* Filters */}
        <div className="flex gap-4 mb-6 flex-wrap justify-center">
          <input
            type="date"
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-4 py-2 rounded-md border outline-none"
            style={{ borderColor: COLORS.BORDER }}
          />

          <input
            type="text"
            placeholder="Search description"
            onChange={(e) => setFilterDescription(e.target.value)}
            className="px-4 py-2 rounded-md border outline-none w-64"
            style={{ borderColor: COLORS.BORDER }}
          />
        </div>

        {/* Table Card */}
        <div
          className="w-full max-w-6xl p-6 rounded-xl shadow-sm"
          style={{
            backgroundColor: COLORS.CARD_BG,
            borderLeft: `5px solid ${COLORS.ACCENT}`,
          }}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr style={{ backgroundColor: COLORS.PAGE_BG }}>
                  <th className="py-3 px-4 text-left">Description</th>
                  <th className="py-3 px-4 text-left">Amount</th>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Bill</th>
                </tr>
              </thead>

              <tbody>
                {filteredExpenses.length > 0 ? (
                  filteredExpenses.map((exp) => (
                    <tr
                      key={exp.id}
                      className="border-b"
                      style={{ borderColor: COLORS.BORDER }}
                    >
                      <td className="py-2 px-4">{exp.description}</td>
                      <td
                        className="py-2 px-4 font-semibold"
                        style={{ color: COLORS.SUCCESS }}
                      >
                        ₹{exp.amount}
                      </td>
                      <td className="py-2 px-4">{exp.date}</td>
                      <td className="py-2 px-4">
                        {exp.bill_image ? (
                          <img
                            src={exp.bill_image}
                            alt="bill"
                            className="w-20 h-20 object-cover rounded-md border"
                            style={{ borderColor: COLORS.BORDER }}
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
                      colSpan="4"
                      className="text-center py-6"
                      style={{ color: COLORS.TEXT_MUTED }}
                    >
                      No expenses found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
}

export default ShowExpenses;
