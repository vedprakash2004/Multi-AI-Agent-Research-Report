"""
History manager for persisting saved research reports locally.
"""
import os
import json
import datetime

HISTORY_FILE = "research_history.json"

def load_history():
    """Load saved reports from JSON storage file."""
    if not os.path.exists(HISTORY_FILE):
        return []
    try:
        with open(HISTORY_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []

def save_to_history(topic, domain, depth, markdown_content, audit_score):
    """Save a newly generated research report to persistent storage."""
    history = load_history()
    entry = {
        "id": f"report_{int(datetime.datetime.now().timestamp())}",
        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
        "topic": topic,
        "domain": domain,
        "depth": depth,
        "audit_score": audit_score,
        "content": markdown_content
    }
    history.insert(0, entry) # Most recent first
    try:
        with open(HISTORY_FILE, "w", encoding="utf-8") as f:
            json.dump(history, f, indent=2)
    except Exception as e:
        print(f"Error saving report history: {e}")
    return entry

def delete_from_history(report_id):
    """Delete a report by ID."""
    history = load_history()
    updated = [item for item in history if item.get("id") != report_id]
    try:
        with open(HISTORY_FILE, "w", encoding="utf-8") as f:
            json.dump(updated, f, indent=2)
    except Exception as e:
        print(f"Error updating report history: {e}")
    return updated
