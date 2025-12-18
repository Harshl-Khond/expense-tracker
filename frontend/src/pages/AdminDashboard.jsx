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

function AdminDashboard() {
  const [summary, setSummary] = useState({
    total_fund: 0,
    total_expenses: 0,
    balance: 0,
  });

  const loadSummary = async () => {
    try {
      const res = await api.get("/get-summary");
      setSummary(res.data);
    } catch (err) {
      console.log("Error loading summary:", err);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  return (
    <AdminLayout>
      {/* Page Title */}
      <h1
        className="text-3xl font-semibold mb-2"
        style={{ color: COLORS.NAVY }}
      >
        Admin Dashboard
      </h1>

      <p className="mb-8" style={{ color: COLORS.TEXT_MUTED }}>
        Overview of all activities
      </p>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Funds */}
        <div
          className="p-6 rounded-xl shadow-sm"
          style={{
            backgroundColor: COLORS.CARD_BG,
            borderLeft: `5px solid ${COLORS.ACCENT}`,
          }}
        >
          <h2 className="text-lg font-medium mb-2" style={{ color: COLORS.TEXT_MAIN }}>
            Total Funds
          </h2>
          <p className="text-3xl font-bold" style={{ color: COLORS.ACCENT }}>
            ₹{summary.total_fund}
          </p>
          <p className="text-sm mt-2" style={{ color: COLORS.TEXT_MUTED }}>
            Total money added by admins
          </p>
        </div>

        {/* Total Expenses */}
        <div
          className="p-6 rounded-xl shadow-sm"
          style={{
            backgroundColor: COLORS.CARD_BG,
            borderLeft: `5px solid ${COLORS.EXPENSE}`,
          }}
        >
          <h2 className="text-lg font-medium mb-2" style={{ color: COLORS.TEXT_MAIN }}>
            Total Expenses
          </h2>
          <p className="text-3xl font-bold" style={{ color: COLORS.EXPENSE }}>
            ₹{summary.total_expenses}
          </p>
          <p className="text-sm mt-2" style={{ color: COLORS.TEXT_MUTED }}>
            Total employee expenses
          </p>
        </div>

        {/* Available Balance */}
        <div
          className="p-6 rounded-xl shadow-sm"
          style={{
            backgroundColor: COLORS.CARD_BG,
            borderLeft: `5px solid ${COLORS.BALANCE}`,
          }}
        >
          <h2 className="text-lg font-medium mb-2" style={{ color: COLORS.TEXT_MAIN }}>
            Available Balance
          </h2>
          <p className="text-3xl font-bold" style={{ color: COLORS.BALANCE }}>
            ₹{summary.balance}
          </p>
          <p className="text-sm mt-2" style={{ color: COLORS.TEXT_MUTED }}>
            Remaining usable fund balance
          </p>
        </div>
      </div>

      {/* Analytics Section */}
      <div
        className="mt-10 p-8 rounded-xl shadow-sm"
        style={{
          backgroundColor: COLORS.CARD_BG,
          borderLeft: `5px solid ${COLORS.BORDER}`,
        }}
      >
        <h2
          className="text-xl font-semibold mb-3"
          style={{ color: COLORS.NAVY }}
        >
          Analytics (Coming Soon)
        </h2>
        <p style={{ color: COLORS.TEXT_MUTED }}>
          Graphs and visual insights will appear here.
        </p>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
