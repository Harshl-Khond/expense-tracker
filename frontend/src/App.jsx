import { Routes, Route } from "react-router-dom";

import Signup from "./pages/signup.jsx";
import Login from "./pages/Login.jsx";

import EmployeeDashboard from "./pages/EmployeeDashboard";
import Expense from "./pages/Expense";
import ShowExpenses from "./pages/ShowExpenses";

import AdminDashboard from "./pages/AdminDashboard";
import AddFund from "./pages/AddFund";
import FundDashboard from "./pages/FundDashboard";
import AllExpenses from "./pages/AllExpenses";

import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";

function App() {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* Unauthorized Page */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* ===========================
            EMPLOYEE PROTECTED ROUTES
         =========================== */}
      <Route
        path="/employee-dashboard"
        element={
          <ProtectedRoute role="employee">
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/expense"
        element={
          <ProtectedRoute role="employee">
            <Expense />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-expenses"
        element={
          <ProtectedRoute role="employee">
            <ShowExpenses />
          </ProtectedRoute>
        }
      />

      <Route
  path="/edit-expense/:id"
  element={
    <ProtectedRoute role="employee">
      <EditExpense />
    </ProtectedRoute>
  }
/>

      {/* ===========================
            ADMIN PROTECTED ROUTES
         =========================== */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/add-fund"
        element={
          <ProtectedRoute role="admin">
            <AddFund />
          </ProtectedRoute>
        }
      />

      <Route
        path="/fund-dashboard"
        element={
          <ProtectedRoute role="admin">
            <FundDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-expenses"
        element={
          <ProtectedRoute role="admin">
            <AllExpenses />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;
