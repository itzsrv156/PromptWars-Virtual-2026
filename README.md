# STRATX COMMAND - F1 Paddock Pulse
**PromptWars: Championship Edition | Next-Gen Race Control System**

An AI-powered, real-time digital twin for F1 Grand Prix crowd management and fan zone logistics. Features team-based theme injection, interactive circuit topology, scenario-driven AI commands, and live telemetry analytics.

## Overview

STRATX COMMAND is a competition-grade race control dashboard built for managing 10,000+ competitive entries at PromptWars. It combines:

- **Live Crowd Intelligence:** Real-time gate throughput monitoring and grandstand occupancy tracking
- **Scenario-Driven AI:** Gemini-powered commands triggered by Safety Car, Rain, Red Flags, and VSC events
- **Team Theme Engine:** Dynamic CSS variable injection for 6 F1 teams with custom color palettes and fonts
- **Interactive Circuit Maps:** SVG-based lap visualization for Silverstone, Monaco, Monza, and Spa
- **Persistent Data Layer:** Supabase integration for session history, AI decision trails, and scenario replay

## Architecture

### Core Systems

1. **Team Theme System** (`src/theme/teamThemes.js`)
   - 6 F1 teams with unique color schemes (Red Bull, Ferrari, Mercedes, McLaren, Alpine, Aston Martin)
   - CSS custom property injection via `applyTheme()` for seamless UI transitions
   - Orbitron font for championship-grade headings

2. **Global Race Context** (`src/context/RaceContext.jsx`)
   - Centralized state for selected team, circuit, gate telemetry, grandstand data
   - Automatic data refresh every 3 seconds from Supabase
   - Context hooks for all child components

3. **Supabase Database Schema**
   - `session_config`: Team and circuit selection persistence
   - `gate_telemetry`: Live scan rates and bottleneck detection
   - `grandstand_occupancy`: Occupancy percentages with capacity flags
   - `scenario_events`: Triggered scenarios with crowd multipliers
   - `ai_commands`: Audit trail of all AI-generated commands
   - `simulator_queue`: F1 25 simulator queue telemetry with wait times

4. **AI Service Layer** (`src/services/aiService.js`)
   - Gemini 1.5 Flash integration for scenario analysis
   - JSON command generation with fields: `alert_type`, `gate_target`, `color_override`, `radio_message`, `redirect_recommendation`
   - Throughput analysis and bottleneck recommendations
   - Graceful fallback for API errors

### Components

| Component | Purpose |
|-----------|---------|
| `TeamSelector` | Full-screen onboarding: team + circuit selection |
| `CircuitMap` | Interactive SVG with real-time gate status + sector highlighting |
| `ScenarioControl` | 4-button panel: Safety Car, Rain, Red Flag, VSC triggers |
| `GateThroughput` | Bar charts + live capacity bars for all gates |
| `GrandstandOccupancy` | Occupancy sliders + capacity flags + "covered zone" indicators |
| `SimulatorLeaderboard` | Queue position rankings with animated wait times |
| `AIRadioPanel` | "Sync AI Brain" button + real-time command display + confidence score |
| `SystemLogs` | Auto-scrolling terminal log of all radio transmissions |

## Features

### Crowd Gravity Engine

When a **Safety Car** is triggered:
- Crowd multiplier increases to 1.4x
- Food and Merch zones see simulated +40% surge
- AI generates strategic redirections
- Gates are flagged if scans exceed 30/min

### Live Telemetry

- **Gate Throughput:** Bar chart + simulated scan rates (5-40/min)
- **Grandstand Occupancy:** Slider controls for manual demo input
- **Simulator Queue:** Live leaderboard with queue positions and wait time predictions
- **Status Indicators:** Color coding (green=normal, amber=busy, red=critical)

### Interactive Circuit Maps

Select from 4 F1 circuits with unique SVG layouts:
- **Silverstone:** Abbey, Luffield, Stowe, Copse, Maggotts, Becketts
- **Monaco:** Casino, Mirabeau, Portier, Loews, Tabac
- **Monza:** Main, Ascari, Parabolica, Posti, Curva
- **Spa:** Eau Rouge, Les Combes, Pouhon, Campus, Radillion

Gates display real-time status with animated bottleneck alerts.

### AI-Powered Commands

Trigger scenarios to receive Gemini-analyzed JSON responses:
```json
{
  "alert_type": "SAFETY_CAR",
  "gate_target": "Gate A",
  "radio_message": "Redirect excess crowds to Food Court Zone B, activate overflow shuttle routes",
  "redirect_recommendation": "Send fans to covered zones"
}
```

All commands are logged to Supabase for post-event analysis.

### Visual Polish

- **Scanline CRT effect:** Overlaid on entire dashboard for authentic race control aesthetic
- **Carbon texture:** Subtle diagonal pattern on all panels
- **Glow effects:** Dynamic drop-shadow filters with team color propagation
- **Smooth animations:** Framer Motion stagger-load on app startup (HUD assembly effect)
- **Real-time pulsing:** Bottleneck gates flash with 0.6s pulse on the SVG map

## Setup

### Prerequisites

- Node.js 16+
- Supabase account (already provisioned)
- Google Gemini API key (get from [Google AI Studio](https://aistudio.google.com/))

### Installation

```bash
npm install
```

### Environment Variables

Update `.env` with your Gemini API key:

```
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
VITE_GEMINI_API_KEY=<your-gemini-api-key>
```

### Running Locally

```bash
npm run dev
```

Open `http://localhost:5173` and select your team + circuit.

### Building for Production

```bash
npm run build
npm run preview
```

## PromptWars Competition Strategy

This build was engineered to stand out in a 10K-student field by emphasizing:

1. **Unique Concept:** Digital Twin for crowd management (not generic chatbot)
2. **Visual Fidelity:** Championship-grade UI with polished animations
3. **Interactivity:** 6 teams, 4 circuits, 4 scenarios, live simulator rankings
4. **Data Persistence:** Supabase audit trail for scenario replay and analysis
5. **AI Integration:** Gemini-powered strategic recommendations, not just rule-based responses
6. **Scalability:** Modular component architecture ready for additional features

## File Organization

```
src/
├── components/
│   ├── TeamSelector.jsx          (Onboarding splash)
│   ├── CircuitMap.jsx             (Interactive SVG)
│   ├── ScenarioControl.jsx        (4-button trigger panel)
│   ├── GateThroughput.jsx         (Bar charts)
│   ├── GrandstandOccupancy.jsx    (Occupancy sliders)
│   ├── SimulatorLeaderboard.jsx   (Queue rankings)
│   ├── SystemLogs.jsx             (Radio log terminal)
│   ├── AIRadioPanel.jsx           (AI command display)
│   ├── TacticalMap.jsx            (Legacy - kept for reference)
│   └── TelemetryPanel.jsx         (Reusable panel component)
├── context/
│   └── RaceContext.jsx            (Global race state)
├── services/
│   ├── supabaseClient.js          (DB queries + helpers)
│   └── aiService.js               (Gemini API integration)
├── theme/
│   └── teamThemes.js              (Team color schemes)
├── App.jsx                        (Main entry point)
├── main.jsx                       (React root)
└── index.css                      (Global styles + animations)
```

## Gemini Integration

The AI service sends structured prompts and parses JSON responses:

```javascript
await aiService.generateAICommand(scenarioType, telemetryData)
```

Returns command object that is both displayed in the UI and stored in Supabase for audit trail.

## Performance Notes

- Lazy-loads telemetry updates every 3 seconds
- Uses Recharts for efficient chart rendering
- Framer Motion animations are GPU-accelerated
- Tailwind CSS purges unused utilities in production build

## Future Enhancements

- Sound cue system for scenario triggers
- Real-time WebSocket integration for multi-user sync
- Mobile companion app for on-site stewards
- Advanced analytics dashboard for post-event metrics
- AR overlay for physical circuit visualization
- Predictive crowd flow based on race position changes

---

Built with React 18, Tailwind CSS, Framer Motion, Recharts, Supabase, and Gemini 1.5 Flash for PromptWars 2026.