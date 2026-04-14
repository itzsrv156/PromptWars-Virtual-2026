import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { teamThemes, circuits, applyTheme } from '../theme/teamThemes';
import { telemetryService } from '../services/supabaseClient';

export default function TeamSelector({ onTeamSelect, onCircuitSelect }) {
  const teamList = Object.keys(teamThemes);
  const circuitList = Object.entries(circuits).map(([key, val]) => ({ key, ...val }));

  const handleTeamSelect = async (team) => {
    applyTheme(team);
    const circuit = circuitList[0];
    await telemetryService.updateSessionConfig(circuit.name, team);
    onTeamSelect(team);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center z-50 p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-glow)] to-[var(--color-accent)] mb-2">
            STRATX COMMAND
          </h1>
          <p className="text-[var(--color-glow)]/80 text-lg tracking-widest">
            F1 PADDOCK PULSE | RACE CONTROL SYSTEM
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-8">
          <p className="text-[var(--color-accent)] text-sm uppercase tracking-wider mb-6">
            Select Your Team
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {teamList.map((team) => (
              <motion.button
                key={team}
                onClick={() => handleTeamSelect(team)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-4 rounded-lg border border-[var(--color-border)] bg-black/30 hover:bg-black/50 transition-all group cursor-pointer"
                style={{
                  '--team-accent': teamThemes[team].glow,
                }}
              >
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[var(--team-accent)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div
                    className="w-8 h-8 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: teamThemes[team].teamColor }}
                  />
                  <p className="text-sm font-semibold text-white group-hover:text-[var(--team-accent)] transition-colors">
                    {team}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-8">
          <p className="text-[var(--color-accent)] text-sm uppercase tracking-wider mb-6">
            Select Circuit
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {circuitList.map((circuit) => (
              <motion.button
                key={circuit.key}
                onClick={() => onCircuitSelect(circuit.name)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-6 rounded-lg border border-[var(--color-border)] bg-black/30 hover:bg-black/50 transition-all text-center group cursor-pointer"
              >
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[var(--color-glow)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <p className="text-xs text-[var(--color-glow)] mb-1 font-mono">
                    {circuit.code}
                  </p>
                  <p className="font-semibold text-white group-hover:text-[var(--color-accent)] transition-colors text-sm">
                    {circuit.name}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex justify-center gap-4 mt-12 pt-8 border-t border-[var(--color-border)]"
        >
          <button
            onClick={() => handleTeamSelect(teamList[0])}
            className="flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-glow)] text-black font-bold uppercase tracking-wider hover:shadow-lg hover:shadow-[var(--color-glow)]/50 transition-all"
          >
            Enter Cockpit
            <ChevronRight size={20} />
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
