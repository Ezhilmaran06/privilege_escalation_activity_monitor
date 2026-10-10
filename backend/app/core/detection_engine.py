from typing import List, Dict, Any, Optional, Set
from datetime import datetime, timedelta, timezone
import pandas as pd

from app.schemas import CanonicalEvent, DetectionAlert
from app.config import settings
from app.core.utils import parse_timestamp, format_iso_timestamp, is_after_hours, generate_id
from app.core.risk_scoring import compute_risk_score

RULE_DEFINITIONS = {
    "RULE-001": {
        "name": "Privilege Elevation",
        "category": "Privilege Escalation",
        "description": "Detects transition from a standard role to a privileged role.",
        "recommended_actions": [
            "Verify with IT/IAM if this role elevation had an approved change request or ticket.",
            "Inspect the authorizing actor and verify multi-factor authentication was validated.",
            "Review session activity immediately following the role change for unauthorized actions."
        ]
    },
    "RULE-002": {
        "name": "Administrator Account Creation",
        "category": "Persistence / Account Creation",
        "description": "Detects creation of a new user account granted administrative or elevated rights.",
        "recommended_actions": [
            "Confirm whether new administrator onboarding was scheduled in directory services.",
            "Verify identity proofing and credentials provisioning channel.",
            "Check for immediate anomalous logins from new account."
        ]
    },
    "RULE-003": {
        "name": "Privileged Group Membership Addition",
        "category": "Privilege Escalation",
        "description": "Detects addition of an identity into sensitive administrative groups (e.g., Domain Admins, sudo).",
        "recommended_actions": [
            "Audit directory group membership change logs.",
            "Confirm authorization from group owner.",
            "Temporarily restrict elevated group tokens if unexpected."
        ]
    },
    "RULE-004": {
        "name": "Suspicious Permission Modification",
        "category": "Policy Modification",
        "description": "Detects permission changes that increase privileged capabilities or attach admin policies.",
        "recommended_actions": [
            "Inspect updated IAM policies or ACLs for overly permissive grants (e.g., full wildcard access).",
            "Review rollback procedures for the modified policy.",
            "Check actor's recent permission modification history."
        ]
    },
    "RULE-005": {
        "name": "After-Hours Administrative Activity",
        "category": "Anomalous Behavior",
        "description": "Detects privileged operations performed outside of standard business hours (Mon-Fri 09:00-18:00 UTC).",
        "recommended_actions": [
            "Cross-reference maintenance windows or on-call schedules.",
            "Verify actor's physical or VPN login location during this time.",
            "Contact user to verify out-of-band operational activity."
        ]
    },
    "RULE-006": {
        "name": "Repeated Failed Administrative Access",
        "category": "Credential Access / Brute Force",
        "description": "Detects 5 or more failed authentication attempts for an administrative account within 10 minutes.",
        "recommended_actions": [
            "Check if account is targeted by password spraying or brute force.",
            "Verify IP reputation and block origin IP if external/unrecognized.",
            "Enforce immediate credential reset or temporary lock if compromised."
        ]
    },
    "RULE-007": {
        "name": "Multiple Privilege-Related Events in Burst",
        "category": "Rapid Escalation",
        "description": "Detects a burst of 3 or more privilege modifications by the same actor within 15 minutes.",
        "recommended_actions": [
            "Check if actor is running an automated deployment script or provisioning run.",
            "Interview actor regarding the batch administration tasks.",
            "Review all actions taken during the time burst."
        ]
    },
    "RULE-008": {
        "name": "Suspicious Multi-Stage Sequence Correlation",
        "category": "Complex Escalation Sequence",
        "description": "Correlates failed authentication attempts, followed by a successful login, followed by privilege escalation within 30 minutes.",
        "recommended_actions": [
            "High priority: Initiate incident triage protocol for potential account takeover.",
            "Revoke active sessions and force token invalidation for involved accounts.",
            "Isolate affected hosts and collect memory/network telemetry."
        ]
    },
    "RULE-009": {
        "name": "Unfamiliar IP Address During Privilege Change",
        "category": "Anomalous Origin",
        "description": "Detects administrative privilege changes originating from an IP address outside baseline known IPs.",
        "recommended_actions": [
            "Inspect IP geolocation, ASN, and VPN/proxy indicators.",
            "Check whether user is travelling or using an unauthorized remote workstation.",
            "Verify user session MFA verification logs for that source IP."
        ]
    }
}

class DetectionEngine:
    def __init__(self, known_baseline_ips: Optional[Set[str]] = None):
        # Baseline IPs (if provided; if None, derived from common events or flagged as explicit unknown)
        self.known_baseline_ips = known_baseline_ips or {"10.0.0.1", "10.0.0.5", "192.168.1.100", "127.0.0.1", "10.10.1.50"}

    def is_privileged_role(self, role: Optional[str]) -> bool:
        if not role:
            return False
        r = role.lower().strip()
        return any(priv in r for priv in settings.PRIVILEGED_ROLES)

    def is_privileged_group(self, group: Optional[str]) -> bool:
        if not group:
            return False
        g = group.lower().strip()
        return any(priv in g for priv in settings.PRIVILEGED_GROUPS)

    def run_all_rules(self, events: List[CanonicalEvent]) -> List[DetectionAlert]:
        """Analyze normalized events across all 9 detection rules and return explainable alerts."""
        if not events:
            return []

        # Convert to Pandas DataFrame for efficient temporal indexing & correlation
        records = [e.model_dump() for e in events]
        df = pd.DataFrame(records)
        df["dt"] = pd.to_datetime(df["timestamp"], utc=True)
        df = df.sort_values("dt").reset_index(drop=True)

        alerts: List[DetectionAlert] = []

        # Execute rules
        alerts.extend(self._rule_001_privilege_elevation(df, events))
        alerts.extend(self._rule_002_admin_account_creation(df, events))
        alerts.extend(self._rule_003_privileged_group_membership(df, events))
        alerts.extend(self._rule_004_permission_modification(df, events))
        alerts.extend(self._rule_005_after_hours_activity(df, events))
        alerts.extend(self._rule_006_repeated_failed_access(df, events))
        alerts.extend(self._rule_007_multiple_privilege_burst(df, events))
        alerts.extend(self._rule_008_suspicious_event_sequence(df, events))
        alerts.extend(self._rule_009_unfamiliar_ip(df, events))

        # Sort alerts descending by risk_score and then timestamp
        alerts.sort(key=lambda a: (a.risk_score, a.timestamp), reverse=True)
        return alerts

    def _create_alert(
        self,
        rule_id: str,
        event: CanonicalEvent,
        explanation: str,
        evidence: Dict[str, Any],
        related_ids: List[str] = None,
        context_modifiers: List[Dict[str, Any]] = None,
        evidence_quality: str = "High"
    ) -> DetectionAlert:
        rule_meta = RULE_DEFINITIONS[rule_id]
        score_bd = compute_risk_score(rule_id, context_modifiers)
        
        rel_ids = list(set([event.event_id] + (related_ids or [])))
        alert_id = generate_id("ALT", rule_id, event.actor, event.timestamp, str(len(rel_ids)))

        return DetectionAlert(
            alert_id=alert_id,
            timestamp=event.timestamp,
            actor=event.actor,
            target_user=event.target_user or event.actor,
            action=event.action,
            resource=event.resource,
            source_ip=event.source_ip,
            rule_id=rule_id,
            rule_name=rule_meta["name"],
            risk_score=score_bd.final_score,
            severity=score_bd.severity,
            explanation=explanation,
            evidence=evidence,
            recommended_actions=rule_meta["recommended_actions"],
            related_event_ids=rel_ids,
            evidence_quality=evidence_quality,
            investigation_status="New",
            score_breakdown=score_bd
        )

    # --- RULE 1: Privilege Elevation ---
    def _rule_001_privilege_elevation(self, df: pd.DataFrame, events: List[CanonicalEvent]) -> List[DetectionAlert]:
        alerts = []
        for e in events:
            if e.status != "success":
                continue
            is_new_priv = self.is_privileged_role(e.new_role)
            is_prev_priv = self.is_privileged_role(e.previous_role)
            
            # Elevation occurs if new role is privileged and previous role was not privileged
            if is_new_priv and not is_prev_priv:
                quality = "High" if e.previous_role else "Medium"
                limitation = "" if e.previous_role else " Previous role was unspecified in logs; verified elevated assignment."
                explanation = (
                    f"Actor '{e.actor}' successfully elevated role to '{e.new_role}'"
                    + (f" from '{e.previous_role}'." if e.previous_role else ".")
                    + limitation
                )
                modifiers = []
                if not e.previous_role:
                    modifiers.append({"name": "Unspecified Prior Role", "weight": -10, "reason": "Lower evidence confidence due to missing previous role"})
                if e.target_user and e.target_user != e.actor:
                    modifiers.append({"name": "Cross-Account Grant", "weight": +10, "reason": "Grant was applied across different user identity"})

                alerts.append(self._create_alert(
                    "RULE-001", e, explanation,
                    evidence={
                        "actor": e.actor,
                        "target_user": e.target_user,
                        "previous_role": e.previous_role or "unknown",
                        "new_role": e.new_role,
                        "evidence_limitation": limitation.strip() or "None"
                    },
                    context_modifiers=modifiers,
                    evidence_quality=quality
                ))
        return alerts

    # --- RULE 2: Administrator Account Creation ---
    def _rule_002_admin_account_creation(self, df: pd.DataFrame, events: List[CanonicalEvent]) -> List[DetectionAlert]:
        alerts = []
        for e in events:
            if e.status != "success":
                continue
            act = e.action.lower()
            is_create_action = any(k in act for k in ["create_user", "add_user", "user_create", "account_creation", "new_account"])
            is_new_priv = self.is_privileged_role(e.new_role) or (e.target_user and self.is_privileged_role(e.target_user))
            
            if is_create_action and is_new_priv:
                explanation = f"Actor '{e.actor}' created new administrative identity '{e.target_user or 'admin'}' with elevated role '{e.new_role or 'admin'}'."
                modifiers = [
                    {"name": "Immediate Admin Assignment", "weight": +10, "reason": "Account was provisioned directly with administrator-level rights"}
                ]
                alerts.append(self._create_alert(
                    "RULE-002", e, explanation,
                    evidence={
                        "actor": e.actor,
                        "created_account": e.target_user,
                        "assigned_role": e.new_role,
                        "action": e.action
                    },
                    context_modifiers=modifiers
                ))
        return alerts

    # --- RULE 3: Privileged Group Membership ---
    def _rule_003_privileged_group_membership(self, df: pd.DataFrame, events: List[CanonicalEvent]) -> List[DetectionAlert]:
        alerts = []
        for e in events:
            if e.status != "success":
                continue
            act = e.action.lower()
            # Distinguish addition from removal
            is_add = any(k in act for k in ["add_member", "group_add", "add_to_group", "member_added", "grant_group"])
            is_remove = any(k in act for k in ["remove_member", "group_remove", "delete_member"])
            if is_remove:
                continue

            # Check target resource or new_role for privileged group
            group_candidate = e.resource or e.new_role or ""
            if (is_add or "group" in act) and self.is_privileged_group(group_candidate):
                explanation = f"Actor '{e.actor}' assigned identity '{e.target_user or e.actor}' into privileged group '{group_candidate}'."
                modifiers = [
                    {"name": "Critical Group Grant", "weight": +15, "reason": f"Target group '{group_candidate}' possesses full domain/administrative rights"}
                ]
                alerts.append(self._create_alert(
                    "RULE-003", e, explanation,
                    evidence={
                        "actor": e.actor,
                        "target_user": e.target_user,
                        "privileged_group": group_candidate,
                        "action": e.action
                    },
                    context_modifiers=modifiers
                ))
        return alerts

    # --- RULE 4: Role or Permission Modification ---
    def _rule_004_permission_modification(self, df: pd.DataFrame, events: List[CanonicalEvent]) -> List[DetectionAlert]:
        alerts = []
        for e in events:
            if e.status != "success":
                continue
            act = e.action.lower()
            is_perm_mod = any(k in act for k in ["modify_policy", "attach_policy", "grant_permission", "update_permissions", "change_privilege", "role_edit"])
            
            if is_perm_mod:
                res = e.resource or "IAM Policy"
                # Check if privilege increasing
                is_escalation = any(k in (e.new_role or "").lower() or k in res.lower() for k in ["fullaccess", "admin", "*", "write", "manage"])
                explanation = f"Actor '{e.actor}' executed permission change on '{res}' (Action: '{e.action}')."
                modifiers = []
                if is_escalation:
                    modifiers.append({"name": "Privilege-Increasing Modification", "weight": +25, "reason": "Policy includes elevated or full administrative permissions"})
                else:
                    modifiers.append({"name": "Standard Policy Edit", "weight": 0, "reason": "Routine permission modification"})

                alerts.append(self._create_alert(
                    "RULE-004", e, explanation,
                    evidence={
                        "actor": e.actor,
                        "target_resource": res,
                        "action": e.action,
                        "new_permissions": e.new_role or "Granted"
                    },
                    context_modifiers=modifiers
                ))
        return alerts

    # --- RULE 5: After-Hours Administrative Activity ---
    def _rule_005_after_hours_activity(self, df: pd.DataFrame, events: List[CanonicalEvent]) -> List[DetectionAlert]:
        alerts = []
        for e in events:
            if e.status != "success":
                continue
            # Must be an administrative action or elevated role
            is_admin_action = (
                self.is_privileged_role(e.new_role) or 
                self.is_privileged_role(e.previous_role) or
                self.is_privileged_group(e.resource) or
                any(k in e.action.lower() for k in ["admin", "root", "sudo", "role", "group", "policy", "token"])
            )
            if not is_admin_action:
                continue

            dt = parse_timestamp(e.timestamp)
            if dt and is_after_hours(dt, settings.BUSINESS_HOUR_START, settings.BUSINESS_HOUR_END):
                explanation = f"Actor '{e.actor}' executed administrative activity '{e.action}' outside business hours ({dt.strftime('%A %H:%M UTC')}). Contextual indicator."
                modifiers = [
                    {"name": "Off-Hours Execution", "weight": +10, "reason": "Operation performed during non-business hours / weekend"}
                ]
                alerts.append(self._create_alert(
                    "RULE-005", e, explanation,
                    evidence={
                        "actor": e.actor,
                        "timestamp_utc": dt.isoformat(),
                        "action": e.action,
                        "weekday": dt.strftime("%A"),
                        "hour_utc": dt.hour,
                        "context_note": "Outside Mon-Fri 09:00-18:00 UTC schedule"
                    },
                    context_modifiers=modifiers,
                    evidence_quality="Medium"
                ))
        return alerts

    # --- RULE 6: Repeated Failed Administrative Access ---
    def _rule_006_repeated_failed_access(self, df: pd.DataFrame, events: List[CanonicalEvent]) -> List[DetectionAlert]:
        alerts = []
        if df.empty:
            return alerts

        failed_df = df[df["status"] == "failure"].copy()
        if failed_df.empty:
            return alerts

        window_td = timedelta(minutes=settings.REPEATED_FAILURES_WINDOW_MINUTES)
        
        # Group by actor
        for actor, group in failed_df.groupby("actor"):
            group = group.sort_values("dt")
            # Rolling window search
            dts = group["dt"].tolist()
            indices = group.index.tolist()
            
            i = 0
            while i < len(dts):
                start_time = dts[i]
                end_time = start_time + window_td
                window_indices = [idx for idx, t in zip(indices, dts) if start_time <= t <= end_time]
                
                if len(window_indices) >= settings.REPEATED_FAILURES_THRESHOLD:
                    trigger_row = df.loc[window_indices[-1]]
                    related_ids = df.loc[window_indices, "event_id"].tolist()
                    trigger_event = [ev for ev in events if ev.event_id == trigger_row["event_id"]][0]
                    
                    explanation = (
                        f"Actor '{actor}' encountered {len(window_indices)} failed administrative access attempts "
                        f"within {settings.REPEATED_FAILURES_WINDOW_MINUTES} minutes."
                    )
                    modifiers = [
                        {"name": "High Failure Velocity", "weight": +15, "reason": f"{len(window_indices)} consecutive authentication failures"}
                    ]
                    alerts.append(self._create_alert(
                        "RULE-006", trigger_event, explanation,
                        evidence={
                            "actor": actor,
                            "failure_count": len(window_indices),
                            "window_minutes": settings.REPEATED_FAILURES_WINDOW_MINUTES,
                            "first_failure": dts[i].isoformat(),
                            "last_failure": dts[i + len(window_indices) - 1].isoformat(),
                            "source_ip": trigger_row.get("source_ip")
                        },
                        related_ids=related_ids,
                        context_modifiers=modifiers
                    ))
                    # Advance index past this window to avoid duplicate overlapping counts
                    i += len(window_indices)
                else:
                    i += 1
        return alerts

    # --- RULE 7: Multiple Privilege-Related Events in Burst ---
    def _rule_007_multiple_privilege_burst(self, df: pd.DataFrame, events: List[CanonicalEvent]) -> List[DetectionAlert]:
        alerts = []
        if df.empty:
            return alerts

        # Identify privilege events
        def is_priv_event(row):
            action = str(row.get("action", "")).lower()
            new_role = str(row.get("new_role", "")).lower()
            res = str(row.get("resource", "")).lower()
            return (
                any(k in action for k in ["role", "privilege", "admin", "group", "policy", "sudo", "permission"]) or
                self.is_privileged_role(new_role) or
                self.is_privileged_group(res)
            )

        priv_mask = df.apply(is_priv_event, axis=1)
        priv_df = df[priv_mask].copy()
        if priv_df.empty:
            return alerts

        window_td = timedelta(minutes=settings.MULTIPLE_EVENTS_WINDOW_MINUTES)

        for actor, group in priv_df.groupby("actor"):
            group = group.sort_values("dt")
            dts = group["dt"].tolist()
            indices = group.index.tolist()

            i = 0
            while i < len(dts):
                start_time = dts[i]
                end_time = start_time + window_td
                window_indices = [idx for idx, t in zip(indices, dts) if start_time <= t <= end_time]

                if len(window_indices) >= settings.MULTIPLE_EVENTS_THRESHOLD:
                    trigger_row = df.loc[window_indices[-1]]
                    related_ids = df.loc[window_indices, "event_id"].tolist()
                    trigger_event = [ev for ev in events if ev.event_id == trigger_row["event_id"]][0]

                    explanation = (
                        f"Actor '{actor}' triggered {len(window_indices)} privilege-modifying events "
                        f"within a {settings.MULTIPLE_EVENTS_WINDOW_MINUTES}-minute time window."
                    )
                    modifiers = [
                        {"name": "Privilege Velocity Burst", "weight": +15, "reason": f"{len(window_indices)} privileged modifications in rapid succession"}
                    ]
                    alerts.append(self._create_alert(
                        "RULE-007", trigger_event, explanation,
                        evidence={
                            "actor": actor,
                            "event_count": len(window_indices),
                            "window_minutes": settings.MULTIPLE_EVENTS_WINDOW_MINUTES,
                            "first_event": dts[i].isoformat(),
                            "last_event": dts[i + len(window_indices) - 1].isoformat()
                        },
                        related_ids=related_ids,
                        context_modifiers=modifiers
                    ))
                    i += len(window_indices)
                else:
                    i += 1
        return alerts

    # --- RULE 8: Suspicious Multi-Stage Sequence Correlation ---
    def _rule_008_suspicious_event_sequence(self, df: pd.DataFrame, events: List[CanonicalEvent]) -> List[DetectionAlert]:
        alerts = []
        if df.empty:
            return alerts

        seq_window = timedelta(minutes=settings.SEQUENCE_WINDOW_MINUTES)

        for actor, group in df.groupby("actor"):
            group = group.sort_values("dt").reset_index()
            # Find failure events
            fail_indices = group[group["status"] == "failure"].index.tolist()

            for f_idx in fail_indices:
                fail_time = group.loc[f_idx, "dt"]
                window_end = fail_time + seq_window

                # Look for subsequent success login within window
                succ_candidates = group[
                    (group.index > f_idx) &
                    (group["dt"] <= window_end) &
                    (group["status"] == "success") &
                    (group["action"].str.lower().str.contains("login|auth|session|signin", regex=True))
                ]
                if succ_candidates.empty:
                    continue

                for s_idx in succ_candidates.index.tolist():
                    succ_time = group.loc[s_idx, "dt"]

                    # Look for subsequent privilege escalation
                    priv_candidates = group[
                        (group.index > s_idx) &
                        (group["dt"] <= window_end) &
                        (group["status"] == "success") &
                        (
                            group["action"].str.lower().str.contains("role|admin|privilege|group|create_user|policy", regex=True) |
                            group["new_role"].apply(lambda r: self.is_privileged_role(r) if pd.notna(r) else False)
                        )
                    ]
                    if priv_candidates.empty:
                        continue

                    # Sequence confirmed: Fail -> Login -> Privilege escalation!
                    p_idx = priv_candidates.index.tolist()[0]
                    priv_row = group.loc[p_idx]
                    fail_row = group.loc[f_idx]
                    succ_row = group.loc[s_idx]

                    trigger_event = [ev for ev in events if ev.event_id == priv_row["event_id"]][0]
                    related_ids = [fail_row["event_id"], succ_row["event_id"], priv_row["event_id"]]

                    explanation = (
                        f"Detected suspicious 3-stage kill-chain sequence for actor '{actor}': "
                        f"(1) Authentication failure at {fail_row['dt'].strftime('%H:%M:%S')}, "
                        f"(2) Successful login at {succ_row['dt'].strftime('%H:%M:%S')}, "
                        f"(3) Privilege escalation '{priv_row['action']}' at {priv_row['dt'].strftime('%H:%M:%S')}."
                    )
                    modifiers = [
                        {"name": "Multi-Stage Correlation", "weight": +35, "reason": "Failed login immediately followed by successful entry and privilege escalation"}
                    ]
                    alerts.append(self._create_alert(
                        "RULE-008", trigger_event, explanation,
                        evidence={
                            "actor": actor,
                            "stage_1_failure": {"event_id": fail_row["event_id"], "time": fail_row["dt"].isoformat(), "action": fail_row["action"]},
                            "stage_2_success_login": {"event_id": succ_row["event_id"], "time": succ_row["dt"].isoformat(), "action": succ_row["action"]},
                            "stage_3_escalation": {"event_id": priv_row["event_id"], "time": priv_row["dt"].isoformat(), "action": priv_row["action"]},
                            "correlation_window_minutes": settings.SEQUENCE_WINDOW_MINUTES
                        },
                        related_ids=related_ids,
                        context_modifiers=modifiers
                    ))
                    break  # Alert once per sequence start
        return alerts

    # --- RULE 9: Unfamiliar IP Address During Privilege Change ---
    def _rule_009_unfamiliar_ip(self, df: pd.DataFrame, events: List[CanonicalEvent]) -> List[DetectionAlert]:
        alerts = []
        for e in events:
            if e.status != "success":
                continue
            # Must involve privilege or admin action
            is_priv = (
                self.is_privileged_role(e.new_role) or
                self.is_privileged_group(e.resource) or
                any(k in e.action.lower() for k in ["admin", "root", "role", "group_add", "privilege"])
            )
            if not is_priv:
                continue

            if not e.source_ip:
                # Explicit unknown assessment rather than inventing familiarity
                continue

            # Compare against baseline
            if e.source_ip not in self.known_baseline_ips:
                explanation = (
                    f"Actor '{e.actor}' executed administrative action '{e.action}' from unfamiliar source IP '{e.source_ip}' "
                    f"not in baseline authorized IP set. Contextual indicator."
                )
                modifiers = [
                    {"name": "Anomalous Source IP", "weight": +20, "reason": f"IP '{e.source_ip}' is outside familiar enterprise baseline"}
                ]
                alerts.append(self._create_alert(
                    "RULE-009", e, explanation,
                    evidence={
                        "actor": e.actor,
                        "action": e.action,
                        "source_ip": e.source_ip,
                        "baseline_policy": "Compared against configured enterprise IP baseline",
                        "baseline_sample": list(self.known_baseline_ips)[:3]
                    },
                    context_modifiers=modifiers,
                    evidence_quality="Medium"
                ))
        return alerts
