import os

import psycopg2
from psycopg2 import OperationalError
from psycopg2.extras import DictCursor


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
        print(f"Error connecting to PostgreSQL: {e}")
        return None


def execute_query(query, params=None, fetch_one=False, fetch_all=False, commit=False):
    """
    Execute a SQL query with parameters

    Args:
        query (str): SQL query to execute
        params (tuple): Parameters for the query
        fetch_one (bool): Whether to fetch one result
        fetch_all (bool): Whether to fetch all results
        commit (bool): Whether to commit the transaction

    Returns:
        result of the query or None if error
    """
    connection = get_db_connection()
    if connection is None:
        return None

    cursor = None
    try:
        cursor = connection.cursor(cursor_factory=DictCursor)
        cursor.execute(query, params or ())

        result = None
        if fetch_one:
            result = dict(cursor.fetchone()) if cursor.fetchone() else None
        elif fetch_all:
            result = [dict(row) for row in cursor.fetchall()]

        if commit:
            connection.commit()

        return result
    except Exception as e:
        print(f"Database error: {e}")
        if commit:
            connection.rollback()
        return None
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
