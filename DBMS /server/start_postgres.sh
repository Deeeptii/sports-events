#!/bin/bash

# Set up environment variables for PostgreSQL connection
export POSTGRES_USER="genai_super"
export POSTGRES_PASSWORD="mypassword"
export POSTGRES_DB="mydb"
export POSTGRES_HOST="0.0.0.0"
export POSTGRES_PORT="5432"

# Run the database initialization script
echo "Initializing database..."
python init_db.py

# Start the server
echo "Starting server..."
python app_postgres.py
