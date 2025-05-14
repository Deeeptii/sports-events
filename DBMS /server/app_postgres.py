import os
from datetime import datetime, timedelta
from functools import wraps

import jwt
import psycopg2
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from psycopg2.extras import DictCursor
from werkzeug.security import check_password_hash, generate_password_hash

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# PostgreSQL configurations
pg_user = os.getenv("POSTGRES_USER", "genai_super")
pg_pass = os.getenv("POSTGRES_PASSWORD", "mypassword")
pg_db = os.getenv("POSTGRES_DB", "mydb")
pg_host = os.getenv("POSTGRES_HOST", "0.0.0.0")
pg_port = os.getenv("POSTGRES_PORT", "5432")

# JWT configurations
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "your-secret-key")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1)


def get_db_connection():
    try:
        connection = psycopg2.connect(
            host=pg_host, port=pg_port, database=pg_db, user=pg_user, password=pg_pass
        )
        return connection
    except Exception as e:
        print(f"Database connection error: {e}")
        return None


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]

        if not token:
            return jsonify({"message": "Token is missing"}), 401

        try:
            data = jwt.decode(token, app.config["JWT_SECRET_KEY"], algorithms=["HS256"])
            current_user = get_user_by_id(data["user_id"])

            if not current_user:
                return jsonify({"message": "Invalid token"}), 401

        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token"}), 401

        return f(current_user, *args, **kwargs)

    return decorated


def get_user_by_id(user_id):
    connection = get_db_connection()
    if connection is None:
        return None

    try:
        with connection.cursor(cursor_factory=DictCursor) as cur:
            cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
            user = cur.fetchone()
            return dict(user) if user else None
    except Exception as e:
        print(f"Error getting user: {e}")
        return None
    finally:
        connection.close()


# Auth routes
@app.route("/api/auth/register", methods=["POST"])
def register():
    data = request.get_json()

    # Validate required fields
    required_fields = ["name", "email", "password", "phone", "age", "gender"]
    if not all(field in data for field in required_fields):
        return jsonify({"message": "Missing required fields"}), 400

    connection = get_db_connection()
    if connection is None:
        return jsonify({"message": "Database connection error"}), 500

    try:
        # Check if user already exists
        with connection.cursor(cursor_factory=DictCursor) as cur:
            cur.execute("SELECT * FROM users WHERE email = %s", (data["email"],))
            user = cur.fetchone()

            if user:
                return jsonify({"message": "User already exists"}), 409

            # Hash password
            hashed_password = generate_password_hash(data["password"])

            # Insert new user
            cur.execute(
                """
                INSERT INTO users (name, email, password, phone, age, gender, role)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING id, name, email, role
            """,
                (
                    data["name"],
                    data["email"],
                    hashed_password,
                    data["phone"],
                    data["age"],
                    data["gender"],
                    data.get("role", "participant"),
                ),
            )
            connection.commit()

            # Get the newly created user
            new_user = cur.fetchone()

            # Generate token
            token = jwt.encode(
                {
                    "user_id": new_user["id"],
                    "exp": datetime.utcnow() + app.config["JWT_ACCESS_TOKEN_EXPIRES"],
                },
                app.config["JWT_SECRET_KEY"],
            )

            return jsonify({"token": token, "user": dict(new_user)}), 201

    except Exception as e:
        connection.rollback()
        return jsonify({"message": str(e)}), 500
    finally:
        connection.close()


@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"message": "Missing email or password"}), 400

    connection = get_db_connection()
    if connection is None:
        return jsonify({"message": "Database connection error"}), 500

    try:
        with connection.cursor(cursor_factory=DictCursor) as cur:
            cur.execute("SELECT * FROM users WHERE email = %s", (data["email"],))
            user = cur.fetchone()

            if not user or not check_password_hash(user["password"], data["password"]):
                return jsonify({"message": "Invalid email or password"}), 401

            token = jwt.encode(
                {
                    "user_id": user["id"],
                    "exp": datetime.utcnow() + app.config["JWT_ACCESS_TOKEN_EXPIRES"],
                },
                app.config["JWT_SECRET_KEY"],
            )

            return jsonify(
                {
                    "token": token,
                    "user": {
                        "id": user["id"],
                        "name": user["name"],
                        "email": user["email"],
                        "role": user["role"],
                    },
                }
            ), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        connection.close()


# Event routes
@app.route("/api/events", methods=["GET"])
def get_events():
    connection = get_db_connection()
    if connection is None:
        return jsonify({"message": "Database connection error"}), 500

    try:
        with connection.cursor(cursor_factory=DictCursor) as cur:
            cur.execute("""
                SELECT e.*, u.name as organizer_name 
                FROM events e 
                LEFT JOIN users u ON e.organizer_id = u.id
            """)
            events = cur.fetchall()
            return jsonify([dict(event) for event in events]), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        connection.close()


@app.route("/api/events/<int:event_id>", methods=["GET"])
def get_event(event_id):
    connection = get_db_connection()
    if connection is None:
        return jsonify({"message": "Database connection error"}), 500

    try:
        with connection.cursor(cursor_factory=DictCursor) as cur:
            cur.execute(
                """
                SELECT e.*, u.name as organizer_name 
                FROM events e 
                LEFT JOIN users u ON e.organizer_id = u.id 
                WHERE e.id = %s
            """,
                (event_id,),
            )
            event = cur.fetchone()

            if not event:
                return jsonify({"message": "Event not found"}), 404

            return jsonify(dict(event)), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        connection.close()


@app.route("/api/events", methods=["POST"])
@token_required
def create_event(current_user):
    if current_user["role"] not in ["admin", "organizer"]:
        return jsonify({"message": "Unauthorized"}), 403

    data = request.get_json()
    required_fields = [
        "name",
        "event_date",
        "venue",
        "category",
        "description",
        "registration_deadline",
        "fee",
    ]

    if not all(field in data for field in required_fields):
        return jsonify({"message": "Missing required fields"}), 400

    connection = get_db_connection()
    if connection is None:
        return jsonify({"message": "Database connection error"}), 500

    try:
        with connection.cursor(cursor_factory=DictCursor) as cur:
            cur.execute(
                """
                INSERT INTO events (
                    name, event_date, venue, category, description,
                    image, status, registration_deadline, fee, organizer_id
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING *
            """,
                (
                    data["name"],
                    data["event_date"],
                    data["venue"],
                    data["category"],
                    data["description"],
                    data.get("image", ""),
                    data.get("status", "upcoming"),
                    data["registration_deadline"],
                    data["fee"],
                    current_user["id"],
                ),
            )
            connection.commit()

            # Get the newly created event
            new_event = cur.fetchone()
            return jsonify(dict(new_event)), 201
    except Exception as e:
        connection.rollback()
        return jsonify({"message": str(e)}), 500
    finally:
        connection.close()


@app.route("/api/events/<int:event_id>", methods=["PUT"])
@token_required
def update_event(current_user, event_id):
    if current_user["role"] not in ["admin", "organizer"]:
        return jsonify({"message": "Unauthorized"}), 403

    data = request.get_json()
    connection = get_db_connection()
    if connection is None:
        return jsonify({"message": "Database connection error"}), 500

    try:
        with connection.cursor(cursor_factory=DictCursor) as cur:
            # Check if event exists and user has permission
            cur.execute("SELECT * FROM events WHERE id = %s", (event_id,))
            event = cur.fetchone()

            if not event:
                return jsonify({"message": "Event not found"}), 404

            if (
                current_user["role"] != "admin"
                and event["organizer_id"] != current_user["id"]
            ):
                return jsonify({"message": "Unauthorized"}), 403

            # Update event
            cur.execute(
                """
                UPDATE events SET
                    name = %s,
                    event_date = %s,
                    venue = %s,
                    category = %s,
                    description = %s,
                    image = %s,
                    status = %s,
                    registration_deadline = %s,
                    fee = %s
                WHERE id = %s
                RETURNING *
            """,
                (
                    data["name"],
                    data["event_date"],
                    data["venue"],
                    data["category"],
                    data["description"],
                    data.get("image", event["image"]),
                    data.get("status", event["status"]),
                    data["registration_deadline"],
                    data["fee"],
                    event_id,
                ),
            )
            connection.commit()

            # Get updated event
            updated_event = cur.fetchone()
            return jsonify(dict(updated_event)), 200
    except Exception as e:
        connection.rollback()
        return jsonify({"message": str(e)}), 500
    finally:
        connection.close()


@app.route("/api/events/<int:event_id>", methods=["DELETE"])
@token_required
def delete_event(current_user, event_id):
    if current_user["role"] not in ["admin", "organizer"]:
        return jsonify({"message": "Unauthorized"}), 403

    connection = get_db_connection()
    if connection is None:
        return jsonify({"message": "Database connection error"}), 500

    try:
        with connection.cursor(cursor_factory=DictCursor) as cur:
            # Check if event exists and user has permission
            cur.execute("SELECT * FROM events WHERE id = %s", (event_id,))
            event = cur.fetchone()

            if not event:
                return jsonify({"message": "Event not found"}), 404

            if (
                current_user["role"] != "admin"
                and event["organizer_id"] != current_user["id"]
            ):
                return jsonify({"message": "Unauthorized"}), 403

            # Delete event
            cur.execute("DELETE FROM events WHERE id = %s", (event_id,))
            connection.commit()

            return jsonify({"message": "Event deleted successfully"}), 200
    except Exception as e:
        connection.rollback()
        return jsonify({"message": str(e)}), 500
    finally:
        connection.close()


# Registration routes
@app.route("/api/registrations", methods=["POST"])
@token_required
def create_registration(current_user):
    data = request.get_json()

    if not data or not data.get("event_id"):
        return jsonify({"message": "Missing event ID"}), 400

    connection = get_db_connection()
    if connection is None:
        return jsonify({"message": "Database connection error"}), 500

    try:
        with connection.cursor(cursor_factory=DictCursor) as cur:
            # Check if event exists and registration is open
            cur.execute(
                """
                SELECT * FROM events 
                WHERE id = %s AND registration_deadline >= CURRENT_DATE
            """,
                (data["event_id"],),
            )
            event = cur.fetchone()

            if not event:
                return jsonify(
                    {"message": "Event not found or registration closed"}
                ), 404

            # Check if already registered
            cur.execute(
                """
                SELECT * FROM registrations 
                WHERE event_id = %s AND (user_id = %s OR team_id IN (
                    SELECT team_id FROM team_members WHERE user_id = %s
                ))
            """,
                (data["event_id"], current_user["id"], current_user["id"]),
            )

            if cur.fetchone():
                return jsonify({"message": "Already registered for this event"}), 409

            # Create registration
            cur.execute(
                """
                INSERT INTO registrations (
                    user_id, event_id, team_id, registration_status
                )
                VALUES (%s, %s, %s, %s)
                RETURNING *
            """,
                (current_user["id"], data["event_id"], data.get("team_id"), "pending"),
            )
            connection.commit()

            # Get the new registration
            new_registration = cur.fetchone()
            return jsonify(dict(new_registration)), 201
    except Exception as e:
        connection.rollback()
        return jsonify({"message": str(e)}), 500
    finally:
        connection.close()


@app.route("/api/registrations/<int:registration_id>", methods=["PUT"])
@token_required
def update_registration_status(current_user, registration_id):
    if current_user["role"] not in ["admin", "organizer"]:
        return jsonify({"message": "Unauthorized"}), 403

    data = request.get_json()
    if not data or "status" not in data:
        return jsonify({"message": "Missing status"}), 400

    connection = get_db_connection()
    if connection is None:
        return jsonify({"message": "Database connection error"}), 500

    try:
        with connection.cursor(cursor_factory=DictCursor) as cur:
            cur.execute("SELECT * FROM registrations WHERE id = %s", (registration_id,))
            registration = cur.fetchone()

            if not registration:
                return jsonify({"message": "Registration not found"}), 404

            # Update status
            cur.execute(
                """
                UPDATE registrations 
                SET registration_status = %s 
                WHERE id = %s
                RETURNING *
            """,
                (data["status"], registration_id),
            )
            connection.commit()

            # Get updated registration
            updated_registration = cur.fetchone()
            return jsonify(dict(updated_registration)), 200
    except Exception as e:
        connection.rollback()
        return jsonify({"message": str(e)}), 500
    finally:
        connection.close()


if __name__ == "__main__":
    app.run(debug=True, port=5000)
