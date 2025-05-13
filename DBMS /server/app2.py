from flask import Flask, jsonify, request
import psycopg2
from psycopg2 import OperationalError
import psycopg2.extras
import service.eventService  as Events

app = Flask(__name__)
def get_db_connection():
    try:
        connection = psycopg2.connect(
            host='db.qvypqycqhkdgeqfcuicl.supabase.co',
            port=5432,
            database='postgres',
            user='postgres',
            password='zxcDSA1@'  # Update if your actual password differs
        )
        return connection
    except OperationalError as e:
        print(f"Error: {e}")
        return None
    

@app.route('/api/events', methods=['POST'])
def add_event():
    event_data = request.get_json()
    return Events.add_event(event_data)

@app.route('/api/events', methods=['GET'])
def get_events():
    return Events.get_events()

# Get a specific event by ID
@app.route('/api/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
   return Events.get_event(event_id)

# Update an event
@app.route('/api/events/<int:event_id>', methods=['PUT'])
def update_event(event_id):
   return Events.update_event(event_id)

@app.route('/api/events/<int:event_id>', methods=['DELETE'])
def delete_event(event_id):
   return Events.delete_event(event_id)

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





