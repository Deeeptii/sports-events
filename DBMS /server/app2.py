import os

import psycopg2
import psycopg2.extras
import service.eventService as Events
from flask import Flask, jsonify, request
from init_db import init_db
from psycopg2 import OperationalError

app = Flask(__name__)


def get_db_connection():
    try:
        pg_user = os.getenv("POSTGRES_USER", "genai_super")
        pg_pass = os.getenv("POSTGRES_PASSWORD", "mypassword")
        pg_db = os.getenv("POSTGRES_DB", "mydb")
        pg_host = os.getenv("POSTGRES_HOST", "0.0.0.0")
        pg_port = os.getenv("POSTGRES_PORT", "5432")

        connection = psycopg2.connect(
            host=pg_host, port=pg_port, database=pg_db, user=pg_user, password=pg_pass
        )
        return connection
    except OperationalError as e:
        print(f"Error: {e}")
        return None


@app.route("/api/events", methods=["POST"])
def add_event():
    event_data = request.get_json()
    return Events.add_event(event_data)


@app.route("/api/events", methods=["GET"])
def get_events():
    return Events.get_events()


# Get a specific event by ID
@app.route("/api/events/<int:event_id>", methods=["GET"])
def get_event(event_id):
    return Events.get_event(event_id)


# Update an event
@app.route("/api/events/<int:event_id>", methods=["PUT"])
def update_event(event_id):
    return Events.update_event(event_id)


@app.route("/api/events/<int:event_id>", methods=["DELETE"])
def delete_event(event_id):
    return Events.delete_event(event_id)


# A simple route that returns a greeting message
@app.route("/")
def home():
    return "Welcome to the Flask Microservice!"


# A route that takes a name as a query parameter and returns a personalized greeting
@app.route("/greet", methods=["GET"])
def greet():
    name = request.args.get(
        "name", "Guest"
    )  # Default to 'Guest' if no name is provided
    message = f"Hello, {name}!"
    return jsonify({"message": message})


# Route to initialize the database
@app.route("/api/init-db", methods=["POST"])
def initialize_database():
    success = init_db()
    if success:
        return jsonify({"message": "Database initialized successfully"}), 200
    else:
        return jsonify({"error": "Failed to initialize database"}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
