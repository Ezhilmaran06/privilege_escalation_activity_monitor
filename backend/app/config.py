import os
from typing import List, Dict, Any
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "PrivilegeGuard"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    HOST: str = os.getenv("HOST", "127.0.0.1")
    PORT: int = int(os.getenv("PORT", "8000"))
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ]
    
    # Ingestion limits
    MAX_UPLOAD_SIZE_BYTES: int = 10 * 1024 * 1024  # 10 MB
    MAX_ROW_COUNT: int = 100_000
    DEFAULT_TIMEZONE: str = os.getenv("DEFAULT_TIMEZONE", "UTC")
    
    # Storage
    ENABLE_SQLITE_PERSISTENCE: bool = os.getenv("ENABLE_SQLITE_PERSISTENCE", "true").lower() in ("true", "1")
    SQLITE_DB_PATH: str = os.getenv("SQLITE_DB_PATH", os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "privilege_guard.db"))
    
    # Severity Thresholds (Score Bounds)
    SEVERITY_THRESHOLDS: Dict[str, Dict[str, int]] = {
        "Critical": {"min": 85, "max": 100},
        "High": {"min": 65, "max": 84},
        "Medium": {"min": 35, "max": 64},
        "Low": {"min": 0, "max": 34}
    }
    
    # Default Rule Base Weights
    RULE_WEIGHTS: Dict[str, int] = {
        "RULE-001": 55,  # Privilege elevation
        "RULE-002": 65,  # Administrator account creation
        "RULE-003": 55,  # Privileged group assignment
        "RULE-004": 35,  # Permission modification
        "RULE-005": 15,  # After-hours activity
        "RULE-006": 25,  # Repeated failures
        "RULE-007": 20,  # Multiple privilege events
        "RULE-008": 25,  # Suspicious event sequence
        "RULE-009": 20   # Unfamiliar IP
    }
    
    # Privileged roles & groups
    PRIVILEGED_ROLES: List[str] = [
        "admin", "administrator", "root", "sysadmin", "global_admin",
        "domain_admin", "superadmin", "security_admin", "iam_admin"
    ]
    
    PRIVILEGED_GROUPS: List[str] = [
        "administrators", "domain admins", "enterprise admins", "sudo",
        "wheel", "schema admins", "root", "security admins", "cloud-admins"
    ]
    
    # Business hours for Rule 5
    BUSINESS_HOUR_START: int = 9   # 09:00
    BUSINESS_HOUR_END: int = 18    # 18:00
    BUSINESS_DAYS: List[int] = [0, 1, 2, 3, 4]  # Mon-Fri (0=Monday)
    
    # Window thresholds
    REPEATED_FAILURES_THRESHOLD: int = 5
    REPEATED_FAILURES_WINDOW_MINUTES: int = 10
    MULTIPLE_EVENTS_THRESHOLD: int = 3
    MULTIPLE_EVENTS_WINDOW_MINUTES: int = 15
    SEQUENCE_WINDOW_MINUTES: int = 30

settings = Settings()
