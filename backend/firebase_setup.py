import firebase_admin
from firebase_admin import credentials, firestore
import os, json

firebase_env = os.environ.get("FIREBASE_CREDENTIALS")

if not firebase_env:
    raise RuntimeError("FIREBASE_CREDENTIALS environment variable not set")

firebase_creds = json.loads(firebase_env)

cred = credentials.Certificate(firebase_creds)

if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

db = firestore.client()
