import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { api } from "../api";

const COLORS = {
  PAGE_BG: "#CAD2C5",
  CARD_BG: "#FFFFFF",
  NAVY: "#2F3E46",
  ACCENT: "#52796F",
  ACCENT_DARK: "#3A5A40",
  EXPENSE: "#B23A48",
  TEXT_MUTED: "#4F5D5E",
  BORDER: "#84A98C",
};     

//abc

function AllExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [message, setMessage] = useState("");

  const loadExpenses = async () => {
    try {
      const res = await api.get("/admin/get-all-expenses");
      setExpenses(res.data.expenses || []);
    } catch {
      setMessage("Session expired. Login again.");
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const approveExpense = async (id) => {
    try {
      await api.post("/admin/approve-expense", { expense_id: id });
      loadExpenses();
    } catch (err) {
      alert(err.response?.data?.error || "Approval failed");
    }
  };

  const filtered = expenses.filter((e) =>
    (e.employee_name || "").toLowerCase().includes(filterName.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex flex-col items-center min-h-[70vh]">

        <h2 className="text-3xl mb-4" style={{ color: COLORS.NAVY }}>
          All Employee Expenses
        </h2>

        <input
          type="text"
          placeholder="Search by Employee Name"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          className="px-4 py-2 mb-4"
        />

        <div className="w-full max-w-6xl bg-white p-6 rounded-lg">
          <table className="w-full">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Description</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((exp) => (
                <tr key={exp.id}>
                  <td>{exp.employee_name}</td>
                  <td>{exp.description}</td>
                  <td>{exp.date}</td>
                  <td>₹{exp.amount}</td>

                  <td>
                    <span
                      style={{
                        color: exp.status === "DISBURSED" ? "green" : "orange",
                        fontWeight: "bold",
                      }}
                    >
                      {exp.status}
                    </span>
                  </td>

                  <td>
                    {exp.status === "PENDING" && (
                      <button
                        onClick={() => approveExpense(exp.id)}
                        style={{ background: COLORS.ACCENT, color: "white" }}
                        className="px-3 py-1 rounded"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {message && <p style={{ color: "red" }}>{message}</p>}
      </div>
    </AdminLayout>
  );
}

export default AllExpenses;


// import { useEffect, useState } from "react";
// import AdminLayout from "../layouts/AdminLayout";
// import { api } from "../api";

// const COLORS = {
//   PAGE_BG: "#CAD2C5",
//   CARD_BG: "#FFFFFF",
//   NAVY: "#2F3E46",
//   ACCENT: "#52796F",
//   ACCENT_DARK: "#3A5A40",
//   EXPENSE: "#B23A48",
//   TEXT_MAIN: "#1B1F23",
//   TEXT_MUTED: "#4F5D5E",
//   BORDER: "#84A98C",
// };

// function AllExpenses() {
//   const [expenses, setExpenses] = useState([]);
//   const [filteredExpenses, setFilteredExpenses] = useState([]);
//   const [filterName, setFilterName] = useState("");
//   const [message, setMessage] = useState("");

//   const loadExpenses = async () => {
//     try {
//       const res = await api.get("/admin/get-all-expenses");
//       setExpenses(res.data.expenses || []);
//       setFilteredExpenses(res.data.expenses || []);
//     } catch (err) {
//       console.log("Error fetching expenses", err);
//       if (err.response?.status === 401) {
//         setMessage("Session expired. Please login again.");
//         localStorage.clear();
//         window.location.href = "/login";
//       } else {
//         setMessage("Failed to fetch expenses");
//       }
//     }
//   };

//   useEffect(() => {
//     loadExpenses();
//   }, []);

//   const handleFilter = (name) => {
//     setFilterName(name);
//     if (!name.trim()) {
//       setFilteredExpenses(expenses);
//       return;
//     }
//     setFilteredExpenses(
//       expenses.filter((e) =>
//         (e.employee_name || "").toLowerCase().includes(name.toLowerCase())
//       )
//     );
//   };

//   return (
//     <AdminLayout>
//       {/* Center Wrapper */}
//       <div className="flex flex-col items-center justify-center min-h-[70vh]">

//         {/* Title */}
//         <h2
//           className="text-3xl font-semibold mb-2"
//           style={{ color: COLORS.NAVY }}
//         >
//           All Employee Expenses
//         </h2>
//         <p className="mb-6 text-center" style={{ color: COLORS.TEXT_MUTED }}>
//           View and filter all expenses submitted by employees
//         </p>

//         {message && (
//           <p className="mb-4" style={{ color: COLORS.EXPENSE }}>
//             {message}
//           </p>
//         )}

//         {/* Search */}
//         <input
//           type="text"
//           placeholder="Search by Employee Name"
//           value={filterName}
//           onChange={(e) => handleFilter(e.target.value)}
//           className="px-4 py-2 mb-6 w-80 rounded-md border outline-none"
//           style={{ borderColor: COLORS.BORDER }}
//         />

//         {/* Table Card */}
//         <div
//           className="w-full max-w-6xl p-6 rounded-xl shadow-sm"
//           style={{
//             backgroundColor: COLORS.CARD_BG,
//             borderLeft: `5px solid ${COLORS.ACCENT}`,
//           }}
//         >
//           <div className="overflow-x-auto">
//             <table className="min-w-full border-collapse">
//               <thead>
//                 <tr style={{ backgroundColor: COLORS.PAGE_BG }}>
//                   <th className="py-3 px-4 text-left">Employee Name</th>
//                   <th className="py-3 px-4 text-left">Description</th>
//                   <th className="py-3 px-4 text-left">Date</th>
//                   <th className="py-3 px-4 text-left">Amount</th>
//                   <th className="py-3 px-4 text-left">Bill</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredExpenses.length > 0 ? (
//                   filteredExpenses.map((exp) => (
//                     <tr
//                       key={exp.id}
//                       className="border-b"
//                       style={{ borderColor: COLORS.BORDER }}
//                     >
//                       <td className="py-2 px-4">{exp.employee_name}</td>
//                       <td className="py-2 px-4">{exp.description}</td>
//                       <td className="py-2 px-4">{exp.date}</td>
//                       <td
//                         className="py-2 px-4 font-semibold"
//                         style={{ color: COLORS.ACCENT_DARK }}
//                       >
//                         ₹{exp.amount}
//                       </td>
//                       <td className="py-2 px-4">
//                         {exp.bill_image ? (
//                           <img
//                             src={exp.bill_image}
//                             alt="Bill"
//                             className="w-20 rounded-md border"
//                             style={{ borderColor: COLORS.BORDER }}
//                           />
//                         ) : (
//                           "-"
//                         )}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan="5"
//                       className="text-center py-6"
//                       style={{ color: COLORS.TEXT_MUTED }}
//                     >
//                       No expenses found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </AdminLayout>
//   );
// }

// export default AllExpenses;
