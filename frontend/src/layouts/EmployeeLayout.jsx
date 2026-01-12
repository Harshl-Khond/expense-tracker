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
    <div
      className="min-h-screen"
      style={{ backgroundColor: COLORS.PAGE_BG, color: COLORS.TEXT_MUTED }}
    >
      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 w-full z-50 shadow-md"
        style={{ backgroundColor: COLORS.NAVBAR }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-white">
            Employee Panel
          </h1>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {[
              ["Dashboard", "/employee-dashboard"],
              ["Add Expense", "/expense"],
              ["My Expenses", "/my-expenses"],
            ].map(([label, path]) => (
              <Link
                key={label}
                to={path}
                className="font-medium hover:underline"
                style={{ color: "#EAF2FA" }}
              >
                {label}
              </Link>
            ))}

            <button
              onClick={logout}
              className="px-4 py-2 rounded-md font-medium text-white transition"
              style={{ backgroundColor: COLORS.ACCENT }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = COLORS.ACCENT_HOVER)
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = COLORS.ACCENT)
              }
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl text-white"
            onClick={() => setOpenMenu(!openMenu)}
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {openMenu && (
          <div
            className="md:hidden px-6 pb-4"
            style={{ backgroundColor: COLORS.NAVBAR_DARK }}
          >
            <div className="flex flex-col gap-3 text-white">
              {[
                ["Dashboard", "/employee-dashboard"],
                ["Add Expense", "/expense"],
                ["My Expenses", "/get_expenses"],
              ].map(([label, path]) => (
                <Link
                  key={label}
                  to={path}
                  onClick={() => setOpenMenu(false)}
                  className="py-2"
                >
                  {label}
                </Link>
              ))}

              <button
                onClick={logout}
                className="mt-2 px-4 py-2 rounded-md font-medium"
                style={{ backgroundColor: COLORS.ACCENT }}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Card */}
          <div
            className="rounded-xl p-6 mb-6 shadow-sm"
            style={{
              backgroundColor: COLORS.CARD_BG,
              borderLeft: `5px solid ${COLORS.ACCENT}`,
              color: COLORS.TEXT_MAIN,
            }}
          >
            <h3 className="text-2xl font-semibold">
              Welcome, Employee
            </h3>
          </div>

          {/* Content Card */}
          <div
            className="rounded-xl p-6 shadow-sm"
            style={{
              backgroundColor: COLORS.CARD_BG,
              color: COLORS.TEXT_MUTED,
            }}
          >
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default EmployeeLayout;
