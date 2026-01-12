import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Footer from "../components/Footer";

const COLORS = {
  NAVBAR: "#3A5A7A",
  NAVBAR_DARK: "#2F4B66",
  PAGE_BG: "#E6EDF3",
  CARD_BG: "#FFFFFF",
  ACCENT: "#5C8DB8",
  ACCENT_HOVER: "#4A7AA3",
  TEXT_MAIN: "#1F2A37",
  TEXT_MUTED: "#4B5563",
};

function EmployeeLayout({ children }) {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.PAGE_BG }}>
      <nav className="fixed top-0 w-full z-50" style={{ backgroundColor: COLORS.NAVBAR }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <h1 className="text-xl text-white font-semibold">Employee Panel</h1>

          {/* Desktop */}
          <div className="hidden md:flex gap-6">
            <Link to="/employee-dashboard" className="text-white">Dashboard</Link>
            <Link to="/expense" className="text-white">Add Expense</Link>
            <Link to="/my-expenses" className="text-white">My Expenses</Link>

            <button onClick={logout} className="bg-blue-500 text-white px-4 py-2 rounded">
              Logout
            </button>
          </div>

          {/* Mobile */}
          <button onClick={() => setOpenMenu(!openMenu)} className="md:hidden text-white text-xl">
            ☰
          </button>
        </div>

        {openMenu && (
          <div className="md:hidden bg-[#2F4B66] p-4 flex flex-col gap-3">
            <Link to="/employee-dashboard" onClick={() => setOpenMenu(false)}>Dashboard</Link>
            <Link to="/expense" onClick={() => setOpenMenu(false)}>Add Expense</Link>
            <Link to="/my-expenses" onClick={() => setOpenMenu(false)}>My Expenses</Link>

            <button onClick={logout} className="bg-blue-500 text-white py-2 rounded">
              Logout
            </button>
          </div>
        )}
      </nav>

      <main className="pt-24 p-4">{children}</main>
      <Footer />
    </div>
  );
}

export default EmployeeLayout;
