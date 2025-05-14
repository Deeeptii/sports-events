import os

import psycopg2
import psycopg2.extras
from flask import jsonify, request
from psycopg2 import OperationalError


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


def add_event(event_data):
    # Extract event data from the request JSON body
    name = event_data.get("name")
    description = event_data.get("description")
    date = event_data.get("date")
    category = event_data.get("category")
    created_at = event_data.get("created_at")
    venue = event_data.get("venue")

    # Check if required fields are present
    if not name or not date:
        return jsonify({"error": "Name and date are required!"}), 400

    # Connect to the database
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Unable to connect to database"}), 500

    try:
        cursor = connection.cursor()

        # Insert event into the database
        query = """
            INSERT INTO events (name, description, date, category, created_at, venue)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (name, description, date, category, created_at, venue))
        connection.commit()

        # Get the ID of the inserted event
        event_id = cursor.lastrowid

        cursor.close()
        connection.close()

        return jsonify({"message": "Event added successfully!", "id": event_id}), 201

    except psycopg2.Error as e:
        cursor.close()
        connection.close()
        return jsonify({"error": f"Error occurred while inserting event: {e}"}), 500


def get_events():
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Unable to connect to database"}), 500

    try:
        # Use DictCursor to get results as dictionaries (like dictionary=True in MySQL)
        cursor = connection.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cursor.execute("SELECT * FROM events")
        events = cursor.fetchall()
        cursor.close()
        connection.close()

        # Convert each row to a regular dict (because DictRow is not JSON serializable)
        return jsonify([dict(row) for row in events]), 200

    except psycopg2.Error as e:
        # Defensive: ensure cursors and connections are closed even if the error happens early
        if cursor:
            cursor.close()
        if connection:
            connection.close()
        return jsonify({"error": f"Error occurred while fetching events: {e}"}), 500


# Get a specific event by ID


def get_event(event_id):
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Unable to connect to database"}), 500

    try:
        cursor = connection.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cursor.execute("SELECT * FROM events WHERE id = %s", (event_id,))
        event = cursor.fetchone()
        cursor.close()
        connection.close()

        if event:
            return jsonify(dict(event)), 200
        else:
            return jsonify({"error": "Event not found"}), 404

    except psycopg2.Error as e:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
        return jsonify({"error": f"Error occurred while fetching event: {e}"}), 500


# Update an event


def update_event(event_id):
    event_data = request.get_json()
    name = event_data.get("name")
    description = event_data.get("description")
    date = event_data.get("date")

    if not name or not date:
        return jsonify({"error": "Name and date are required for updating!"}), 400

    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Unable to connect to database"}), 500

    try:
        cursor = connection.cursor()
        query = "UPDATE events SET name = %s, description = %s, date = %s WHERE id = %s"
        cursor.execute(query, (name, description, date, event_id))
        connection.commit()
        affected_rows = cursor.rowcount
        cursor.close()
        connection.close()

        if affected_rows == 0:
            return jsonify({"error": "Event not found"}), 404

        return jsonify({"message": "Event updated successfully!"}), 200

    except psycopg2.Error as e:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
        return jsonify({"error": f"Error occurred while updating event: {e}"}), 500


def delete_event(event_id):
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Unable to connect to database"}), 500

    try:
        cursor = connection.cursor()
        query = "DELETE FROM events WHERE id = %s"
        cursor.execute(query, (event_id,))
        connection.commit()
        affected_rows = cursor.rowcount
        cursor.close()
        connection.close()

        if affected_rows == 0:
            return jsonify({"error": "Event not found"}), 404

        return jsonify({"message": "Event deleted successfully!"}), 200

    except psycopg2.Error as e:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
        return jsonify({"error": f"Error occurred while deleting event: {e}"}), 500
