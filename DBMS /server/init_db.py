import os

import psycopg2
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


def init_db():
    connection = get_db_connection()
    if connection is None:
        print("Unable to connect to the database")
        return False

    cursor = connection.cursor()

    try:
        # Create users table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            phone VARCHAR(15) NOT NULL,
            age INTEGER,
            gender VARCHAR(20),
            role VARCHAR(20) CHECK (role IN ('admin', 'organizer', 'participant', 'team_manager')) DEFAULT 'participant',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

        # Create events table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS events (
            id SERIAL PRIMARY KEY,
            name VARCHAR(200) NOT NULL,
            event_date DATE NOT NULL,
            venue VARCHAR(200) NOT NULL,
            category VARCHAR(100) NOT NULL,
            description TEXT,
            image VARCHAR(255),
            status VARCHAR(20) CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')) DEFAULT 'upcoming',
            registration_deadline DATE NOT NULL,
            fee DECIMAL(10, 2) NOT NULL,
            organizer_id INTEGER REFERENCES users(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

        # Create teams table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS teams (
            id SERIAL PRIMARY KEY,
            team_name VARCHAR(100) NOT NULL,
            event_id INTEGER REFERENCES events(id),
            created_by INTEGER REFERENCES users(id) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

        # Create team_members table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS team_members (
            team_id INTEGER REFERENCES teams(id),
            user_id INTEGER REFERENCES users(id),
            joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (team_id, user_id)
        );
        """)

        # Create registrations table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS registrations (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            team_id INTEGER REFERENCES teams(id),
            event_id INTEGER REFERENCES events(id) NOT NULL,
            registration_status VARCHAR(20) CHECK (registration_status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending',
            registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

        # Create payments table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS payments (
            id SERIAL PRIMARY KEY,
            registration_id INTEGER REFERENCES registrations(id) NOT NULL,
            amount DECIMAL(10, 2) NOT NULL,
            payment_status VARCHAR(20) CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
            payment_date TIMESTAMP,
            transaction_id VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

        # Create feedback table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS feedback (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) NOT NULL,
            event_id INTEGER REFERENCES events(id) NOT NULL,
            rating INTEGER CHECK (rating >= 1 AND rating <= 5),
            comments TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

        # Create results table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS results (
            id SERIAL PRIMARY KEY,
            event_id INTEGER REFERENCES events(id) NOT NULL,
            team_id INTEGER REFERENCES teams(id),
            user_id INTEGER REFERENCES users(id),
            ranking INTEGER,
            score VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

        # Create communication_logs table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS communication_logs (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) NOT NULL,
            message_type VARCHAR(50) NOT NULL,
            message_content TEXT NOT NULL,
            sent_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

        # Create indexes for better query performance
        cursor.execute(
            "CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);"
        )
        cursor.execute(
            "CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);"
        )
        cursor.execute(
            "CREATE INDEX IF NOT EXISTS idx_registrations_event ON registrations(event_id);"
        )
        cursor.execute(
            "CREATE INDEX IF NOT EXISTS idx_registrations_user ON registrations(user_id);"
        )
        cursor.execute(
            "CREATE INDEX IF NOT EXISTS idx_registrations_team ON registrations(team_id);"
        )
        cursor.execute(
            "CREATE INDEX IF NOT EXISTS idx_team_members_user ON team_members(user_id);"
        )
        cursor.execute(
            "CREATE INDEX IF NOT EXISTS idx_payments_registration ON payments(registration_id);"
        )
        cursor.execute(
            "CREATE INDEX IF NOT EXISTS idx_feedback_event ON feedback(event_id);"
        )
        cursor.execute(
            "CREATE INDEX IF NOT EXISTS idx_results_event ON results(event_id);"
        )

        # Commit the changes
        connection.commit()
        print("Database initialized successfully")
        return True

    except psycopg2.Error as e:
        connection.rollback()
        print(f"Error initializing database: {e}")
        return False

    finally:
        cursor.close()
        connection.close()


if __name__ == "__main__":
    init_db()
