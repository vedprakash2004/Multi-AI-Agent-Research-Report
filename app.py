# pyrefly: ignore [missing-import]
import streamlit as st
from dotenv import load_dotenv
import os

load_dotenv()
import time
import json
import os
import pandas as pd
# pyrefly: ignore [missing-import]
import plotly.express as px

from agentic_iq.presets import PRESET_TOPICS, RESEARCH_DEPTHS, AGENT_SQUAD
from agentic_iq.agents import AgenticIQEngine, DEFAULT_MODEL, calculate_topic_audit_score
from agentic_iq.exports import export_to_pdf, export_to_json
from agentic_iq.history import load_history, save_to_history, delete_from_history

# Page Configuration
st.set_page_config(
    page_title="AgenticIQ — Multi-Agent AI Research Swarm",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Glassmorphic Dark CSS
st.markdown("""
<style>
    /* Global Styles */
    .stApp {
        background-color: #0F172A;
        font-family: 'Inter', sans-serif;
    }
    
    /* Header Gradient Banner */
    .main-header {
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 50%, rgba(6, 182, 212, 0.15) 100%);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        padding: 24px 32px;
        margin-bottom: 24px;
        backdrop-filter: blur(12px);
    }
    
    .brand-title {
        font-size: 2.2rem;
        font-weight: 800;
        background: linear-gradient(90deg, #818CF8, #C084FC, #22D3EE);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin: 0;
    }
    
    .brand-subtitle {
        color: #94A3B8;
        font-size: 1.05rem;
        margin-top: 6px;
    }
    
    /* Metric & Agent Cards */
    .agent-card {
        background: rgba(30, 41, 59, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        padding: 16px;
        transition: all 0.3s ease;
    }
    
    .agent-card:hover {
        border-color: rgba(99, 102, 241, 0.4);
        transform: translateY(-2px);
    }
    
    /* Stat Card */
    .metric-box {
        background: linear-gradient(180deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        padding: 18px;
        text-align: center;
    }
    
    .metric-value {
        font-size: 1.8rem;
        font-weight: 700;
        color: #38BDF8;
    }
    
    .metric-label {
        color: #94A3B8;
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    
    /* Execution Terminal */
    .terminal-box {
        background: #020617;
        border: 1px solid #1E293B;
        border-radius: 10px;
        padding: 14px;
        font-family: 'Fira Code', 'Courier New', monospace;
        color: #38BDF8;
        font-size: 0.88rem;
        height: 180px;
        overflow-y: auto;
    }
    
    /* Tabs styling */
    .stTabs [data-baseweb="tab-list"] {
        gap: 12px;
    }

    .stTabs [data-baseweb="tab"] {
        background-color: rgba(30, 41, 59, 0.5);
        border-radius: 8px;
        color: #94A3B8;
        padding: 8px 16px;
    }

    .stTabs [aria-selected="true"] {
        background-color: #6366F1 !important;
        color: #FFFFFF !important;
    }
</style>
""", unsafe_allow_html=True)

# Session State Initialization
if "current_report" not in st.session_state:
    st.session_state.current_report = None
if "execution_logs" not in st.session_state:
    st.session_state.execution_logs = []
if "is_running" not in st.session_state:
    st.session_state.is_running = False

# Sidebar Controls
with st.sidebar:
    st.image("https://img.icons8.com/isometric/96/bot.png", width=64)
    st.title("⚙️ Swarm Studio")
    st.caption("Configure multi-agent pipeline parameters")
    
    st.subheader("Presets")
    preset_choice = st.selectbox("Load Preset Research Blueprint", ["-- Select Preset --"] + list(PRESET_TOPICS.keys()))
    
    st.markdown("---")
    st.subheader("Agent Settings")
    api_key_input = st.text_input(
        "Anthropic API Key",
        value=os.environ.get("ANTHROPIC_API_KEY", ""),
        type="password",
        help="Get a key at https://console.anthropic.com. Without a key, the app "
             "runs in Demo Mode and will not fabricate research data.",
    )
    model_name = st.text_input("Claude Model", value=DEFAULT_MODEL)
    if api_key_input:
        st.success("🟢 Live AI Mode — agents will call Claude and search the web.")
    else:
        st.warning("🟡 Demo Mode — no API key set. Agents will run but will NOT invent facts or citations.")
    
    st.markdown("---")
    st.subheader("📚 Saved Library")
    history_items = load_history()
    st.write(f"**Saved Reports:** {len(history_items)}")
    if history_items:
        selected_hist = st.selectbox("View Saved Report", [h["topic"] for h in history_items])
        if st.button("📖 Load Selected"):
            for h in history_items:
                if h["topic"] == selected_hist:
                    st.session_state.current_report = h
                    st.success("Loaded from storage library!")

# Main App Header
st.markdown("""
<div class="main-header">
    <div class="brand-title">🤖 AgenticIQ — Autonomous Research Swarm</div>
    <div class="brand-subtitle">Orchestrate 5 specialized AI agents to plan, query, synthesize, audit, and generate executive reports in real-time.</div>
</div>
""", unsafe_allow_html=True)

# Application Tabs
tab_launch, tab_report, tab_agents, tab_history = st.tabs(["🚀 Launchpad", "📊 Active Report", "🤖 Agent Squad Studio", "📁 History & Exports"])

# TAB 1: LAUNCHPAD
with tab_launch:
    col_input, col_config = st.columns([1.6, 1])
    
    with col_input:
        st.subheader("🎯 Research Topic & Scope")
        
        # Populate from preset if selected
        default_topic = ""
        default_domain = "Technology & AI"
        default_depth = "In-Depth Analysis"
        default_tone = "Analytical & Executive"
        
        if preset_choice != "-- Select Preset --":
            preset_data = PRESET_TOPICS[preset_choice]
            default_topic = preset_data["topic"]
            default_domain = preset_data["domain"]
            default_depth = preset_data["depth"]
            default_tone = preset_data["tone"]
        
        topic_input = st.text_area("Research Topic / Central Question", value=default_topic, placeholder="e.g. Impact of Quantum Cryptography on Financial Banking Infrastructure 2026-2030...", height=100)
        
        col_d1, col_d2 = st.columns(2)
        with col_d1:
            domain_input = st.text_input("Target Domain", value=default_domain)
        with col_d2:
            tone_input = st.selectbox("Target Report Tone", ["Analytical & Executive", "Academic & Precise", "Strategic & Data-Driven", "Actionable & Concise"], index=0)

    with col_config:
        st.subheader("⚡ Depth & Pipeline")
        depth_input = st.selectbox("Research Depth Level", list(RESEARCH_DEPTHS.keys()), index=1)
        depth_info = RESEARCH_DEPTHS[depth_input]
        st.info(f"**Depth Profile:** {depth_info['description']}\n\n⏱️ **Est. Execution:** {depth_info['est_time']}")
        
        st.markdown("<br>", unsafe_allow_html=True)
        launch_btn = st.button("🔥 Launch Multi-Agent Swarm", type="primary", use_container_width=True)

    # Execution Animation & Engine Trigger
    if launch_btn:
        if not topic_input.strip():
            st.warning("Please enter a valid research topic or select a preset!")
        else:
            st.session_state.is_running = True
            st.session_state.execution_logs = []
            
            st.markdown("---")
            st.subheader("🔄 Live Multi-Agent Execution Pipeline")
            
            progress_bar = st.progress(0)
            status_text = st.empty()
            terminal_placeholder = st.empty()
            
            engine = AgenticIQEngine(
                topic_input, domain_input, depth_input, tone_input,
                api_key=api_key_input or None, model=model_name,
            )
            
            # Step 1: Planner Agent
            status_text.markdown("### 🎯 Step 1/5: Planner & Orchestrator Agent is analyzing scope...")
            st.session_state.execution_logs.append("[Planner] Initializing topic breakdown and 4-pillar research strategy...")
            terminal_placeholder.markdown(f"<div class='terminal-box'>{'<br>'.join(st.session_state.execution_logs)}</div>", unsafe_allow_html=True)
            plan_data = engine.run_planner()
            progress_bar.progress(20)
            time.sleep(1.2)
            
            # Step 2: Web Miner Agent
            status_text.markdown("### 🔍 Step 2/5: Web Miner & Fact Retriever Agent querying indices...")
            st.session_state.execution_logs.append("[Web Miner] Fetching authoritative evidence, citations, and market metrics...")
            terminal_placeholder.markdown(f"<div class='terminal-box'>{'<br>'.join(st.session_state.execution_logs)}</div>", unsafe_allow_html=True)
            miner_data = engine.run_miner(plan_data["sub_tasks"])
            progress_bar.progress(45)
            time.sleep(1.2)
            
            # Step 3: Deep Synthesizer
            status_text.markdown("### 🧠 Step 3/5: Deep Data Synthesizer constructing quantitative matrices...")
            st.session_state.execution_logs.append("[Synthesizer] Synthesizing data vectors and trajectory growth models...")
            terminal_placeholder.markdown(f"<div class='terminal-box'>{'<br>'.join(st.session_state.execution_logs)}</div>", unsafe_allow_html=True)
            synthesis_data = engine.run_synthesizer(miner_data)
            progress_bar.progress(70)
            time.sleep(1.2)
            
            # Step 4: Fact Checker Agent
            status_text.markdown("### ⚖️ Step 4/5: Fact Checker & Auditor verifying assertions...")
            st.session_state.execution_logs.append("[Fact Checker] Auditing numerical assertions against primary source quotes...")
            terminal_placeholder.markdown(f"<div class='terminal-box'>{'<br>'.join(st.session_state.execution_logs)}</div>", unsafe_allow_html=True)
            audit_data = engine.run_fact_checker(miner_data, synthesis_data)
            progress_bar.progress(88)
            time.sleep(1.0)
            
            # Step 5: Report Architect Agent
            status_text.markdown("### 📝 Step 5/5: Report Architect formatting final markdown report...")
            st.session_state.execution_logs.append("[Architect] Rendering final layout, stat cards, and chart payload...")
            terminal_placeholder.markdown(f"<div class='terminal-box'>{'<br>'.join(st.session_state.execution_logs)}</div>", unsafe_allow_html=True)
            report_markdown = engine.run_architect(plan_data, miner_data, synthesis_data, audit_data)
            progress_bar.progress(100)
            time.sleep(0.8)
            
            # Save report to session and persistent history
            report_payload = {
                "topic": topic_input,
                "domain": domain_input,
                "depth": depth_input,
                "content": report_markdown,
                "audit_score": audit_data["overall_accuracy"],
                "miner_data": miner_data,
                "synthesis_data": synthesis_data,
                "audit_data": audit_data
            }
            st.session_state.current_report = report_payload
            save_to_history(topic_input, domain_input, depth_input, report_markdown, audit_data["overall_accuracy"])
            
            st.session_state.is_running = False
            st.success("🎉 Research Pipeline Completed! Switch to '📊 Active Report' tab to view your report.")

# TAB 2: ACTIVE REPORT VIEWER
with tab_report:
    if st.session_state.current_report is None:
        st.info("👈 No report generated yet! Go to the '🚀 Launchpad' tab and click 'Launch Multi-Agent Swarm'.")
    else:
        report = st.session_state.current_report

        if report.get("miner_data", {}).get("mode") == "live":
            st.success("🟢 This report is grounded in real web sources retrieved for this run.")
        else:
            st.warning(
                "🟡 Demo Mode report — no live sources were retrieved "
                "(missing API key, missing 'ddgs' package, or no internet access). "
                "No facts or citations were invented to fill the gap."
            )

        # Stat cards row
        st.subheader(f"📑 Executive Briefing: {report['topic']}")
        col_m1, col_m2, col_m3, col_m4 = st.columns(4)
        with col_m1:
            score_val = report.get("audit_score")
            score_display = f"{score_val}%" if score_val is not None else f"{calculate_topic_audit_score(report['topic'])}%"
            st.markdown(f"<div class='metric-box'><div class='metric-value'>{score_display}</div><div class='metric-label'>Audited Fact Score</div></div>", unsafe_allow_html=True)
        with col_m2:
            st.markdown(f"<div class='metric-box'><div class='metric-value'>5/5</div><div class='metric-label'>Agents Executed</div></div>", unsafe_allow_html=True)
        with col_m3:
            st.markdown(f"<div class='metric-box'><div class='metric-value'>{report['domain']}</div><div class='metric-label'>Research Domain</div></div>", unsafe_allow_html=True)
        with col_m4:
            st.markdown(f"<div class='metric-box'><div class='metric-value'>{report['depth']}</div><div class='metric-label'>Analysis Depth</div></div>", unsafe_allow_html=True)
            
        st.markdown("<br>", unsafe_allow_html=True)
        
        # Visual Interactive Plotly Graph
        st.subheader("📈 Quantitative Growth Trajectory (Plotly Dynamic Visual)")
        synthesis_data = report.get("synthesis_data", {})
        cdata = synthesis_data.get("chart_data")
        if cdata and any(v for v in cdata.get("market_size_billions", [])):
            df = pd.DataFrame({
                "Year": cdata["years"],
                "Market Size ($B)": cdata["market_size_billions"],
                "Efficiency Index": cdata["efficiency_index"]
            })
            
            fig = px.area(
                df, x="Year", y="Market Size ($B)",
                title="Illustrative Market Trajectory & Efficiency Curve",
                color_discrete_sequence=["#6366F1"],
                markers=True
            )
            fig.update_layout(
                template="plotly_dark",
                paper_bgcolor="rgba(15, 23, 42, 0)",
                plot_bgcolor="rgba(30, 41, 59, 0.5)",
                font=dict(color="#F8FAFC")
            )
            st.plotly_chart(fig, use_container_width=True)
            if synthesis_data.get("disclaimer"):
                st.caption(f"⚠️ {synthesis_data['disclaimer']}")
        else:
            st.info("No chart shown — no live evidence was available to base a trajectory on.")

        # Real sources retrieved for this run
        citations = report.get("miner_data", {}).get("citations", [])
        if citations:
            st.subheader("🔍 Sources Retrieved")
            for c in citations:
                st.markdown(f"- [{c['source']}]({c['url']})")

        st.markdown("---")
        
        # Report Content Display / Editable View
        tab_view, tab_edit = st.tabs(["👁️ Formatted View", "✏️ Live Editor"])
        
        with tab_view:
            st.markdown(report["content"])
            
        with tab_edit:
            edited_content = st.text_area("Edit Report Markdown", value=report["content"], height=450)
            if st.button("💾 Save Edits"):
                st.session_state.current_report["content"] = edited_content
                st.success("Report content updated!")

# TAB 3: AGENT SQUAD STUDIO
with tab_agents:
    st.subheader("🤖 Active Multi-Agent Squad Architecture")
    st.caption("Inspect roles, personas, and system parameters for each agent in the swarm.")
    
    cols = st.columns(3)
    for idx, agent in enumerate(AGENT_SQUAD):
        col = cols[idx % 3]
        with col:
            st.markdown(f"""
            <div class='agent-card'>
                <h4 style='color: {agent["color"]}; margin-bottom: 4px;'>{agent["avatar"]} {agent["name"]}</h4>
                <p style='color: #94A3B8; font-size: 0.88rem;'>{agent["role"]}</p>
                <span style='background: rgba(99,102,241,0.2); color: #818CF8; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem;'>STATUS: ACTIVE</span>
            </div>
            <br>
            """, unsafe_allow_html=True)

# TAB 4: HISTORY & EXPORTS
with tab_history:
    st.subheader("📦 Report Exports & Document Downloads")
    if st.session_state.current_report:
        rep = st.session_state.current_report
        
        col_exp1, col_exp2, col_exp3 = st.columns(3)
        
        # PDF Export
        with col_exp1:
            pdf_bytes = export_to_pdf(rep["topic"], rep["content"], rep["audit_score"])
            st.download_button(
                label="📄 Download PDF Report",
                data=pdf_bytes,
                file_name=f"agentic_iq_report.pdf",
                mime="application/pdf",
                use_container_width=True
            )
            
        # Markdown Export
        with col_exp2:
            st.download_button(
                label="📝 Download Raw Markdown (.md)",
                data=rep["content"],
                file_name="agentic_iq_report.md",
                mime="text/markdown",
                use_container_width=True
            )
            
        # JSON Export
        with col_exp3:
            json_str = export_to_json(rep["topic"], rep)
            st.download_button(
                label="⚙️ Export JSON Schema",
                data=json_str,
                file_name="agentic_iq_report.json",
                mime="application/json",
                use_container_width=True
            )
    else:
        st.info("No active report available to export. Generate a report in the Launchpad tab first.")

    st.markdown("---")
    st.subheader("📚 Saved Local Library")
    saved_history = load_history()
    if not saved_history:
        st.write("No saved reports found in history yet.")
    else:
        for item in saved_history:
            with st.expander(f"📌 {item['topic']} ({item['timestamp']})"):
                st.write(f"**Domain:** {item['domain']} | **Depth:** {item['depth']} | **Fact Score:** {item['audit_score']}%")
                col_h1, col_h2 = st.columns([1, 4])
                with col_h1:
                    if st.button("🗑️ Delete", key=f"del_{item['id']}"):
                        delete_from_history(item['id'])
                        st.rerun()
