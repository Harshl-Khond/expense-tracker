import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeLayout from "../layouts/EmployeeLayout";
import { api } from "../api";

function ShowExpenses() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email;

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadExpenses = async () => {
    try {
      const res = await api.get(`/get-expenses/${email}`);
      setExpenses(res.data.expenses || []);
    } catch (err) {
      setMessage("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const deleteExpense = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    try {
      await api.delete("/delete-expense", {
        data: { expense_id: id }
      });
      loadExpenses();
    } catch (err) {
      alert(err.response?.data?.error || "Delete failed");
    }
  };

  return (
    <EmployeeLayout>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-center">My Expenses</h2>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Bill</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {expenses.map((e) => (
                  <tr key={e.id} className="border-t text-center">
                    <td className="p-3">{e.date}</td>
                    <td className="p-3">{e.description}</td>
                    <td className="p-3 font-semibold">₹{e.amount}</td>

                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        e.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}>
                        {e.status}
                      </span>
                    </td>

                    <td className="p-3">
                      {e.bill_image ? (
                        <img
                          src={e.bill_image}
                          alt="Bill"
                          className="w-14 h-14 object-cover rounded cursor-pointer"
                          onClick={() => window.open(e.bill_image, "_blank")}
                        />
                      ) : "-"}
                    </td>

                    <td className="p-3 space-x-2">
                      {e.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => navigate(`/edit-expense/${e.id}`)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => deleteExpense(e.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-xs"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {message && <p className="text-center text-red-600 mt-4">{message}</p>}
      </div>
    </EmployeeLayout>
  );
}

export default ShowExpenses;

// import { useEffect, useState } from "react";
// import EmployeeLayout from "../layouts/EmployeeLayout";
// import { api } from "../api";

// function ShowExpenses() {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const email = user?.email;

//   const [expenses, setExpenses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState("");

//   const [editing, setEditing] = useState(null);
//   const [form, setForm] = useState({
//     date: "",
//     description: "",
//     amount: ""
//   });

//   /* ============================
//      LOAD EXPENSES
//   ============================ */
//   const loadExpenses = async () => {
//     try {
//       const res = await api.get(`/get-expenses/${email}`);
//       setExpenses(res.data.expenses || []);
//       setMessage("");
//     } catch (err) {
//       if (err.response?.status === 401) {
//         setMessage("Session expired. Please login again.");
//         localStorage.clear();
//         window.location.href = "/login";
//       } else if (err.response?.status === 403) {
//         setMessage("Unauthorized access.");
//       } else {
//         setMessage("Failed to load expenses");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadExpenses();
//   }, []);

//   /* ============================
//      EDIT
//   ============================ */
//   const startEdit = (exp) => {
//     setEditing(exp);
//     setForm({
//       date: exp.date,
//       description: exp.description,
//       amount: exp.amount
//     });
//   };

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const updateExpense = async () => {
//     try {
//       await api.put("/update-expense", {
//         expense_id: editing.id,
//         ...form
//       });

//       setEditing(null);
//       loadExpenses();
//       setMessage("Expense updated successfully");
//     } catch (err) {
//       setMessage(err.response?.data?.error || "Update failed");
//     }
//   };

//   return (
//     <EmployeeLayout>
//       <div className="max-w-6xl mx-auto">

//         <h2 className="text-2xl font-semibold mb-4 text-[#1F2A37] text-center">
//           My Expenses
//         </h2>

//         {message && (
//           <p className="mb-4 text-red-600 text-center">{message}</p>
//         )}

//         {loading ? (
//           <p className="text-center text-gray-600">Loading...</p>
//         ) : (
//           <div className="overflow-x-auto bg-white rounded-lg shadow">
//             <table className="min-w-full text-sm">
//               <thead className="bg-[#E6EDF3] text-[#1F2A37]">
//                 <tr>
//                   <th className="p-3">Date</th>
//                   <th className="p-3">Description</th>
//                   <th className="p-3">Amount</th>
//                   <th className="p-3">Status</th>
//                   <th className="p-3">Bill</th>
//                   <th className="p-3">Edit</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {expenses.length > 0 ? (
//                   expenses.map((e) => (
//                     <tr key={e.id} className="border-t text-center">
//                       <td className="p-3">{e.date}</td>
//                       <td className="p-3">{e.description}</td>
//                       <td className="p-3 font-semibold text-[#3A5A7A]">
//                         ₹{e.amount}
//                       </td>

//                       <td className="p-3">
//                         <span
//                           className={`px-3 py-1 rounded-full text-xs font-medium ${
//                             e.status === "PENDING"
//                               ? "bg-yellow-100 text-yellow-700"
//                               : "bg-green-100 text-green-700"
//                           }`}
//                         >
//                           {e.status}
//                         </span>
//                       </td>

//                       {/* BILL IMAGE */}
//                       <td className="p-3">
//                         {e.bill_image ? (
//                           <img
//                             src={e.bill_image}
//                             alt="Bill"
//                             className="w-16 h-16 object-cover rounded border cursor-pointer hover:scale-105 transition"
//                             onClick={() =>
//                               window.open(e.bill_image, "_blank")
//                             }
//                           />
//                         ) : (
//                           "-"
//                         )}
//                       </td>

//                       {/* EDIT */}
//                       <td className="p-3">
//                         {e.status === "PENDING" && (
//                           <button
//                             onClick={() => startEdit(e)}
//                             className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
//                           >
//                             Edit
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="6" className="p-6 text-center text-gray-500">
//                       No expenses found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* ============================
//             EDIT FORM (TOGGLE)
//         ============================ */}
//         {editing && (
//           <div className="mt-8 p-4 border rounded bg-white shadow max-w-md mx-auto">
//             <h3 className="text-lg mb-3 text-center font-semibold">
//               Edit Expense
//             </h3>

//             <input
//               type="date"
//               name="date"
//               value={form.date}
//               onChange={handleChange}
//               className="w-full border p-2 mb-2 rounded"
//             />

//             <input
//               name="description"
//               value={form.description}
//               onChange={handleChange}
//               className="w-full border p-2 mb-2 rounded"
//               placeholder="Description"
//             />

//             <input
//               type="number"
//               name="amount"
//               value={form.amount}
//               onChange={handleChange}
//               className="w-full border p-2 mb-4 rounded"
//               placeholder="Amount"
//             />

//             <div className="flex justify-between">
//               <button
//                 onClick={updateExpense}
//                 className="bg-green-600 text-white px-4 py-2 rounded"
//               >
//                 Save
//               </button>

//               <button
//                 onClick={() => setEditing(null)}
//                 className="bg-gray-500 text-white px-4 py-2 rounded"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         )}

//       </div>
//     </EmployeeLayout>
//   );
// }

// export default ShowExpenses;

// import { useEffect, useState } from "react";
// import EmployeeLayout from "../layouts/EmployeeLayout";
// import { api } from "../api";

// function ShowExpenses() {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const email = user?.email;

//   const [expenses, setExpenses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState("");

//   const loadExpenses = async () => {
//     try {
//       const res = await api.get(`/get-expenses/${email}`);
//       setExpenses(res.data.expenses || []);
//       setMessage("");
//     } catch (err) {
//       if (err.response?.status === 401) {
//         setMessage("Session expired. Please login again.");
//         localStorage.clear();
//         window.location.href = "/login";
//       } else if (err.response?.status === 403) {
//         setMessage("Unauthorized access.");
//       } else {
//         setMessage("Failed to load expenses");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadExpenses();
//   }, []);

//   return (
//     <EmployeeLayout>
//       <div className="max-w-6xl mx-auto">

//         <h2 className="text-2xl font-semibold mb-4 text-[#1F2A37]">
//           My Expenses
//         </h2>

//         {message && (
//           <p className="mb-4 text-red-600 text-center">{message}</p>
//         )}

//         {loading ? (
//           <p className="text-center text-gray-600">Loading...</p>
//         ) : (
//           <div className="overflow-x-auto bg-white rounded-lg shadow">
//             <table className="min-w-full text-sm">
//               <thead className="bg-[#E6EDF3] text-[#1F2A37]">
//                 <tr>
//                   <th className="p-3 text-left">Date</th>
//                   <th className="p-3 text-left">Description</th>
//                   <th className="p-3 text-left">Amount</th>
//                   <th className="p-3 text-left">Status</th>
//                   <th className="p-3 text-left">Bill</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {expenses.length > 0 ? (
//                   expenses.map((e) => (
//                     <tr key={e.id} className="border-t">
//                       <td className="p-3">{e.date}</td>
//                       <td className="p-3">{e.description}</td>
//                       <td className="p-3 font-semibold text-[#3A5A7A]">
//                         ₹{e.amount}
//                       </td>
//                       <td className="p-3">
//                         <span
//                           className={`px-3 py-1 rounded-full text-xs font-medium ${
//                             e.status === "PENDING"
//                               ? "bg-yellow-100 text-yellow-700"
//                               : "bg-green-100 text-green-700"
//                           }`}
//                         >
//                           {e.status}
//                         </span>
//                       </td>
//                       <td className="p-3">
//   {e.bill_image ? (
//     <img
//       src={e.bill_image}
//       alt="Bill"
//       className="w-16 h-16 object-cover rounded border cursor-pointer hover:scale-105 transition"
//       onClick={() => window.open(e.bill_image, "_blank")}
//     />
//   ) : (
//     "-"
//   )}
// </td>

//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan="5"
//                       className="p-6 text-center text-gray-500"
//                     >
//                       No expenses found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </EmployeeLayout>
//   );
// }

// export default ShowExpenses;
