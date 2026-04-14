import { motion } from 'framer-motion';
import { Zap, Trophy } from 'lucide-react';
import { useRace } from '../context/RaceContext';

export default function SimulatorLeaderboard() {
  const { simulatorQueue } = useRace();

  const sortedQueue = [...simulatorQueue].sort((a, b) => a.queue_position - b.queue_position);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="h-full flex flex-col bg-black/20 rounded-lg border border-[var(--color-border)] p-4">
      <div className="flex items-center gap-2 mb-4">
        <Trophy size={16} className="text-[var(--color-glow)]" />
        <h3 className="text-sm font-mono uppercase tracking-wider text-[var(--color-glow)]">
          F1 25 Simulator Queue
        </h3>
      </div>

      <motion.div
        className="space-y-2 flex-1"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {sortedQueue.map((sim, index) => (
          <motion.div
            key={sim.id}
            variants={itemVariants}
            whileHover={{ x: 4 }}
            className={`p-3 rounded-lg border transition-all ${
              index === 0
                ? 'border-[var(--color-glow)] bg-gradient-to-r from-[var(--color-accent)]/20 to-transparent'
                : 'border-[var(--color-border)] bg-black/30 hover:bg-black/40'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-[var(--color-accent)]/20 border border-[var(--color-accent)] font-mono text-xs font-bold text-[var(--color-accent)]">
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Simulator {sim.simulator_id}</p>
                  <p className="text-xs text-[var(--color-glow)]/60">Queue Pos: {sim.queue_position}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-right">
                <div>
                  <p className="text-xs text-[var(--color-glow)]/60">WAIT TIME</p>
                  <p className="text-sm font-mono font-bold text-[var(--color-accent)]">
                    {sim.wait_time_minutes} min
                  </p>
                </div>

                <motion.div
                  animate={sim.status === 'active' ? { rotate: 360 } : {}}
                  transition={sim.status === 'active' ? { duration: 2, repeat: Infinity, ease: 'linear' } : {}}
                >
                  <Zap
                    size={16}
                    className={sim.status === 'active' ? 'text-green-400' : 'text-gray-500'}
                  />
                </motion.div>
              </div>
            </div>

            <div className="mt-2 h-1 bg-black/50 rounded-full overflow-hidden border border-[var(--color-border)]">
              <motion.div
                className="h-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-glow)]"
                animate={{ width: `${(index + 1) * 20}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-4 pt-4 border-t border-[var(--color-border)] text-xs text-[var(--color-glow)]/60 font-mono">
        <p>Active: {sortedQueue.filter((s) => s.status === 'active').length} / {sortedQueue.length}</p>
      </div>
    </div>
  );
}
