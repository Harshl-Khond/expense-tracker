💰 Expense Tracker System

A full-stack Expense Tracker Web Application that helps organizations manage funds and employee expenses in a clean, secure, and approval-based workflow.

Employees can submit expenses with optional bill images, and admins can review, approve, and manage funds — ensuring accurate accounting and controlled spending.

# What This Project Does

This system is designed to solve a real-world problem:

Expenses should not affect company funds until they are approved.

So the workflow is:

Employees submit expenses → Pending

Admin reviews expenses → Approve or reject

Only approved expenses affect total spending and balance

# User Roles
# Employee

Register and log in securely

Add new expenses (bill image optional)

Edit or delete expenses before approval

View all personal expenses with status:

PENDING

DISBURSED

Upload and preview bill images

# Admin

Log in with admin access

Add company funds

View all employee expenses

Approve expenses (fund deducted only after approval)

See updated balance in real time

Export all expenses to Excel (date-wise sorted)

# Security & Rules

Session-based authentication (secure tokens)

Employees can only see their own expenses

Approved expenses cannot be edited or deleted

Fund balance is deducted only on admin approval

All critical actions are protected by role checks

# Tech Stack
Frontend

React (Vite)

React Router

Axios

Tailwind CSS

Browser Image Compression

Backend

Flask

Firebase Firestore

Flask-CORS

Werkzeug (password hashing)

OpenPyXL (Excel export)

 # Project Structure (Simplified)
frontend/
 ├─ pages/
 │  ├─ Login.jsx
 │  ├─ Signup.jsx
 │  ├─ Expense.jsx
 │  ├─ ShowExpenses.jsx
 │  ├─ EditExpense.jsx
 │  ├─ AdminDashboard.jsx
 │  └─ AllExpenses.jsx
 ├─ layouts/
 │  ├─ EmployeeLayout.jsx
 │  └─ AdminLayout.jsx
 ├─ api.js
 └─ App.jsx

backend/
 ├─ app.py
 ├─ firebase_setup.py
 └─ requirements.txt

# Expense Flow (Very Important)
Employee adds expense
        ↓
Status = PENDING
        ↓
X Not counted in total expenses
X No balance deduction

Admin approves expense
        ↓
Status = DISBURSED
        ↓
 Counted in total expenses
 Balance deducted


This makes the system financially accurate and audit-safe.

 Key Features

 Role-based dashboards (Admin / Employee)

--> Expense approval workflow

--> Bill image upload & preview

--> Edit & delete before approval

--> Secure session handling

--> Real-time balance tracking

--> Excel export (date-wise ascending)

--> Mobile-responsive UI

--> Clean and user-friendly design

# How to Run the Project
Backend (Flask)
cd backend
python app.py

Frontend (React)
cd frontend
npm install
npm run dev


Create a .env file in frontend:

VITE_API_URL=http://localhost:5000

# Excel Export

Admins can export all expenses to an Excel file:

Sorted by date (ascending)

Includes:

Employee Name

Description

Amount

Date

* Status Values Used
Status	Meaning
PENDING	Waiting for admin approval
DISBURSED	Approved and paid


* Author

Developed by: Carradina
Role: Full-Stack Developer
Skills Used: React, Flask, Firebase, REST APIs, Authentication, UI/UX
