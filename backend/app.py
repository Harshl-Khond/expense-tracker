import base64
import io
from flask import Flask, request, jsonify, send_file
from werkzeug.security import generate_password_hash, check_password_hash
from firebase_setup import db
from flask_cors import CORS
import uuid
from openpyxl import Workbook

app = Flask(__name__)
CORS(app)

# ----------------------------------------------------
# 🔐 SESSION VALIDATION FUNCTION
# ----------------------------------------------------
def validate_session(data):
    token = data.get("session_token") if isinstance(data, dict) else request.args.get("session_token")

    if not token:
        return False, jsonify({"error": "Session token missing"}), 401

    session_ref = db.collection("sessions").document(token).get()

    if not session_ref.exists:
        return False, jsonify({"error": "Invalid or expired session"}), 401

    return True, session_ref.to_dict(), 200


# ------------------- SIGNUP API -------------------
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if not name or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    user_ref = db.collection("users").document(email).get()
    if user_ref.exists:
        return jsonify({"error": "User already exists"}), 409

    hashed_password = generate_password_hash(password)

    db.collection("users").document(email).set({
        "name": name,
        "email": email,
        "password": hashed_password,
        "role": role
    })

    return jsonify({"message": "Signup successful"}), 201


# ------------------- LOGIN API -------------------
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and Password are required"}), 400

    user_ref = db.collection("users").document(email).get()
    if not user_ref.exists:
        return jsonify({"error": "User not found"}), 404

    user = user_ref.to_dict()

    if not check_password_hash(user["password"], password):
        return jsonify({"error": "Incorrect password"}), 401

    # CREATE SESSION TOKEN
    session_token = str(uuid.uuid4())
    db.collection("sessions").document(session_token).set({
        "email": email,
        "role": user["role"]
    })

    return jsonify({
        "message": "Login successful",
        "session": session_token,   # 🔥 return session
        "user": {
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
    }), 200


# ------------------- ADD EXPENSE -------------------
@app.route("/add-expense", methods=["POST"])
def add_expense():
    data = request.json

    valid, sess, code = validate_session(data)
    if not valid:
        return sess, code

    try:
        date = data.get("date")
        description = data.get("description")
        amount = float(data.get("amount"))
        bill_image_base64 = data.get("bill_image")
        email = data.get("email")

        if not all([date, description, amount, bill_image_base64, email]):
            return jsonify({"error": "Missing fields"}), 400

        balance_doc = db.collection("fund_balance").document("main").get()
        current_balance = balance_doc.to_dict().get("balance", 0) if balance_doc.exists else 0

        if amount > current_balance:
            return jsonify({"error": "Insufficient balance", "available_balance": current_balance}), 400

        db.collection("expenses").add({
            "date": date,
            "description": description,
            "amount": amount,
            "bill_image": bill_image_base64,
            "email": email
        })

        new_balance = current_balance - amount

        db.collection("fund_balance").document("main").set({"balance": new_balance})

        return jsonify({"message": "Expense stored successfully", "new_balance": new_balance}), 200

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": "Internal Server Error"}), 500


# ------------------- GET MY EXPENSES -------------------
@app.route("/get-expenses/<email>", methods=["GET"])
def get_expenses(email):

    valid, sess, code = validate_session(request.args)
    if not valid:
        return sess, code

    try:
        expenses_ref = db.collection("expenses").where("email", "==", email).stream()

        expenses = []
        for exp in expenses_ref:
            data = exp.to_dict()
            data["id"] = exp.id
            expenses.append(data)

        return jsonify({"expenses": expenses}), 200
    except Exception as e:
        return jsonify({"error": "Failed to retrieve expenses"}), 500


# ------------------- ADD FUND -------------------
@app.route("/add-fund", methods=["POST"])
def add_fund():
    data = request.json

    valid, sess, code = validate_session(data)
    if not valid:
        return sess, code

    try:
        date = data.get("date")
        amount = float(data.get("amount"))
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

        new_balance = current_balance + amount

        db.collection("fund_balance").document("main").set({"balance": new_balance})

        return jsonify({"message": "Fund added successfully"}), 200

    except Exception as e:
        return jsonify({"error": "Internal Server Error"}), 500


# ------------------- GET ALL FUNDS -------------------
@app.route("/get-all-funds", methods=["GET"])
def get_all_funds():

    valid, sess, code = validate_session(request.args)
    if not valid:
        return sess, code

    try:
        fund_ref = db.collection("funds").order_by("date").stream()

        funds = []
        for f in fund_ref:
            data = f.to_dict()
            admin_email = data.get("admin_email")

            user_doc = db.collection("users").document(admin_email).get()
            admin_name = user_doc.to_dict().get("name") if user_doc.exists else "Unknown"

            funds.append({
                "id": f.id,
                "date": data.get("date"),
                "amount": data.get("amount"),
                "description": data.get("description"),
                "admin_name": admin_name
            })

        return jsonify({"funds": funds}), 200

    except Exception as e:
        return jsonify({"error": "Failed to retrieve funds"}), 500


# ------------------- SUMMARY -------------------
@app.route("/get-summary", methods=["GET"])
def get_summary():

    valid, sess, code = validate_session(request.args)
    if not valid:
        return sess, code

    try:
        total_fund = sum([float(f.to_dict().get("amount", 0)) for f in db.collection("funds").stream()])
        total_expenses = sum([float(e.to_dict().get("amount", 0)) for e in db.collection("expenses").stream()])

        balance_doc = db.collection("fund_balance").document("main").get()
        balance = balance_doc.to_dict().get("balance", 0) if balance_doc.exists else 0

        return jsonify({
            "total_fund": total_fund,
            "total_expenses": total_expenses,
            "balance": balance
        }), 200

    except:
        return jsonify({"error": "Internal Server Error"}), 500


# ------------------- ADMIN GET ALL EXPENSES -------------------
@app.route("/admin/get-all-expenses", methods=["GET"])
def admin_get_all_expenses():

    valid, sess, code = validate_session(request.args)
    if not valid:
        return sess, code

    try:
        expenses_ref = db.collection("expenses").stream()
        expenses = []

        for exp in expenses_ref:
            data = exp.to_dict()
            email = data.get("email")

            user_ref = db.collection("users").document(email).get()
            employee_name = user_ref.to_dict().get("name") if user_ref.exists else "Unknown"

            expenses.append({
                "id": exp.id,
                "employee_name": employee_name,
                "email": email,
                "description": data.get("description"),
                "amount": data.get("amount"),
                "date": data.get("date"),
                "bill_image": data.get("bill_image")
            })

        return jsonify({"expenses": expenses}), 200

    except:
        return jsonify({"error": "Failed to fetch expenses"}), 500


# ------------------- EXPORT EXCEL -------------------
@app.route("/admin/export-expenses-excel", methods=["GET"])
def export_expenses_excel():

    valid, sess, code = validate_session(request.args)
    if not valid:
        return sess, code

    try:
        expenses_ref = db.collection("expenses").stream()
        wb = Workbook()
        ws = wb.active
        ws.title = "Expenses"

        ws.append(["Employee Name", "Description", "Amount", "Date"])

        for exp in expenses_ref:
            data = exp.to_dict()
            email = data.get("email")

            user_doc = db.collection("users").document(email).get()
            employee_name = user_doc.to_dict().get("name") if user_doc.exists else "Unknown"

            ws.append([
                employee_name,
                data.get("description"),
                data.get("amount"),
                data.get("date")
            ])

        output = io.BytesIO()
        wb.save(output)
        output.seek(0)

        return send_file(
            output,
            as_attachment=True,
            download_name="expenses.xlsx",
            mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )

    except:
        return jsonify({"error": "Failed to export Excel"}), 500



if __name__ == "__main__":
    app.run(debug=True)
