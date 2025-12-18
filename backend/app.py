import base64
import io
import uuid
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from openpyxl import Workbook
from firebase_setup import db

app = Flask(__name__)

# Allow frontend (Vercel) to access backend (Render)
CORS(app, supports_credentials=True)

# ----------------------------------------------------
# 🔐 SESSION VALIDATION
# ----------------------------------------------------
def validate_session(source):
    token = (
        source.get("session_token")
        if isinstance(source, dict)
        else request.args.get("session_token")
    )

    if not token:
        return None, jsonify({"error": "Session token missing"}), 401

    session_ref = db.collection("sessions").document(token).get()

    if not session_ref.exists:
        return None, jsonify({"error": "Invalid or expired session"}), 401

    return session_ref.to_dict(), None, None


# ----------------------------------------------------
# 🏠 ROOT (HEALTH CHECK)
# ----------------------------------------------------
@app.route("/")
def home():
    return jsonify({"status": "Backend running successfully 🚀"})


# ----------------------------------------------------
# 📝 SIGNUP
# ----------------------------------------------------
@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json(silent=True) or {}

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if not all([name, email, password, role]):
        return jsonify({"error": "All fields are required"}), 400

    user_doc = db.collection("users").document(email).get()
    if user_doc.exists:
        return jsonify({"error": "User already exists"}), 409

    hashed_password = generate_password_hash(password)

    db.collection("users").document(email).set({
        "name": name,
        "email": email,
        "password": hashed_password,
        "role": role
    })

    return jsonify({"message": "Signup successful"}), 201


# ----------------------------------------------------
# 🔐 LOGIN
# ----------------------------------------------------
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    user_ref = db.collection("users").document(email).get()
    if not user_ref.exists:
        return jsonify({"error": "User not found"}), 404

    user = user_ref.to_dict()

    if not check_password_hash(user["password"], password):
        return jsonify({"error": "Incorrect password"}), 401

    session_token = str(uuid.uuid4())
    db.collection("sessions").document(session_token).set({
        "email": email,
        "role": user["role"]
    })

    return jsonify({
        "message": "Login successful",
        "session": session_token,
        "user": {
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
    }), 200


# ----------------------------------------------------
# ➕ ADD EXPENSE
# ----------------------------------------------------
@app.route("/add-expense", methods=["POST"])
def add_expense():
    data = request.get_json(silent=True) or {}

    session, error, code = validate_session(data)
    if error:
        return error, code

    try:
        date = data.get("date")
        description = data.get("description")
        amount = float(data.get("amount", 0))
        bill_image = data.get("bill_image")
        email = data.get("email")

        if not all([date, description, bill_image, email]):
            return jsonify({"error": "Missing fields"}), 400

        balance_doc = db.collection("fund_balance").document("main").get()
        current_balance = balance_doc.to_dict().get("balance", 0) if balance_doc.exists else 0

        if amount > current_balance:
            return jsonify({
                "error": "Insufficient balance",
                "available_balance": current_balance
            }), 400

        db.collection("expenses").add({
            "date": date,
            "description": description,
            "amount": amount,
            "bill_image": bill_image,
            "email": email
        })

        db.collection("fund_balance").document("main").set({
            "balance": current_balance - amount
        })

        return jsonify({"message": "Expense stored successfully"}), 200

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": "Internal Server Error"}), 500


# ----------------------------------------------------
# 📄 GET MY EXPENSES
# ----------------------------------------------------
@app.route("/get-expenses/<email>", methods=["GET"])
def get_expenses(email):
    session, error, code = validate_session(request.args)
    if error:
        return error, code

    expenses = []
    for exp in db.collection("expenses").where("email", "==", email).stream():
        data = exp.to_dict()
        data["id"] = exp.id
        expenses.append(data)

    return jsonify({"expenses": expenses}), 200


# ----------------------------------------------------
# ➕ ADD FUND (ADMIN)
# ----------------------------------------------------
@app.route("/add-fund", methods=["POST"])
def add_fund():
    data = request.get_json(silent=True) or {}

    session, error, code = validate_session(data)
    if error:
        return error, code

    try:
        date = data.get("date")
        amount = float(data.get("amount", 0))
        description = data.get("description")
        admin_email = data.get("admin_email")

        if not all([date, amount, admin_email]):
            return jsonify({"error": "Missing fields"}), 400

        db.collection("funds").add({
            "date": date,
            "amount": amount,
            "description": description,
            "admin_email": admin_email
        })

        balance_doc = db.collection("fund_balance").document("main").get()
        current_balance = balance_doc.to_dict().get("balance", 0) if balance_doc.exists else 0

        db.collection("fund_balance").document("main").set({
            "balance": current_balance + amount
        })

        return jsonify({"message": "Fund added successfully"}), 200

    except:
        return jsonify({"error": "Internal Server Error"}), 500


# ----------------------------------------------------
# 📊 SUMMARY
# ----------------------------------------------------
@app.route("/get-summary", methods=["GET"])
def get_summary():
    session, error, code = validate_session(request.args)
    if error:
        return error, code

    total_fund = sum(float(f.to_dict().get("amount", 0)) for f in db.collection("funds").stream())
    total_expenses = sum(float(e.to_dict().get("amount", 0)) for e in db.collection("expenses").stream())

    balance_doc = db.collection("fund_balance").document("main").get()
    balance = balance_doc.to_dict().get("balance", 0) if balance_doc.exists else 0

    return jsonify({
        "total_fund": total_fund,
        "total_expenses": total_expenses,
        "balance": balance
    }), 200


# ----------------------------------------------------
# 📤 EXPORT EXCEL
# ----------------------------------------------------
@app.route("/admin/export-expenses-excel", methods=["GET"])
def export_expenses_excel():
    session, error, code = validate_session(request.args)
    if error:
        return error, code

    wb = Workbook()
    ws = wb.active
    ws.title = "Expenses"
    ws.append(["Employee Name", "Description", "Amount", "Date"])

    for exp in db.collection("expenses").stream():
        data = exp.to_dict()
        email = data.get("email")
        user_doc = db.collection("users").document(email).get()
        name = user_doc.to_dict().get("name") if user_doc.exists else "Unknown"

        ws.append([name, data.get("description"), data.get("amount"), data.get("date")])

    output = io.BytesIO()
    wb.save(output)
    output.seek(0)

    return send_file(
        output,
        as_attachment=True,
        download_name="expenses.xlsx",
        mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )


# ----------------------------------------------------
# 🔚 ENTRY POINT
# ----------------------------------------------------
if __name__ == "__main__":
    app.run()
