from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mysqldb import MySQL
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import os
from datetime import datetime, timedelta
from functools import wraps
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# MySQL configurations
app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST', 'localhost')
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER', 'root')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD', '')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB', 'sports_events')
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

# JWT configurations
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

mysql = MySQL(app)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            data = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=["HS256"])
            current_user = get_user_by_id(data['user_id'])
            
            if not current_user:
                return jsonify({'message': 'Invalid token'}), 401
            
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401
            
        return f(current_user, *args, **kwargs)
    
    return decorated

def get_user_by_id(user_id):
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    user = cur.fetchone()
    cur.close()
    return user

# Auth routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['name', 'email', 'password', 'phone', 'age', 'gender']
    if not all(field in data for field in required_fields):
        return jsonify({'message': 'Missing required fields'}), 400
    
    # Check if user already exists
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM users WHERE email = %s", (data['email'],))
    user = cur.fetchone()
    
    if user:
        return jsonify({'message': 'User already exists'}), 409
    
    # Hash password
    hashed_password = generate_password_hash(data['password'])
    
    # Insert new user
    try:
        cur.execute("""
            INSERT INTO users (name, email, password, phone, age, gender, role)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            data['name'],
            data['email'],
            hashed_password,
            data['phone'],
            data['age'],
            data['gender'],
            data.get('role', 'participant')
        ))
        mysql.connection.commit()
        
        # Get the newly created user
        cur.execute("SELECT id, name, email, role FROM users WHERE email = %s", (data['email'],))
        new_user = cur.fetchone()
        cur.close()
        
        # Generate token
        token = jwt.encode({
            'user_id': new_user['id'],
            'exp': datetime.utcnow() + app.config['JWT_ACCESS_TOKEN_EXPIRES']
        }, app.config['JWT_SECRET_KEY'])
        
        return jsonify({
            'token': token,
            'user': new_user
        }), 201
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing email or password'}), 400
    
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM users WHERE email = %s", (data['email'],))
    user = cur.fetchone()
    cur.close()
    
    if not user or not check_password_hash(user['password'], data['password']):
        return jsonify({'message': 'Invalid email or password'}), 401
    
    token = jwt.encode({
        'user_id': user['id'],
        'exp': datetime.utcnow() + app.config['JWT_ACCESS_TOKEN_EXPIRES']
    }, app.config['JWT_SECRET_KEY'])
    
    return jsonify({
        'token': token,
        'user': {
            'id': user['id'],
            'name': user['name'],
            'email': user['email'],
            'role': user['role']
        }
    }), 200

# Event routes
@app.route('/api/events', methods=['GET'])
def get_events():
    cur = mysql.connection.cursor()
    cur.execute("""
        SELECT e.*, u.name as organizer_name 
        FROM events e 
        LEFT JOIN users u ON e.organizer_id = u.id
    """)
    events = cur.fetchall()
    cur.close()
    return jsonify(events), 200

@app.route('/api/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    cur = mysql.connection.cursor()
    cur.execute("""
        SELECT e.*, u.name as organizer_name 
        FROM events e 
        LEFT JOIN users u ON e.organizer_id = u.id 
        WHERE e.id = %s
    """, (event_id,))
    event = cur.fetchone()
    cur.close()
    
    if not event:
        return jsonify({'message': 'Event not found'}), 404
    
    return jsonify(event), 200

@app.route('/api/events', methods=['POST'])
@token_required
def create_event(current_user):
    if current_user['role'] not in ['admin', 'organizer']:
        return jsonify({'message': 'Unauthorized'}), 403
    
    data = request.get_json()
    required_fields = ['name', 'event_date', 'venue', 'category', 'description', 'fee']
    
    if not all(field in data for field in required_fields):
        return jsonify({'message': 'Missing required fields'}), 400
    
    try:
        cur = mysql.connection.cursor()
        cur.execute("""
            INSERT INTO events (
                name, event_date, venue, category, description,
                image, status, registration_deadline, fee, organizer_id
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            data['name'],
            data['event_date'],
            data['venue'],
            data['category'],
            data['description'],
            data.get('image', ''),
            data.get('status', 'upcoming'),
            data['registration_deadline'],
            data['fee'],
            current_user['id']
        ))
        mysql.connection.commit()
        
        # Get the newly created event
        event_id = cur.lastrowid
        cur.execute("SELECT * FROM events WHERE id = %s", (event_id,))
        new_event = cur.fetchone()
        cur.close()
        
        return jsonify(new_event), 201
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/events/<int:event_id>', methods=['PUT'])
@token_required
def update_event(current_user, event_id):
    if current_user['role'] not in ['admin', 'organizer']:
        return jsonify({'message': 'Unauthorized'}), 403
    
    data = request.get_json()
    
    try:
        cur = mysql.connection.cursor()
        # Check if event exists and user has permission
        cur.execute("SELECT * FROM events WHERE id = %s", (event_id,))
        event = cur.fetchone()
        
        if not event:
            return jsonify({'message': 'Event not found'}), 404
        
        if current_user['role'] != 'admin' and event['organizer_id'] != current_user['id']:
            return jsonify({'message': 'Unauthorized'}), 403
        
        # Update event
        cur.execute("""
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
        """, (
            data['name'],
            data['event_date'],
            data['venue'],
            data['category'],
            data['description'],
            data.get('image', event['image']),
            data.get('status', event['status']),
            data['registration_deadline'],
            data['fee'],
            event_id
        ))
        mysql.connection.commit()
        
        # Get updated event
        cur.execute("SELECT * FROM events WHERE id = %s", (event_id,))
        updated_event = cur.fetchone()
        cur.close()
        
        return jsonify(updated_event), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/events/<int:event_id>', methods=['DELETE'])
@token_required
def delete_event(current_user, event_id):
    if current_user['role'] not in ['admin', 'organizer']:
        return jsonify({'message': 'Unauthorized'}), 403
    
    try:
        cur = mysql.connection.cursor()
        # Check if event exists and user has permission
        cur.execute("SELECT * FROM events WHERE id = %s", (event_id,))
        event = cur.fetchone()
        
        if not event:
            return jsonify({'message': 'Event not found'}), 404
        
        if current_user['role'] != 'admin' and event['organizer_id'] != current_user['id']:
            return jsonify({'message': 'Unauthorized'}), 403
        
        # Delete event
        cur.execute("DELETE FROM events WHERE id = %s", (event_id,))
        mysql.connection.commit()
        cur.close()
        
        return jsonify({'message': 'Event deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Registration routes
@app.route('/api/registrations', methods=['POST'])
@token_required
def create_registration(current_user):
    data = request.get_json()
    
    if not data or not data.get('event_id'):
        return jsonify({'message': 'Missing event ID'}), 400
    
    try:
        cur = mysql.connection.cursor()
        # Check if event exists and registration is open
        cur.execute("""
            SELECT * FROM events 
            WHERE id = %s AND registration_deadline >= CURDATE()
        """, (data['event_id'],))
        event = cur.fetchone()
        
        if not event:
            return jsonify({'message': 'Event not found or registration closed'}), 404
        
        # Check if already registered
        cur.execute("""
            SELECT * FROM registrations 
            WHERE event_id = %s AND (user_id = %s OR team_id IN (
                SELECT team_id FROM team_members WHERE user_id = %s
            ))
        """, (data['event_id'], current_user['id'], current_user['id']))
        
        if cur.fetchone():
            return jsonify({'message': 'Already registered for this event'}), 409
        
        # Create registration
        cur.execute("""
            INSERT INTO registrations (
                user_id, event_id, team_id, registration_status, registration_date
            )
            VALUES (%s, %s, %s, %s, NOW())
        """, (
            current_user['id'],
            data['event_id'],
            data.get('team_id'),
            'pending'
        ))
        mysql.connection.commit()
        
        # Get the new registration
        registration_id = cur.lastrowid
        cur.execute("SELECT * FROM registrations WHERE id = %s", (registration_id,))
        new_registration = cur.fetchone()
        cur.close()
        
        return jsonify(new_registration), 201
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/registrations/<int:registration_id>', methods=['PUT'])
@token_required
def update_registration_status(current_user, registration_id):
    if current_user['role'] not in ['admin', 'organizer']:
        return jsonify({'message': 'Unauthorized'}), 403
    
    data = request.get_json()
    if not data or 'status' not in data:
        return jsonify({'message': 'Missing status'}), 400
    
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM registrations WHERE id = %s", (registration_id,))
        registration = cur.fetchone()
        
        if not registration:
            return jsonify({'message': 'Registration not found'}), 404
        
        # Update status
        cur.execute("""
            UPDATE registrations 
            SET registration_status = %s 
            WHERE id = %s
        """, (data['status'], registration_id))
        mysql.connection.commit()
        
        # Get updated registration
        cur.execute("SELECT * FROM registrations WHERE id = %s", (registration_id,))
        updated_registration = cur.fetchone()
        cur.close()
        
        return jsonify(updated_registration), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)