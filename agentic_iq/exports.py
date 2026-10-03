"""
Export utilities for generating PDF, Markdown, and JSON files from research reports.
"""
import json
import io
import re
from fpdf import FPDF
from agentic_iq.agents import calculate_topic_audit_score

class PDFReportGenerator(FPDF):
    def header(self):
        self.set_font("Helvetica", "B", 10)
        self.set_text_color(100, 100, 100)
        self.cell(0, 8, "AgenticIQ - Multi-Agent AI Research Report", border=0, align="R")
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(150, 150, 150)
        self.cell(0, 10, f"Page {self.page_no()}/{{nb}} | Confidential Research Output", align="C")

def sanitize_text(text):
    """Sanitizes text by replacing emojis and non-latin1 characters with clean ASCII for FPDF."""
    if not text:
        return ""
    emoji_map = {
        "📊": "[Report]", "🎯": "[Target]", "🔍": "[Search]", "🧠": "[AI]",
        "⚖️": "[Audit]", "📝": "[Architect]", "🚀": "[Launch]", "🌱": "[Eco]",
        "⚡": "[Speed]", "🔒": "[Security]", "✅": "[Verified]", "⚠️": "[Warning]",
        "💡": "[Insight]", "📈": "[Growth]", "📄": "[Doc]", "🤖": "[AI]"
    }
    for emoji, replacement in emoji_map.items():
        text = text.replace(emoji, replacement)
    return text.encode("latin-1", errors="replace").decode("latin-1")

def export_to_pdf(topic, markdown_text, audit_score):
    """Generates a clean PDF binary buffer from report markdown."""
    pdf = PDFReportGenerator()
    pdf.alias_nb_pages()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    
    # Title
    pdf.set_font("Helvetica", "B", 16)
    pdf.set_text_color(30, 41, 59) # Slate 800
    pdf.multi_cell(0, 10, sanitize_text(f"Research Report: {topic}"), new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)
    
    # Subtitle / Audit badge
    score_val = audit_score if audit_score is not None else calculate_topic_audit_score(topic)
    pdf.set_font("Helvetica", "I", 10)
    pdf.set_text_color(16, 185, 129) # Emerald Green
    pdf.cell(0, 8, f"Audited Fact Score: {score_val}% Verified", new_x="LMARGIN", new_y="NEXT")
    pdf.set_draw_color(226, 232, 240)
    pdf.line(10, pdf.get_y() + 2, 200, pdf.get_y() + 2)
    pdf.ln(8)
    
    # Body Content
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(51, 65, 85)
    
    lines = markdown_text.split("\n")
    for line in lines:
        line_clean = sanitize_text(line.replace("**", "").replace("`", "").strip())
        if not line_clean:
            pdf.ln(3)
            continue
        
        # Horizontal rule
        if line_clean == "---":
            pdf.set_draw_color(226, 232, 240)
            pdf.line(10, pdf.get_y() + 2, 200, pdf.get_y() + 2)
            pdf.ln(4)
            continue
            
        # Ignore markdown table delimiter lines like | :--- | :---: | :--- |
        if re.match(r"^\|?\s*[:\-]+\s*(\|\s*[:\-]+\s*)*\|?$", line_clean):
            continue

        # Blockquote lines starting with >
        if line.startswith("> "):
            pdf.set_font("Helvetica", "I", 9.5)
            pdf.set_text_color(71, 85, 105)
            quote_text = sanitize_text(line.lstrip("> ").replace("**", "").replace("`", "").strip())
            pdf.multi_cell(0, 5.5, quote_text, new_x="LMARGIN", new_y="NEXT")
            pdf.set_font("Helvetica", "", 10)
            pdf.set_text_color(51, 65, 85)
            continue

        # Headings
        if line.startswith("# "):
            pdf.ln(2)
            pdf.set_font("Helvetica", "B", 14)
            pdf.set_text_color(15, 23, 42)
            pdf.multi_cell(0, 8, line_clean.lstrip("# ").strip(), new_x="LMARGIN", new_y="NEXT")
            pdf.set_font("Helvetica", "", 10)
            pdf.set_text_color(51, 65, 85)
        elif line.startswith("## "):
            pdf.ln(3)
            pdf.set_font("Helvetica", "B", 12)
            pdf.set_text_color(30, 41, 59)
            pdf.multi_cell(0, 7, line_clean.lstrip("## ").strip(), new_x="LMARGIN", new_y="NEXT")
            pdf.set_font("Helvetica", "", 10)
            pdf.set_text_color(51, 65, 85)
        elif line.startswith("### "):
            pdf.ln(2)
            pdf.set_font("Helvetica", "B", 10)
            pdf.set_text_color(30, 41, 59)
            pdf.multi_cell(0, 6, line_clean.lstrip("### ").strip(), new_x="LMARGIN", new_y="NEXT")
            pdf.set_font("Helvetica", "", 10)
            pdf.set_text_color(51, 65, 85)
        elif line.startswith("- ") or line.startswith("* "):
            bullet_text = line_clean[2:].strip() if len(line_clean) > 2 else line_clean
            link_match = re.match(r"^\[(.*?)\]\((.*?)\)$", bullet_text)
            if link_match:
                bullet_text = f"{link_match.group(1)} ({link_match.group(2)})"
            pdf.multi_cell(0, 6, f"  * {bullet_text}", new_x="LMARGIN", new_y="NEXT")
        elif line_clean.startswith("|") and line_clean.endswith("|"):
            cells = [c.strip() for c in line_clean.strip("|").split("|")]
            table_row_str = "  |  ".join(cells)
            is_header = "Claim" in cells or "Audit Result" in cells
            pdf.set_font("Helvetica", "B" if is_header else "", 9.5)
            pdf.set_text_color(15, 23, 42)
            pdf.multi_cell(0, 6, table_row_str, new_x="LMARGIN", new_y="NEXT")
            pdf.set_font("Helvetica", "", 10)
            pdf.set_text_color(51, 65, 85)
        else:
            pdf.multi_cell(0, 6, line_clean, new_x="LMARGIN", new_y="NEXT")
            
    # Output byte string
    return bytes(pdf.output())

def export_to_json(topic, report_data):
    """Formats report payload as pretty-printed JSON string."""
    payload = {
        "metadata": {
            "application": "AgenticIQ",
            "version": "1.0.0",
            "topic": topic
        },
        "report": report_data
    }
    return json.dumps(payload, indent=2)
