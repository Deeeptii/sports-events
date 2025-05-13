from flask import Flask, jsonify, request
import mysql.connector
from mysql.connector import Error


app = Flask(__name__)
# MySQL connection configuration
def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host='localhost',        # or your MySQL host
            database='sports_events',     # your database name
            user='root',             # your MySQL username
            password='zxcDSA1@'      # your MySQL password
        )
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Error: {e}")
        return None
    

@app.route('/api/events', methods=['POST'])
def add_event():
    # Extract event data from the request JSON body
    event_data = request.get_json()

    name = event_data.get('name')
    description = event_data.get('description')
    date = event_data.get('date')

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
        query = "INSERT INTO events (name, description, date) VALUES (%s, %s, %s)"
        cursor.execute(query, (name, description, date))
        connection.commit()

        # Get the ID of the inserted event
        event_id = cursor.lastrowid

        cursor.close()
        connection.close()

        return jsonify({"message": "Event added successfully!", "id": event_id}), 201

    except Error as e:
        cursor.close()
        connection.close()
        return jsonify({"error": f"Error occurred while inserting event: {e}"}), 500




@app.route('/api/events', methods=['GET'])
def get_events():
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Unable to connect to database"}), 500

    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM events")
        events = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(events), 200

    except Error as e:
        cursor.close()
        connection.close()
        return jsonify({"error": f"Error occurred while fetching events: {e}"}), 500

# Get all events
@app.route('/api/events/all', methods=['GET'])
def get_all_events():
    print("I'm here")
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Unable to connect to database"}), 500

    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM events")
        events = cursor.fetchall()  # <-- use fetchall() here
        cursor.close()
        connection.close()

        if events:
            return jsonify(events), 200  # Return the list of events
        else:
            return jsonify({"message": "No events found"}), 404

    except Error as e:
        cursor.close()
        connection.close()
        return jsonify({"error": f"Error occurred while fetching events: {e}"}), 500

# Get a specific event by ID
@app.route('/api/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Unable to connect to database"}), 500

    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM events WHERE id = %s", (event_id,))
        event = cursor.fetchone()
        cursor.close()
        connection.close()

        if event:
            return jsonify(event), 200
        else:
            return jsonify({"error": "Event not found"}), 404

    except Error as e:
        cursor.close()
        connection.close()
        return jsonify({"error": f"Error occurred while fetching event: {e}"}), 500

# Update an event
@app.route('/api/events/<int:event_id>', methods=['PUT'])
def update_event(event_id):
    event_data = request.get_json()
    name = event_data.get('name')
    description = event_data.get('description')
    date = event_data.get('date')

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

    except Error as e:
        cursor.close()
        connection.close()
        return jsonify({"error": f"Error occurred while updating event: {e}"}), 500

# Delete an event
@app.route('/api/events/<int:event_id>', methods=['DELETE'])
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

    except Error as e:
        cursor.close()
        connection.close()
        return jsonify({"error": f"Error occurred while deleting event: {e}"}), 500












# A simple route that returns a greeting message
@app.route('/')
def home():
    return "Welcome to the Flask Microservice!"

# A route that takes a name as a query parameter and returns a personalized greeting
@app.route('/greet', methods=['GET'])
def greet():
    name = request.args.get('name', 'Guest')  # Default to 'Guest' if no name is provided
    message = f"Hello, {name}!"
    return jsonify({"message": message})

if __name__ == '__main__':
    app.run(debug=True, port = 5000)





