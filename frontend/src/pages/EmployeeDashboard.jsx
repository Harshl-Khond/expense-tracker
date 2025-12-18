import { useEffect, useState } from "react";
import EmployeeLayout from "../layouts/EmployeeLayout";
import { api } from "../api";

const COLORS = {
  PAGE_BG: "#E6EDF3",
  CARD_BG: "#FFFFFF",
  NAVY: "#3A5A7A",
  ACCENT: "#5C8DB8",
  ACCENT_DARK: "#4A7AA3",
  TEXT_MAIN: "#1F2A37",
  TEXT_MUTED: "#4B5563",
  BORDER: "#B6C7D6",
};

function EmployeeDashboard() {
  const [funds, setFunds] = useState([]);
  const [balance, setBalance] = useState(0);

  const loadFunds = async () => {
    try {
      const fundRes = await api.get("/get-all-funds");
      const summaryRes = await api.get("/get-summary");

      setFunds(fundRes.data.funds || []);
      setBalance(summaryRes.data.balance || 0);
    } catch (err) {
      console.log("Error loading dashboard fund data", err);
    }
  };

  useEffect(() => {
    loadFunds();
  }, []);

  return (
    <EmployeeLayout>
      {/* Center Wrapper */}
      <div className="flex flex-col items-center justify-center min-h-[70vh]">

        {/* Title */}
        <h1
          className="text-3xl md:text-4xl font-semibold mb-2"
          style={{ color: COLORS.NAVY }}
        >
          Employee Dashboard
        </h1>
        <p className="mb-8" style={{ color: COLORS.TEXT_MUTED }}>
          Welcome to your dashboard
        </p>

        {/* Available Balance Card */}
        <div
          className="w-full max-w-sm p-6 mb-10 rounded-xl shadow-sm text-center"
          style={{
            backgroundColor: COLORS.CARD_BG,
            borderLeft: `5px solid ${COLORS.ACCENT}`,
          }}
        >
          <h2
            className="text-lg font-medium mb-1"
            style={{ color: COLORS.TEXT_MAIN }}
          >
            Available Fund
          </h2>
          <p
            className="text-4xl font-bold mt-3"
            style={{ color: COLORS.ACCENT_DARK }}
          >
            ₹{balance}
          </p>
        </div>

        {/* Fund History */}
        <div
          className="w-full max-w-5xl p-6 rounded-xl shadow-sm"
          style={{
            backgroundColor: COLORS.CARD_BG,
            borderLeft: `5px solid ${COLORS.ACCENT}`,
          }}
        >
          <h3
            className="text-xl font-semibold mb-6 text-center"
            style={{ color: COLORS.NAVY }}
          >
            Fund History
          </h3>

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
                      <td
                        className="py-2 px-4 font-semibold"
                        style={{ color: COLORS.ACCENT_DARK }}
                      >
                        ₹{f.amount}
                      </td>
                      <td className="py-2 px-4">
                        {f.description || "-"}
                      </td>
                      <td className="py-2 px-4">
                        {f.admin_name || f.admin_email}
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
                      No fund records available
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

export default EmployeeDashboard;
