import { motion } from 'framer-motion';
import { TriangleAlert as AlertTriangle, Cloud } from 'lucide-react';
import { useRace } from '../context/RaceContext';
import { useEffect, useState } from 'react';

export default function GrandstandOccupancy() {
  const { grandstandData, updateGrandstand } = useRace();
  const [displayData, setDisplayData] = useState([]);

  useEffect(() => {
    setDisplayData(grandstandData);
  }, [grandstandData]);

  const handleOccupancyChange = (name, value) => {
    updateGrandstand(name, Math.min(100, Math.max(0, value)));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="h-full flex flex-col bg-black/20 rounded-lg border border-[var(--color-border)] p-4">
      <h3 className="text-sm font-mono uppercase tracking-wider text-[var(--color-glow)] mb-4">
        Grandstand Occupancy Map
      </h3>

      <motion.div
        className="space-y-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {displayData.map((stand) => (
          <motion.div
            key={stand.id}
            variants={itemVariants}
            className={`p-3 rounded-lg border transition-all ${
              stand.capacity_flag ? 'border-red-500/50 bg-red-500/10' : 'border-[var(--color-border)] bg-black/30'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-white">{stand.grandstand_name}</p>
                {stand.is_covered && (
                  <Cloud size={12} className="text-[var(--color-glow)]" />
                )}
              </div>
              <span className="text-xs font-mono text-[var(--color-accent)]">
                {stand.occupancy_percent}%
              </span>
            </div>

            <div className="relative h-3 bg-black/50 rounded-full overflow-hidden border border-[var(--color-border)] mb-2">
              <motion.div
                className={`h-full ${
                  stand.occupancy_percent >= 90
                    ? 'bg-gradient-to-r from-red-600 to-red-500'
                    : stand.occupancy_percent >= 70
                    ? 'bg-gradient-to-r from-yellow-600 to-yellow-500'
                    : 'bg-gradient-to-r from-green-600 to-green-500'
                }`}
                animate={{ width: `${stand.occupancy_percent}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-[var(--color-glow)]/60">{stand.status.toUpperCase()}</p>
              <div className="flex items-center gap-2">
                {stand.capacity_flag && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <AlertTriangle size={12} className="text-red-500" />
                  </motion.div>
                )}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={stand.occupancy_percent}
                  onChange={(e) => handleOccupancyChange(stand.grandstand_name, parseInt(e.target.value))}
                  className="w-24 h-1 bg-black/50 rounded-lg appearance-none cursor-pointer accent-[var(--color-accent)]"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-4 pt-4 border-t border-[var(--color-border)] text-xs text-[var(--color-glow)]/60 font-mono space-y-1">
        <p>Critical: {displayData.filter((s) => s.capacity_flag).length} zones at capacity</p>
        <p>Covered zones: {displayData.filter((s) => s.is_covered).length} available</p>
      </div>
    </div>
  );
}
