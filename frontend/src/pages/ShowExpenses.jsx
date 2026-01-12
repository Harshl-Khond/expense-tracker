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

  // Helper to determine status text from various possible fields
  const getStatusText = (exp) => {
    // If backend sends a string status
    if (exp.status && typeof exp.status === "string") {
      return exp.status.toLowerCase() === "pending" ? "Pending" : "Disbursed";
    }

    // If backend sends boolean/number flags
    const disbursed =
      exp.disbursed !== undefined
        ? exp.disbursed
        : exp.is_disbursed !== undefined
        ? exp.is_disbursed
        : null;

    if (disbursed === false || disbursed === 0 || disbursed === "0") return "Pending";
    if (disbursed === true || disbursed === 1 || disbursed === "1") return "Disbursed";

    // Fallback: if there's a field named pending
    if (exp.pending !== undefined) return exp.pending ? "Pending" : "Disbursed";

    // Default to Pending when unsure
    return "Pending";
  };

  const getStatusStyle = (status) => {
    if (status === "Disbursed") {
      return {
        backgroundColor: "#E6F4EA",
        color: COLORS.SUCCESS,
      };
    }
    // Pending
    return {
      backgroundColor: "#FFF7E6",
      color: "#B7791F",
    };
  };

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
                  <th className="py-3 px-4 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredExpenses.length > 0 ? (
                  filteredExpenses.map((exp) => {
                    const statusText = getStatusText(exp);
                    return (
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
                        <td className="py-2 px-4">
                          <span
                            className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                            style={getStatusStyle(statusText)}
                          >
                            {statusText}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="5"
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
