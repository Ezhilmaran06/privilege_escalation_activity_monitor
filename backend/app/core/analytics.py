from typing import List, Dict, Any, Optional
from collections import Counter
from datetime import datetime
import pandas as pd

from app.schemas import CanonicalEvent, DetectionAlert, ProcessingStats, DashboardSummary, UserRiskItem
from app.core.utils import parse_timestamp

def compute_dashboard_metrics(
    events: List[CanonicalEvent],
    alerts: List[DetectionAlert],
    stats: ProcessingStats,
    dataset_name: str = "Active Dataset"
) -> DashboardSummary:
    """Compute comprehensive security metrics and chart aggregations from actual processed data."""
    total_events = len(events)
    total_alerts = len(alerts)
    
    # Severity distribution
    sev_counts = {"Critical": 0, "High": 0, "Medium": 0, "Low": 0}
    for a in alerts:
        if a.severity in sev_counts:
            sev_counts[a.severity] += 1
        else:
            sev_counts[a.severity] = 1

    crit_high_count = sev_counts.get("Critical", 0) + sev_counts.get("High", 0)
    
    # Unique actors and affected users
    affected_users_set = set(a.target_user for a in alerts if a.target_user)
    affected_users_set.update(a.actor for a in alerts if a.actor)
    
    # Rule frequency
    rule_counter = Counter(a.rule_name for a in alerts)
    rule_frequency = [{"rule": rule, "count": count, "rule_id": next((a.rule_id for a in alerts if a.rule_name == rule), "")} for rule, count in rule_counter.most_common()]

    # Top affected users
    user_counter = Counter(a.target_user or a.actor for a in alerts)
    top_affected_users = [{"user": user, "alert_count": count} for user, count in user_counter.most_common(10)]

    # Risk score distribution buckets (0-20, 21-40, 41-60, 61-80, 81-100)
    risk_buckets = {"0-20": 0, "21-40": 0, "41-60": 0, "61-80": 0, "81-100": 0}
    for a in alerts:
        score = a.risk_score
        if score <= 20:
            risk_buckets["0-20"] += 1
        elif score <= 40:
            risk_buckets["21-40"] += 1
        elif score <= 60:
            risk_buckets["41-60"] += 1
        elif score <= 80:
            risk_buckets["61-80"] += 1
        else:
            risk_buckets["81-100"] += 1

    # Timeline overview (grouped into intervals)
    timeline_overview = []
    if events:
        try:
            df = pd.DataFrame([{"timestamp": e.timestamp} for e in events])
            df["dt"] = pd.to_datetime(df["timestamp"], utc=True)
            df = df.sort_values("dt")
            # Group into hour or minute slots
            df["time_slot"] = df["dt"].dt.strftime("%Y-%m-%d %H:00")
            grouped = df.groupby("time_slot").size().reset_index(name="event_count")
            
            # Count alerts in same slots
            if alerts:
                adf = pd.DataFrame([{"timestamp": a.timestamp} for a in alerts])
                adf["dt"] = pd.to_datetime(adf["timestamp"], utc=True)
                adf["time_slot"] = adf["dt"].dt.strftime("%Y-%m-%d %H:00")
                agrouped = adf.groupby("time_slot").size().reset_index(name="alert_count")
                merged = pd.merge(grouped, agrouped, on="time_slot", how="left").fillna(0)
            else:
                merged = grouped
                merged["alert_count"] = 0

            timeline_overview = [
                {
                    "time": row["time_slot"],
                    "events": int(row["event_count"]),
                    "alerts": int(row["alert_count"])
                }
                for _, row in merged.iterrows()
            ]
        except Exception:
            timeline_overview = []

    return DashboardSummary(
        total_events=total_events,
        suspicious_alerts=total_alerts,
        critical_high_alerts=crit_high_count,
        affected_users=len(affected_users_set),
        processing_success_rate=stats.success_rate,
        severity_distribution=sev_counts,
        rule_frequency=rule_frequency,
        top_affected_users=top_affected_users,
        timeline_overview=timeline_overview,
        risk_distribution=risk_buckets,
        processing_stats=stats,
        dataset_name=dataset_name,
        analyzed_at=datetime.now().isoformat()
    )

def compute_user_risk_analysis(events: List[CanonicalEvent], alerts: List[DetectionAlert]) -> List[UserRiskItem]:
    """Analyze and prioritize users by elevated risk indicators and alert histories."""
    user_map: Dict[str, Dict[str, Any]] = {}

    for a in alerts:
        user = a.target_user or a.actor
        if not user:
            continue
        if user not in user_map:
            user_map[user] = {
                "actor": user,
                "alerts": [],
                "actions": set(),
                "ips": set(),
                "highest_score": 0,
                "severities": Counter(),
                "recent_time": a.timestamp
            }
        u_data = user_map[user]
        u_data["alerts"].append(a)
        u_data["actions"].add(a.action)
        if a.source_ip:
            u_data["ips"].add(a.source_ip)
        if a.risk_score > u_data["highest_score"]:
            u_data["highest_score"] = a.risk_score
        u_data["severities"][a.severity] += 1
        if a.timestamp > u_data["recent_time"]:
            u_data["recent_time"] = a.timestamp

    # Also capture any actors from events that might not have alerts yet
    for e in events:
        if e.actor and e.actor not in user_map:
            user_map[e.actor] = {
                "actor": e.actor,
                "alerts": [],
                "actions": {e.action},
                "ips": {e.source_ip} if e.source_ip else set(),
                "highest_score": 0,
                "severities": Counter(),
                "recent_time": e.timestamp
            }

    results: List[UserRiskItem] = []
    severity_order = {"Critical": 4, "High": 3, "Medium": 2, "Low": 1, "None": 0}

    for user, data in user_map.items():
        highest_sev = "Low"
        for sev in ["Critical", "High", "Medium", "Low"]:
            if data["severities"][sev] > 0:
                highest_sev = sev
                break
        if not data["alerts"]:
            highest_sev = "Low"

        results.append(UserRiskItem(
            actor=user,
            alert_count=len(data["alerts"]),
            highest_risk_score=data["highest_score"],
            highest_severity=highest_sev,
            common_actions=list(data["actions"])[:5],
            recent_event_time=data["recent_time"],
            related_alert_ids=[a.alert_id for a in data["alerts"]],
            source_ips=list(data["ips"])[:5],
            severity_breakdown=dict(data["severities"])
        ))

    # Sort descending by highest_risk_score then alert_count
    results.sort(key=lambda u: (u.highest_risk_score, u.alert_count), reverse=True)
    return results
