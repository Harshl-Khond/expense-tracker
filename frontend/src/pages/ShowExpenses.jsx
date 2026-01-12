import { useEffect, useState } from "react";
import EmployeeLayout from "../layouts/EmployeeLayout";
import { api } from "../api";

function ShowExpenses() {
  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email;

  const [expenses, setExpenses] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ date: "", description: "", amount: "" });
  const [message, setMessage] = useState("");

  const loadExpenses = async () => {
    try {
      if (!email) {
        setMessage("User not found. Please login again.");
        return;
      }

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
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const startEdit = (exp) => {
    setEditing(exp);
    setForm({
      date: exp.date || "",
      description: exp.description || "",
      amount: exp.amount || "",
    });
    setMessage("");
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const updateExpense = async () => {
    try {
      await api.put("/update-expense", {
        expense_id: editing.id,
        ...form,
      });

      setEditing(null);
      loadExpenses();
      setMessage("Expense updated successfully");
    } catch (err) {
      setMessage(err.response?.data?.error || "Update failed");
    }
  };

  return (
    <EmployeeLayout>
      <div className="p-4 max-w-5xl mx-auto">

        <h2 className="text-2xl mb-4 text-center font-semibold">
          My Expenses
        </h2>

        {message && (
          <p className="text-center text-red-600 mb-4">{message}</p>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Date</th>
                <th className="p-2">Description</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Status</th>
                <th className="p-2">Edit</th>
              </tr>
            </thead>

            <tbody>
              {expenses.length > 0 ? (
                expenses.map((e) => (
                  <tr key={e.id} className="border-b text-center">
                    <td className="p-2">{e.date}</td>
                    <td className="p-2">{e.description}</td>
                    <td className="p-2">₹{e.amount}</td>
                    <td className="p-2">{e.status}</td>
                    <td className="p-2">
                      {e.status === "PENDING" && (
                        <button
                          onClick={() => startEdit(e)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-500">
                    No expenses found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Edit Form */}
        {editing && (
          <div className="mt-6 p-4 border rounded bg-white shadow max-w-md mx-auto">
            <h3 className="text-lg mb-3 text-center">Edit Expense</h3>

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

            <div className="flex justify-between">
              <button
                onClick={updateExpense}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>

              <button
                onClick={() => setEditing(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

      </div>
    </EmployeeLayout>
  );
}

export default ShowExpenses;




// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import EmployeeLayout from "../layouts/EmployeeLayout";
// import { api } from "../api";

// const COLORS = {
//   PAGE_BG: "#E6EDF3",
//   CARD_BG: "#FFFFFF",
//   NAVY: "#3A5A7A",
//   ACCENT: "#5C8DB8",
//   ACCENT_DARK: "#4A7AA3",
//   SUCCESS: "#3A7D44",
//   TEXT_MAIN: "#1F2A37",
//   TEXT_MUTED: "#4B5563",
//   BORDER: "#B6C7D6",
// };

// function ShowExpenses() {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const email = user?.email;

//   const navigate = useNavigate();

//   const [expenses, setExpenses] = useState([]);
//   const [filteredExpenses, setFilteredExpenses] = useState([]);
//   const [filterDate, setFilterDate] = useState("");
//   const [filterDescription, setFilterDescription] = useState("");
//   const [message, setMessage] = useState("");

//   const fetchExpenses = async () => {
//     try {
//       const res = await api.get(`/get-expenses/${email}`);
//       setExpenses(res.data.expenses || []);
//       setFilteredExpenses(res.data.expenses || []);
//     } catch (err) {
//       console.log("Error fetching expenses", err);
//       if (err.response?.status === 401) {
//         setMessage("Session expired. Please login again.");
//         localStorage.clear();
//         window.location.href = "/login";
//       }
//     }
//   };

//   useEffect(() => {
//     fetchExpenses();
//   }, []);

//   useEffect(() => {
//     let data = [...expenses];

//     if (filterDate) {
//       data = data.filter((exp) => exp.date === filterDate);
//     }
//     if (filterDescription) {
//       data = data.filter((exp) =>
//         exp.description.toLowerCase().includes(filterDescription.toLowerCase())
//       );
//     }
//     setFilteredExpenses(data);
//   }, [filterDate, filterDescription, expenses]);

//   const handleEdit = (exp) => {
//     // navigate to update page and pass the expense in state to avoid refetching
//     navigate(`/update-expense/${exp.id}`, { state: { expense: exp } });
//   };

//   return (
//     <EmployeeLayout>
//       {/* Center Wrapper */}
//       <div className="flex flex-col items-center justify-center min-h-[70vh]">

//         {/* Title */}
//         <h2
//           className="text-3xl font-semibold mb-2"
//           style={{ color: COLORS.NAVY }}
//         >
//           My Expenses
//         </h2>
//         <p className="mb-6 text-center" style={{ color: COLORS.TEXT_MUTED }}>
//           View, filter, and review all your past expenses
//         </p>

//         {message && (
//           <p className="mb-4 font-medium" style={{ color: COLORS.ACCENT_DARK }}>
//             {message}
//           </p>
//         )}

//         {/* Filters */}
//         <div className="flex gap-4 mb-6 flex-wrap justify-center">
//           <input
//             type="date"
//             onChange={(e) => setFilterDate(e.target.value)}
//             className="px-4 py-2 rounded-md border outline-none"
//             style={{ borderColor: COLORS.BORDER }}
//           />

//           <input
//             type="text"
//             placeholder="Search description"
//             onChange={(e) => setFilterDescription(e.target.value)}
//             className="px-4 py-2 rounded-md border outline-none w-64"
//             style={{ borderColor: COLORS.BORDER }}
//           />
//         </div>

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
//                   <th className="py-3 px-4 text-left">Description</th>
//                   <th className="py-3 px-4 text-left">Amount</th>
//                   <th className="py-3 px-4 text-left">Date</th>
//                   <th className="py-3 px-4 text-left">Bill</th>
//                   <th className="py-3 px-4 text-left">Actions</th>
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
//                       <td className="py-2 px-4">{exp.description}</td>
//                       <td
//                         className="py-2 px-4 font-semibold"
//                         style={{ color: COLORS.SUCCESS }}
//                       >
//                         ₹{exp.amount}
//                       </td>
//                       <td className="py-2 px-4">{exp.date}</td>
//                       <td className="py-2 px-4">
//                         {exp.bill_image ? (
//                           <img
//                             src={exp.bill_image}
//                             alt="bill"
//                             className="w-20 h-20 object-cover rounded-md border"
//                             style={{ borderColor: COLORS.BORDER }}
//                           />
//                         ) : (
//                           "-"
//                         )}
//                       </td>
//                       <td className="py-2 px-4">
//                         <button
//                           onClick={() => handleEdit(exp)}
//                           className="px-3 py-1 rounded-md text-white"
//                           style={{ backgroundColor: COLORS.ACCENT_DARK }}
//                         >
//                           Edit
//                         </button>
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
//     </EmployeeLayout>
//   );
// }

// export default ShowExpenses;






// import { useEffect, useState } from "react";
// import EmployeeLayout from "../layouts/EmployeeLayout";
// import { api } from "../api";

// const COLORS = {
//   PAGE_BG: "#E6EDF3",
//   CARD_BG: "#FFFFFF",
//   NAVY: "#3A5A7A",
//   ACCENT: "#5C8DB8",
//   ACCENT_DARK: "#4A7AA3",
//   SUCCESS: "#3A7D44",
//   TEXT_MAIN: "#1F2A37",
//   TEXT_MUTED: "#4B5563",
//   BORDER: "#B6C7D6",
// };

// function ShowExpenses() {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const email = user?.email;

//   const [expenses, setExpenses] = useState([]);
//   const [filteredExpenses, setFilteredExpenses] = useState([]);
//   const [filterDate, setFilterDate] = useState("");
//   const [filterDescription, setFilterDescription] = useState("");
//   const [message, setMessage] = useState("");

//   const fetchExpenses = async () => {
//     try {
//       const res = await api.get(`/get-expenses/${email}`);
//       setExpenses(res.data.expenses || []);
//       setFilteredExpenses(res.data.expenses || []);
//     } catch (err) {
//       console.log("Error fetching expenses", err);
//       if (err.response?.status === 401) {
//         setMessage("Session expired. Please login again.");
//         localStorage.clear();
//         window.location.href = "/login";
//       }
//     }
//   };

//   useEffect(() => {
//     fetchExpenses();
//   }, []);

//   useEffect(() => {
//     let data = [...expenses];

//     if (filterDate) {
//       data = data.filter((exp) => exp.date === filterDate);
//     }
//     if (filterDescription) {
//       data = data.filter((exp) =>
//         exp.description.toLowerCase().includes(filterDescription.toLowerCase())
//       );
//     }
//     setFilteredExpenses(data);
//   }, [filterDate, filterDescription, expenses]);

//   return (
//     <EmployeeLayout>
//       {/* Center Wrapper */}
//       <div className="flex flex-col items-center justify-center min-h-[70vh]">

//         {/* Title */}
//         <h2
//           className="text-3xl font-semibold mb-2"
//           style={{ color: COLORS.NAVY }}
//         >
//           My Expenses
//         </h2>
//         <p className="mb-6 text-center" style={{ color: COLORS.TEXT_MUTED }}>
//           View, filter, and review all your past expenses
//         </p>

//         {message && (
//           <p className="mb-4 font-medium" style={{ color: COLORS.ACCENT_DARK }}>
//             {message}
//           </p>
//         )}

//         {/* Filters */}
//         <div className="flex gap-4 mb-6 flex-wrap justify-center">
//           <input
//             type="date"
//             onChange={(e) => setFilterDate(e.target.value)}
//             className="px-4 py-2 rounded-md border outline-none"
//             style={{ borderColor: COLORS.BORDER }}
//           />

//           <input
//             type="text"
//             placeholder="Search description"
//             onChange={(e) => setFilterDescription(e.target.value)}
//             className="px-4 py-2 rounded-md border outline-none w-64"
//             style={{ borderColor: COLORS.BORDER }}
//           />
//         </div>

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
//                   <th className="py-3 px-4 text-left">Description</th>
//                   <th className="py-3 px-4 text-left">Amount</th>
//                   <th className="py-3 px-4 text-left">Date</th>
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
//                       <td className="py-2 px-4">{exp.description}</td>
//                       <td
//                         className="py-2 px-4 font-semibold"
//                         style={{ color: COLORS.SUCCESS }}
//                       >
//                         ₹{exp.amount}
//                       </td>
//                       <td className="py-2 px-4">{exp.date}</td>
//                       <td className="py-2 px-4">
//                         {exp.bill_image ? (
//                           <img
//                             src={exp.bill_image}
//                             alt="bill"
//                             className="w-20 h-20 object-cover rounded-md border"
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
//                       colSpan="4"
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
//     </EmployeeLayout>
//   );
// }

// export default ShowExpenses;
