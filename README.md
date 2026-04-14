# TracksideFlow AI - F1 Fan Zone Assistant
**PromptWars: Virtual 2026 | Vertical: Physical Event Experience**

A smart, dynamic assistant for physical events built with Gemini 1.5 Flash, React, and Google Cloud Run. Optimized for real-time attendee support and navigation within large-scale sporting venues.

## 🏎️ Overview
TracksideFlow AI is a unique 'Race Steward Assistant' designed to optimize the fan experience at Formula 1 Grand Prix Fan Zones. Unlike generic event bots, it focuses on real-time "Load Balancing" for attendees—directing fans away from congested areas like simulator lines and towards faster-moving activities.

## 🧠 Logic & Approach
- **Context-Aware Reasoning:** Uses Gemini 1.5 Flash to analyze a live `fan_zone_data.json` feed.
- **Dynamic Recommendations:** Prioritizes 'Clear' or 'Fast' status zones (e.g., merch stores or shuttle buses) when fans ask for activity suggestions.
- **Vibe Coding Workflow:** Developed using Google Antigravity to maintain a lightweight (under 1MB) but high-performance React codebase.

## 🛠️ Tech Stack
- **AI Model:** Gemini 1.5 Flash
- **Frontend:** React + Tailwind CSS (F1 Dashboard Theme)
- **IDE:** Google Antigravity
- **Deployment:** Google Cloud Run

## 📂 Project Structure
- `src/`: Core React components and AI logic.
- `fan_zone_data.json`: Mock real-time data for the event circuit.
- `Dockerfile`: Configuration for Google Cloud deployment.

---
*Developed for the Google Build with AI 2026 Challenge.*