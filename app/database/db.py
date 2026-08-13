import sqlite3
import json
from pathlib import Path
from datetime import datetime
from zoneinfo import ZoneInfo

DB_PATH = Path("app/database/predictions.db")


def get_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def create_table():

    connection = get_connection()

    connection.execute("""
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            created_at TEXT NOT NULL,
            score REAL NOT NULL,
            risk TEXT NOT NULL,
            status TEXT NOT NULL,
            shap_explanation TEXT,
            recommendations TEXT
        )
    """)

    connection.commit()
    connection.close()


def save_prediction(
    score,
    risk,
    status,
    shap_explanation,
    recommendations
):

    connection = get_connection()

    connection.execute(
        """
        INSERT INTO predictions
        (
            created_at,
            score,
            risk,
            status,
            shap_explanation,
            recommendations
        )
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            datetime.now(ZoneInfo("Asia/Kolkata")).isoformat(),
            score,
            risk,
            status,
            json.dumps(shap_explanation),
            json.dumps(recommendations)
        )
    )

    connection.commit()
    connection.close()


def get_predictions():

    connection = get_connection()

    rows = connection.execute(
        """
        SELECT
            id,
            created_at,
            score,
            risk,
            status,
            shap_explanation,
            recommendations
        FROM predictions
        ORDER BY id DESC
        """
    ).fetchall()

    connection.close()

    predictions = []

    for row in rows:

        prediction = dict(row)

        prediction["shap_explanation"] = (
            json.loads(prediction["shap_explanation"])
            if prediction["shap_explanation"]
            else []
        )

        prediction["recommendations"] = (
            json.loads(prediction["recommendations"])
            if prediction["recommendations"]
            else []
        )

        predictions.append(prediction)

    return predictions


def clear_predictions():
    connection = get_connection()

    connection.execute(
        "DELETE FROM predictions"
    )

    connection.commit()
    connection.close()