import io
import csv
import json
from datetime import datetime
from typing import List, Dict, Any, Optional

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

from app.schemas import CanonicalEvent, DetectionAlert, ReportSummary

def generate_alerts_csv(alerts: List[DetectionAlert]) -> str:
    """Generate RFC 4180 compliant CSV string of security alerts."""
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Alert ID", "Timestamp", "Actor", "Target User", "Action",
        "Rule ID", "Rule Name", "Risk Score", "Severity",
        "Investigation Status", "Source IP", "Explanation"
    ])
    for a in alerts:
        writer.writerow([
            a.alert_id,
            a.timestamp,
            a.actor,
            a.target_user or "",
            a.action,
            a.rule_id,
            a.rule_name,
            a.risk_score,
            a.severity,
            a.investigation_status,
            a.source_ip or "",
            a.explanation
        ])
    return output.getvalue()

def generate_events_csv(events: List[CanonicalEvent]) -> str:
    """Generate CSV string of normalized audit events."""
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Event ID", "Timestamp", "Actor", "Action", "Target User",
        "Source IP", "Previous Role", "New Role", "Status", "Resource"
    ])
    for e in events:
        writer.writerow([
            e.event_id,
            e.timestamp,
            e.actor,
            e.action,
            e.target_user or "",
            e.source_ip or "",
            e.previous_role or "",
            e.new_role or "",
            e.status,
            e.resource or ""
        ])
    return output.getvalue()

def generate_audit_summary_json(
    events: List[CanonicalEvent],
    alerts: List[DetectionAlert],
    dataset_name: str = "Active Dataset"
) -> Dict[str, Any]:
    """Generate structured audit summary dictionary."""
    sev_counts = {"Critical": 0, "High": 0, "Medium": 0, "Low": 0}
    rule_counts = {}
    for a in alerts:
        sev_counts[a.severity] = sev_counts.get(a.severity, 0) + 1
        rule_counts[a.rule_name] = rule_counts.get(a.rule_name, 0) + 1

    crit_alerts = [
        {
            "alert_id": a.alert_id,
            "timestamp": a.timestamp,
            "actor": a.actor,
            "rule": a.rule_name,
            "risk_score": a.risk_score,
            "severity": a.severity,
            "explanation": a.explanation,
            "recommended_actions": a.recommended_actions
        }
        for a in alerts if a.severity in ["Critical", "High"]
    ][:10]

    return {
        "report_title": "PrivilegeGuard Threat Detection Audit Report",
        "generated_at": datetime.now().isoformat(),
        "dataset_name": dataset_name,
        "total_events": len(events),
        "total_alerts": len(alerts),
        "severity_distribution": sev_counts,
        "rule_frequency": rule_counts,
        "critical_high_alerts_preview": crit_alerts,
        "recommendations": [
            "Prioritize investigation of accounts with sequence correlation alerts (Rule 8).",
            "Audit all after-hours privilege elevations against approved maintenance change requests.",
            "Verify all additions to sensitive groups (Administrators, sudo, Domain Admins).",
            "Revoke stale or unexpected elevated role grants immediately."
        ],
        "disclaimer": "PrivilegeGuard identifies potentially suspicious activity based on rule heuristics and contextual indicators. It does not confirm an attack occurred without SOC analyst verification."
    }

def generate_pdf_report(
    events: List[CanonicalEvent],
    alerts: List[DetectionAlert],
    dataset_name: str = "Active Dataset"
) -> bytes:
    """Generate a high-quality professional PDF executive security report."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Custom typography
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=colors.HexColor('#0B1220')
    )
    subtitle_style = ParagraphStyle(
        'DocSub',
        parent=styles['Normal'],
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#64748B')
    )
    h2_style = ParagraphStyle(
        'Heading2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#1E293B'),
        spaceBefore=14,
        spaceAfter=8
    )
    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#334155')
    )
    alert_box_style = ParagraphStyle(
        'AlertBox',
        parent=styles['Normal'],
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#1E293B')
    )

    story = []

    # Title & Header
    story.append(Paragraph("PrivilegeGuard Security Audit Report", title_style))
    story.append(Paragraph(f"Dataset: <b>{dataset_name}</b> | Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}", subtitle_style))
    story.append(Spacer(1, 12))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#3B82F6'), spaceAfter=14))

    # Executive Summary Table
    story.append(Paragraph("Executive Summary", h2_style))
    
    crit_count = sum(1 for a in alerts if a.severity == "Critical")
    high_count = sum(1 for a in alerts if a.severity == "High")
    med_count = sum(1 for a in alerts if a.severity == "Medium")
    low_count = sum(1 for a in alerts if a.severity == "Low")

    summary_data = [
        [Paragraph("<b>Metric</b>", body_style), Paragraph("<b>Value</b>", body_style), Paragraph("<b>Status / Guidance</b>", body_style)],
        [Paragraph("Total Events Analyzed", body_style), str(len(events)), "Processed and normalized into canonical format"],
        [Paragraph("Suspicious Activity Alerts", body_style), str(len(alerts)), f"{crit_count + high_count} require immediate investigation"],
        [Paragraph("Critical Severity Alerts", body_style), str(crit_count), "High-impact privilege escalation detected"],
        [Paragraph("High Severity Alerts", body_style), str(high_count), "Potentially unauthorized administrative activities"],
        [Paragraph("Medium & Low Alerts", body_style), str(med_count + low_count), "Contextual anomalies or policy adjustments"]
    ]
    summary_table = Table(summary_data, colWidths=[150, 70, 320])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#F1F5F9')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#1E293B')),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 14))

    # Priority Threat Detections Table
    story.append(Paragraph("Priority Detections (Top Alerts)", h2_style))
    
    crit_high = [a for a in alerts if a.severity in ["Critical", "High"]][:6]
    if not crit_high:
        crit_high = alerts[:6]

    if crit_high:
        table_rows = [
            [
                Paragraph("<b>Alert ID</b>", alert_box_style),
                Paragraph("<b>Actor</b>", alert_box_style),
                Paragraph("<b>Rule</b>", alert_box_style),
                Paragraph("<b>Score</b>", alert_box_style),
                Paragraph("<b>Severity</b>", alert_box_style),
                Paragraph("<b>Explanation</b>", alert_box_style)
            ]
        ]
        for a in crit_high:
            sev_color = colors.HexColor('#EF4444') if a.severity == "Critical" else (colors.HexColor('#F97316') if a.severity == "High" else colors.HexColor('#F59E0B'))
            table_rows.append([
                Paragraph(a.alert_id[:12], alert_box_style),
                Paragraph(a.actor, alert_box_style),
                Paragraph(a.rule_name, alert_box_style),
                str(a.risk_score),
                Paragraph(f"<font color='{sev_color.hexval()}'><b>{a.severity}</b></font>", alert_box_style),
                Paragraph(a.explanation[:120] + ("..." if len(a.explanation) > 120 else ""), alert_box_style)
            ])
            
        alerts_table = Table(table_rows, colWidths=[70, 75, 110, 40, 55, 190])
        alerts_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#F8FAFC')),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
        ]))
        story.append(alerts_table)
    else:
        story.append(Paragraph("No critical or high severity alerts identified in this dataset.", body_style))

    story.append(Spacer(1, 14))

    # Recommendations
    story.append(Paragraph("Strategic Analyst Recommendations", h2_style))
    rec_text = """
    1. <b>Account Isolation & Session Revocation:</b> Immediately invalidate active web tokens and Kerberos/SAML sessions for accounts involved in Multi-Stage Sequence Correlation alerts.<br/>
    2. <b>Change Ticket Reconciliation:</b> Cross-reference all Rule-001 (Privilege Elevation) and Rule-003 (Group Membership) alerts against change control tickets in ServiceNow/Jira.<br/>
    3. <b>Enforce Least Privilege:</b> Audit wildcard permissions granted in IAM policies and restrict administrative groups to emergency break-glass identities.<br/>
    4. <b>MFA Validation:</b> Require phishing-resistant hardware MFA for any after-hours administrative activity.
    """
    story.append(Paragraph(rec_text, body_style))
    story.append(Spacer(1, 14))

    # Disclaimer
    disclaimer_text = """
    <i><b>Critical Operational Disclaimer:</b> PrivilegeGuard identifies potentially suspicious activity based on rule heuristics and temporal correlation. Detection outputs do not constitute proof of an attack or unauthorized compromise. Every alert must be independently verified by a qualified Security Operations Center (SOC) analyst.</i>
    """
    story.append(Paragraph(disclaimer_text, ParagraphStyle('Disclaimer', parent=styles['Italic'], fontSize=8, leading=10, textColor=colors.HexColor('#64748B'))))

    doc.build(story)
    return buffer.getvalue()
