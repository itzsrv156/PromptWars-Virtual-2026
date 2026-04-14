import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';
import { RaceProvider, useRace } from './context/RaceContext';
import TeamSelector from './components/TeamSelector';
import CircuitMap from './components/CircuitMap';
import ScenarioControl from './components/ScenarioControl';
import GateThroughput from './components/GateThroughput';
import GrandstandOccupancy from './components/GrandstandOccupancy';
import SimulatorLeaderboard from './components/SimulatorLeaderboard';
import SystemLogs from './components/SystemLogs';
import AIRadioPanel from './components/AIRadioPanel';
import { applyTheme } from './theme/teamThemes';

function DashboardContent() {
  const { showTeamSelector, setShowTeamSelector, selectedTeam, selectedCircuit, setSelectedCircuit } = useRace();

  useEffect(() => {
    applyTheme(selectedTeam);
  }, [selectedTeam]);

  if (showTeamSelector) {
    return (
      <TeamSelector
        onTeamSelect={() => setShowTeamSelector(false)}
        onCircuitSelect={(circuit) => {
          setSelectedCircuit(circuit);
          setShowTeamSelector(false);
        }}
      />
    );
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-[#0a0a0c] via-black to-[#0a0a0c] text-white overflow-hidden flex flex-col scanline carbon-texture">
      <header className="h-14 border-b border-[var(--color-border)] bg-black/50 backdrop-blur flex items-center justify-between px-6 mb-1">
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
            <Cpu size={20} className="text-[var(--color-glow)]" />
          </motion.div>
          <h1 className="text-2xl font-black tracking-widest uppercase" style={{ fontFamily: 'var(--team-font)' }}>
            STRAT<span className="text-[var(--color-accent)]">X</span> COMMAND
          </h1>
          <div className="hidden lg:flex gap-6 text-xs text-[var(--color-glow)]/60 font-mono border-l border-[var(--color-border)] pl-6">
            <span>{selectedCircuit.toUpperCase()}</span>
            <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }}>
              LIVE
            </motion.span>
          </div>
        </motion.div>

        <motion.button
          onClick={() => setShowTeamSelector(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-glow)] text-black font-bold uppercase tracking-widest text-sm rounded hover:shadow-lg hover:shadow-[var(--color-glow)]/50 transition-all"
        >
          Change Team
        </motion.button>
      </header>

      <div className="flex-1 grid grid-cols-12 gap-2 p-2 overflow-hidden">
        {/* LEFT: GATE THROUGHPUT & SCENARIO */}
        <div className="col-span-3 flex flex-col gap-2 overflow-hidden">
          <motion.div
            className="flex-1 overflow-hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <GateThroughput />
          </motion.div>
          <motion.div
            className="flex-1 overflow-hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ScenarioControl />
          </motion.div>
        </div>

        {/* CENTER TOP: CIRCUIT MAP */}
        <motion.div
          className="col-span-6 row-span-2 overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <CircuitMap />
        </motion.div>

        {/* RIGHT TOP: AI RADIO + LOGS */}
        <motion.div
          className="col-span-3 overflow-hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <AIRadioPanel />
        </motion.div>

        {/* LEFT BOTTOM: GRANDSTANDS */}
        <motion.div
          className="col-span-3 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <GrandstandOccupancy />
        </motion.div>

        {/* RIGHT BOTTOM: SYSTEM LOGS */}
        <motion.div
          className="col-span-3 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <SystemLogs />
        </motion.div>
      </div>

      {/* BOTTOM: SIMULATOR LEADERBOARD */}
      <motion.div
        className="h-32 border-t border-[var(--color-border)] bg-black/30 p-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <SimulatorLeaderboard />
      </motion.div>
    </div>
  );
}

export default function App() {
  return (
    <RaceProvider>
      <DashboardContent />
    </RaceProvider>
  );
}