import sqlite3
import json
import os
from typing import List, Dict, Any, Optional
from datetime import datetime

from app.config import settings
from app.schemas import DetectionAlert

class DatabaseManager:
    def __init__(self, db_path: str = None):
        self.db_path = db_path or settings.SQLITE_DB_PATH
        self.enabled = settings.ENABLE_SQLITE_PERSISTENCE
        if self.enabled:
            os.makedirs(os.path.dirname(os.path.abspath(self.db_path)), exist_ok=True)
            self._init_schema()

    def _get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_schema(self):
        """Initialize database tables with parameterized execution."""
        if not self.enabled:
            return
        with self._get_connection() as conn:
            cursor = conn.cursor()
            
            # Analyses table
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS analyses (
                id TEXT PRIMARY KEY,
                dataset_name TEXT NOT NULL,
                total_events INTEGER NOT NULL,
                total_alerts INTEGER NOT NULL,
                success_rate REAL NOT NULL,
                created_at TEXT NOT NULL
            )
            """)

            # Alerts table
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS alerts (
                alert_id TEXT PRIMARY KEY,
                analysis_id TEXT,
                timestamp TEXT NOT NULL,
                actor TEXT NOT NULL,
                target_user TEXT,
                action TEXT NOT NULL,
                resource TEXT,
                source_ip TEXT,
                rule_id TEXT NOT NULL,
                rule_name TEXT NOT NULL,
                risk_score INTEGER NOT NULL,
                severity TEXT NOT NULL,
                explanation TEXT NOT NULL,
                evidence TEXT,
                recommended_actions TEXT,
                related_event_ids TEXT,
                evidence_quality TEXT,
                investigation_status TEXT DEFAULT 'New',
                score_breakdown TEXT,
                created_at TEXT NOT NULL,
                FOREIGN KEY(analysis_id) REFERENCES analyses(id) ON DELETE CASCADE
            )
            """)

            # Status audit log
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS status_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                alert_id TEXT NOT NULL,
                old_status TEXT,
                new_status TEXT NOT NULL,
                analyst_notes TEXT,
                updated_at TEXT NOT NULL,
                FOREIGN KEY(alert_id) REFERENCES alerts(alert_id) ON DELETE CASCADE
            )
            """)
            conn.commit()

    def save_analysis(self, analysis_id: str, dataset_name: str, total_events: int, alerts: List[DetectionAlert], success_rate: float):
        """Persist analysis run and associated alerts."""
        if not self.enabled:
            return
        now_str = datetime.now().isoformat()
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT OR REPLACE INTO analyses (id, dataset_name, total_events, total_alerts, success_rate, created_at) VALUES (?, ?, ?, ?, ?, ?)",
                (analysis_id, dataset_name, total_events, len(alerts), success_rate, now_str)
            )

            for a in alerts:
                cursor.execute("""
                INSERT OR REPLACE INTO alerts (
                    alert_id, analysis_id, timestamp, actor, target_user, action,
                    resource, source_ip, rule_id, rule_name, risk_score, severity,
                    explanation, evidence, recommended_actions, related_event_ids,
                    evidence_quality, investigation_status, score_breakdown, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    a.alert_id, analysis_id, a.timestamp, a.actor, a.target_user,
                    a.action, a.resource, a.source_ip, a.rule_id, a.rule_name,
                    a.risk_score, a.severity, a.explanation,
                    json.dumps(a.evidence),
                    json.dumps(a.recommended_actions),
                    json.dumps(a.related_event_ids),
                    a.evidence_quality, a.investigation_status,
                    json.dumps(a.score_breakdown.model_dump()) if a.score_breakdown else None,
                    now_str
                ))
            conn.commit()

    def update_alert_status(self, alert_id: str, new_status: str, analyst_notes: Optional[str] = None) -> bool:
        """Update an alert's investigation status and record the change in audit log."""
        if not self.enabled:
            return True
        now_str = datetime.now().isoformat()
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT investigation_status FROM alerts WHERE alert_id = ?", (alert_id,))
            row = cursor.fetchone()
            old_status = row["investigation_status"] if row else "Unknown"

            cursor.execute("UPDATE alerts SET investigation_status = ? WHERE alert_id = ?", (new_status, alert_id))
            affected = cursor.rowcount > 0

            cursor.execute(
                "INSERT INTO status_history (alert_id, old_status, new_status, analyst_notes, updated_at) VALUES (?, ?, ?, ?, ?)",
                (alert_id, old_status, new_status, analyst_notes or "", now_str)
            )
            conn.commit()
            return affected

    def get_alert_status(self, alert_id: str) -> Optional[str]:
        """Fetch persisted status if present."""
        if not self.enabled:
            return None
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT investigation_status FROM alerts WHERE alert_id = ?", (alert_id,))
            row = cursor.fetchone()
            return row["investigation_status"] if row else None

    def clear_history(self):
        """Clear all historical analysis and alert records."""
        if not self.enabled:
            return
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM status_history")
            cursor.execute("DELETE FROM alerts")
            cursor.execute("DELETE FROM analyses")
            conn.commit()

db_manager = DatabaseManager()
