import { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { api } from "../api";

const COLORS = {
  PAGE_BG: "#CAD2C5",
  CARD_BG: "#FFFFFF",
  NAVY: "#2F3E46",
  ACCENT: "#52796F",
  ACCENT_HOVER: "#3A5A40",
  TEXT_MAIN: "#1B1F23",
  TEXT_MUTED: "#4F5D5E",
  BORDER: "#84A98C",
  SUCCESS: "#2D6A4F",
};

function AddFund() {
  const admin = JSON.parse(localStorage.getItem("user"));
  const admin_email = admin?.email;

  const [form, setForm] = useState({
    date: "",
    amount: "",
    description: "",
  });

  const [balance, setBalance] = useState(0);
  const [message, setMessage] = useState("");

  const loadBalance = async () => {
    try {
      const res = await api.get("/get-summary");
      setBalance(res.data.balance || 0);
    } catch {
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    loadBalance();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/add-fund", {
        ...form,
        admin_email,
      });

      setMessage(res.data.message);
      setForm({ date: "", amount: "", description: "" });

      // Reload updated balance
      loadBalance();
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.clear();
        window.location.href = "/login";
        return;
      }
      setMessage("Failed to add fund");
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col items-center min-h-[70vh]">

        <h2 className="text-3xl font-semibold mb-2" style={{ color: COLORS.NAVY }}>
          Add New Fund
        </h2>
        <p className="mb-6" style={{ color: COLORS.TEXT_MUTED }}>
          Enter fund details below
        </p>

        {/* Balance Display */}
        <div
          className="w-full max-w-md p-4 mb-6 text-center rounded-lg shadow-sm"
          style={{
            backgroundColor: COLORS.CARD_BG,
            borderLeft: `5px solid ${COLORS.ACCENT}`,
          }}
        >
          <p style={{ color: COLORS.TEXT_MUTED }}>Current Available Balance</p>
          <p className="text-3xl font-bold" style={{ color: COLORS.SUCCESS }}>
            ₹{balance}
          </p>
        </div>

        {/* Form */}
        <div
          className="w-full max-w-md p-8 rounded-xl shadow-sm"
          style={{
            backgroundColor: COLORS.CARD_BG,
            borderLeft: `5px solid ${COLORS.ACCENT}`,
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded"
            />

            <input
              type="number"
              name="amount"
              placeholder="Enter amount"
              value={form.amount}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded"
            />

            <input
              type="text"
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded"
            />

            <button
              type="submit"
              className="w-full py-2 rounded text-white font-semibold"
              style={{ backgroundColor: COLORS.ACCENT }}
            >
              Add Fund
            </button>
          </form>

          {message && (
            <p className="text-center mt-4 font-medium" style={{ color: COLORS.NAVY }}>
              {message}
            </p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AddFund;

// import { useState } from "react";
// import AdminLayout from "../layouts/AdminLayout";
// import { api } from "../api";

// const COLORS = {
//   PAGE_BG: "#CAD2C5",
//   CARD_BG: "#FFFFFF",
//   NAVY: "#2F3E46",
//   ACCENT: "#52796F",
//   ACCENT_HOVER: "#3A5A40",
//   TEXT_MAIN: "#1B1F23",
//   TEXT_MUTED: "#4F5D5E",
//   BORDER: "#84A98C",
// };

// function AddFund() {
//   const admin = JSON.parse(localStorage.getItem("user"));
//   const admin_email = admin?.email;

//   const [form, setForm] = useState({
//     date: "",
//     amount: "",
//     description: "",
//   });

//   const [message, setMessage] = useState("");

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await api.post("/add-fund", {
//         ...form,
//         admin_email,
//       });

//       setMessage(res.data.message);
//       setForm({ date: "", amount: "", description: "" });
//     } catch (err) {
//       if (err.response?.status === 401) {
//         setMessage("Session expired. Please login again.");
//         localStorage.clear();
//         window.location.href = "/login";
//         return;
//       }
//       setMessage("Failed to add fund");
//     }
//   };

//   return (
//     <AdminLayout>
//       {/* Center Wrapper */}
//       <div className="flex flex-col items-center justify-center min-h-[70vh]">

//         {/* Page Title */}
//         <h2
//           className="text-3xl font-semibold mb-2"
//           style={{ color: COLORS.NAVY }}
//         >
//           Add New Fund
//         </h2>
//         <p className="mb-6" style={{ color: COLORS.TEXT_MUTED }}>
//           Enter fund details below
//         </p>

//         {/* Form Card */}
//         <div
//           className="w-full max-w-md p-8 rounded-xl shadow-sm"
//           style={{
//             backgroundColor: COLORS.CARD_BG,
//             borderLeft: `5px solid ${COLORS.ACCENT}`,
//           }}
//         >
//           <form onSubmit={handleSubmit} className="space-y-5">

//             {/* Date */}
//             <div>
//               <label
//                 className="block mb-1 font-medium"
//                 style={{ color: COLORS.TEXT_MAIN }}
//               >
//                 Date
//               </label>
//               <input
//                 type="date"
//                 name="date"
//                 value={form.date}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 rounded-md border outline-none"
//                 style={{ borderColor: COLORS.BORDER }}
//                 required
//               />
//             </div>

//             {/* Amount */}
//             <div>
//               <label
//                 className="block mb-1 font-medium"
//                 style={{ color: COLORS.TEXT_MAIN }}
//               >
//                 Amount
//               </label>
//               <input
//                 type="number"
//                 name="amount"
//                 placeholder="Enter amount"
//                 value={form.amount}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 rounded-md border outline-none"
//                 style={{ borderColor: COLORS.BORDER }}
//                 required
//               />
//             </div>

//             {/* Description */}
//             <div>
//               <label
//                 className="block mb-1 font-medium"
//                 style={{ color: COLORS.TEXT_MAIN }}
//               >
//                 Description
//               </label>
//               <input
//                 type="text"
//                 name="description"
//                 placeholder="Description"
//                 value={form.description}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 rounded-md border outline-none"
//                 style={{ borderColor: COLORS.BORDER }}
//                 required
//               />
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               className="w-full py-2.5 rounded-md font-semibold text-white transition"
//               style={{ backgroundColor: COLORS.ACCENT }}
//               onMouseOver={(e) =>
//                 (e.currentTarget.style.backgroundColor = COLORS.ACCENT_HOVER)
//               }
//               onMouseOut={(e) =>
//                 (e.currentTarget.style.backgroundColor = COLORS.ACCENT)
//               }
//             >
//               Add Fund
//             </button>
//           </form>

//           {/* Message */}
//           {message && (
//             <p
//               className="text-center mt-4 font-medium"
//               style={{ color: COLORS.NAVY }}
//             >
//               {message}
//             </p>
//           )}
//         </div>
//       </div>
//     </AdminLayout>
//   );
// }

// export default AddFund;
