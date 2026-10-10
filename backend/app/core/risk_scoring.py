from typing import List, Dict, Any, Tuple
from app.config import settings
from app.schemas import ScoreBreakdown

def classify_severity(score: int) -> str:
    """Classify integer risk score into severity level."""
    score = max(0, min(100, score))
    for severity, bounds in settings.SEVERITY_THRESHOLDS.items():
        if bounds["min"] <= score <= bounds["max"]:
            return severity
    return "Low"

def compute_risk_score(
    base_rule_id: str,
    context_modifiers: List[Dict[str, Any]] = None,
    custom_base_weight: int = None
) -> ScoreBreakdown:
    """
    Deterministic risk scoring:
    Final score = min(100, max(0, strongest applicable rule weight + sum(contextual contributions)))
    """
    if context_modifiers is None:
        context_modifiers = []
        
    base_weight = custom_base_weight if custom_base_weight is not None else settings.RULE_WEIGHTS.get(base_rule_id, 30)
    
    total_context = 0
    clean_contributions = []
    seen_factors = set()
    
    for mod in context_modifiers:
        factor_name = mod.get("name", "Context Factor")
        weight = int(mod.get("weight", 0))
        reason = mod.get("reason", "")
        
        # Deduplicate same factor additions
        if factor_name in seen_factors:
            continue
        seen_factors.add(factor_name)
        
        total_context += weight
        clean_contributions.append({
            "name": factor_name,
            "weight": weight,
            "reason": reason
        })
        
    raw_total = base_weight + total_context
    final_score = max(0, min(100, raw_total))
    severity = classify_severity(final_score)
    
    cap_note = None
    if raw_total > 100:
        cap_note = f"Score capped at 100 (raw sum was {raw_total})."
        
    summary_parts = [f"Base weight: {base_weight} ({base_rule_id})"]
    for c in clean_contributions:
        sign = "+" if c["weight"] >= 0 else ""
        summary_parts.append(f"{sign}{c['weight']} from {c['name']} ({c['reason']})")
    if cap_note:
        summary_parts.append(cap_note)
    summary_parts.append(f"-> Final Score: {final_score} [{severity}]")
    
    return ScoreBreakdown(
        base_weight=base_weight,
        contextual_contributions=clean_contributions,
        deduplication_notes=cap_note,
        final_score=final_score,
        severity=severity,
        calculation_summary="; ".join(summary_parts)
    )
