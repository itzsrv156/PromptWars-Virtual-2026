import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Cpu, Activity, Radio, Terminal, Box, ChevronRight, AlertCircle } from 'lucide-react';
import TacticalMap from './components/TacticalMap';
import TelemetryPanel from './components/TelemetryPanel';
import fanZoneDataRaw from '../fan_zone_data.json';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export default function App() {
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeSectors, setActiveSectors] = useState([]);
  const [logs, setLogs] = useState(["[INIT] PADDOCK_PULSE v5.0.1 Loaded...", "[NET] Uplink established via G-3-Flash"]);

  const pushLog = (msg) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 15));

  const runAdvancedAnalysis = async () => {
    setLoading(true);
    pushLog("CALCULATING STRATEGIC VECTORS...");
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `You are a F1 Logistics AI. Analyze ${JSON.stringify(fanZoneDataRaw)}. Output a JSON object: {"sector": "sector1", "briefing": "Short tactical radio call"}` }] }]
          })
        }
      );
      const data = await response.json();
      const parsed = JSON.parse(data.candidates[0].content.parts[0].text);
      setAiResponse(parsed.briefing);
      setActiveSectors([parsed.sector]);
      pushLog(`ANALYSIS COMPLETE: CRITICAL SURGE IN ${parsed.sector.toUpperCase()}`);
    } catch (e) {
      pushLog("CORE ENGINE ERROR: TIMEOUT");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#050507] text-[#e2e8f0] font-mono overflow-hidden flex flex-col p-1 border-[12px] border-[#0a0a0c]">
      {/* HUD HEADER */}
      <header className="h-14 border border-white/10 bg-black flex items-center justify-between px-6 mb-1">
        <div className="flex items-center gap-4">
          <Cpu className="text-red-600 w-5 h-5 animate-spin-slow" />
          <h1 className="text-2xl font-black italic tracking-tighter uppercase">STRAT<span className="text-red-600">X</span> COMMAND</h1>
          <div className="hidden lg:flex gap-4 text-[9px] text-gray-500 font-bold border-l border-white/10 pl-4">
            <span>GRID: SILVERSTONE</span>
            <span className="text-green-500 animate-pulse">STATUS: LIVE</span>
          </div>
        </div>
        <button
          onClick={runAdvancedAnalysis}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all skew-x-[-15deg]"
        >
          <Zap className="w-3 h-3" /> {loading ? "Computing..." : "Sync AI Brain"}
        </button>
      </header>

      <div className="flex-grow grid grid-cols-12 gap-1 overflow-hidden">
        {/* LEFT: TELEMETRY & LOGS */}
        <div className="col-span-3 flex flex-col gap-1">
          <div className="bg-black border border-white/5 p-4 flex-grow overflow-y-auto">
            <h3 className="text-[10px] text-gray-500 font-black mb-4 flex items-center gap-2 italic uppercase">
              <Activity className="w-3 h-3 text-red-600" /> Sector_Load_Realtime
            </h3>
            <TelemetryPanel label="GATE_ALPHA (ABBEY)" value="82% CAP" percent={82} />
            <TelemetryPanel label="SIM_ZONE_B" value="94% LOAD" percent={94} />
            <TelemetryPanel label="MERCH_SURGE" value="12% FLOW" percent={12} />
          </div>

          <div className="h-1/3 bg-black border border-white/5 p-4 overflow-hidden">
            <h3 className="text-[10px] text-gray-500 font-black mb-2 italic uppercase flex items-center gap-2">
              <Terminal className="w-3 h-3" /> System_Logs
            </h3>
            <div className="text-[8px] space-y-1 opacity-50">
              {logs.map((l, i) => <p key={i} className="truncate">{l}</p>)}
            </div>
          </div>
        </div>

        {/* CENTER: MAP */}
        <main className="col-span-6 bg-black border border-white/5 relative group">
          <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
          <TacticalMap activeSectors={activeSectors} />
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
            <div className="bg-white/5 backdrop-blur-md p-4 border border-white/10 rounded-sm">
              <p className="text-[9px] text-gray-500 font-bold uppercase">Target_Attendance</p>
              <p className="text-2xl font-black italic tracking-tighter">480,000</p>
            </div>
          </div>
        </main>

        {/* RIGHT: AI ANALYSIS */}
        <div className="col-span-3 bg-black border border-white/5 p-6 flex flex-col gap-6">
          <div className="bg-gradient-to-br from-red-600/10 to-transparent border border-red-600/20 p-6 flex-grow rounded-sm">
            <div className="flex items-center gap-3 mb-6">
              <Radio className="w-6 h-6 text-red-600" />
              <h4 className="text-xs font-black uppercase italic">Strategic_Radio</h4>
            </div>
            <div className="text-[11px] font-mono leading-relaxed text-gray-300 italic">
              {aiResponse ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="text-red-600 mb-2 font-black">// RADIO_TRANSMISSION_START</p>
                  {aiResponse}
                </motion.div>
              ) : (
                <p className="opacity-20 uppercase tracking-tighter text-center mt-20 italic">"Awaiting command from Race Director..."</p>
              )}
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 p-4 rounded-sm">
            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-black mb-2 uppercase">
              <ChevronRight className="w-3 h-3 text-red-600" /> Next_Event
            </div>
            <p className="text-xs font-bold">Driver Q&A (Sector 2) - 14:00</p>
          </div>
        </div>
      </div>
    </div>
  );
}