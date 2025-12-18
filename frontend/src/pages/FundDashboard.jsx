import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { api } from "../api";

const COLORS = {
  PAGE_BG: "#CAD2C5",
  CARD_BG: "#FFFFFF",
  NAVY: "#2F3E46",
  ACCENT: "#52796F",
  EXPENSE: "#B23A48",
  BALANCE: "#3A5A40",
  TEXT_MAIN: "#1B1F23",
  TEXT_MUTED: "#4F5D5E",
  BORDER: "#84A98C",
};

function FundHistory() {
  const [funds, setFunds] = useState([]);
  const [summary, setSummary] = useState({
    total_fund: 0,
    total_expenses: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const fundData = await api.get("/get-all-funds");
      const summaryData = await api.get("/get-summary");

      setFunds(fundData.data.funds || []);
      setSummary(summaryData.data);
    } catch (err) {
      console.log("Error loading fund history", err);
      if (err.response?.status === 401) {
        localStorage.clear();
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <AdminLayout>
      {/* Center Wrapper */}
      <div className="flex flex-col items-center justify-center min-h-[70vh]">

        {/* Page Title */}
        <h2
          className="text-3xl font-semibold mb-6"
          style={{ color: COLORS.NAVY }}
        >
          Fund Dashboard
        </h2>

        {loading ? (
          <p style={{ color: COLORS.TEXT_MUTED }}>Loading...</p>
        ) : (
          <>
            {/* Summary */}
            <div
              className="mb-6 text-center space-y-1"
              style={{ color: COLORS.TEXT_MAIN }}
            >
              <p>
                <b>Total Fund Added:</b>{" "}
                <span style={{ color: COLORS.ACCENT }}>
                  ₹{summary.total_fund}
                </span>
              </p>
              <p>
                <b>Total Expense Used:</b>{" "}
                <span style={{ color: COLORS.EXPENSE }}>
                  ₹{summary.total_expenses}
                </span>
              </p>
              <p>
                <b>Available Balance:</b>{" "}
                <span style={{ color: COLORS.BALANCE }}>
                  ₹{summary.balance}
                </span>
              </p>
            </div>

            {/* Table Card */}
            <div
              className="w-full max-w-5xl p-6 rounded-xl shadow-sm"
              style={{
                backgroundColor: COLORS.CARD_BG,
                borderLeft: `5px solid ${COLORS.ACCENT}`,
              }}
            >
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr style={{ backgroundColor: COLORS.PAGE_BG }}>
                      <th className="py-3 px-4 text-left">Date</th>
                      <th className="py-3 px-4 text-left">Amount</th>
                      <th className="py-3 px-4 text-left">Description</th>
                      <th className="py-3 px-4 text-left">Added By</th>
                    </tr>
                  </thead>

                  <tbody>
                    {funds.length > 0 ? (
                      funds.map((f) => (
                        <tr
                          key={f.id}
                          className="border-b"
                          style={{ borderColor: COLORS.BORDER }}
                        >
                          <td className="py-2 px-4">{f.date}</td>
                          <td className="py-2 px-4">₹{f.amount}</td>
                          <td className="py-2 px-4">
                            {f.description || "-"}
                          </td>
                          <td className="py-2 px-4">{f.admin_name}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="text-center py-6"
                          style={{ color: COLORS.TEXT_MUTED }}
                        >
                          No funds found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

export default FundHistory;
