import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TriangleAlert as AlertTriangle } from 'lucide-react';
import { useRace } from '../context/RaceContext';
import { useEffect, useState } from 'react';

export default function GateThroughput() {
  const { gateTelemetry, updateGate } = useRace();
  const [animatedData, setAnimatedData] = useState([]);

  useEffect(() => {
    setAnimatedData(
      gateTelemetry.map((g) => ({
        gate: g.gate_id,
        throughput: g.scans_per_minute || 0,
        capacity: g.capacity_percent || 0,
        bottleneck: g.bottleneck_flag,
      }))
    );
  }, [gateTelemetry]);

  const simulateGateScan = (gateId) => {
    const randomScans = Math.floor(Math.random() * 40) + 5;
    updateGate(gateId, randomScans);
  };

  return (
    <div className="h-full flex flex-col bg-black/20 rounded-lg border border-[var(--color-border)] p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-mono uppercase tracking-wider text-[var(--color-glow)]">
          Gate Throughput Analysis
        </h3>
        <button
          onClick={() => gateTelemetry.forEach((g) => simulateGateScan(g.gate_id))}
          className="text-xs px-2 py-1 bg-[var(--color-accent)]/20 border border-[var(--color-accent)] rounded hover:bg-[var(--color-accent)]/30 text-[var(--color-accent)] transition-all"
        >
          Simulate
        </button>
      </div>

      <div className="flex-1 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={animatedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 153, 255, 0.1)" />
            <XAxis dataKey="gate" stroke="rgba(0, 153, 255, 0.5)" />
            <YAxis stroke="rgba(0, 153, 255, 0.5)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(10, 10, 12, 0.9)',
                border: '1px solid rgba(0, 153, 255, 0.3)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'rgba(0, 153, 255, 0.8)' }}
            />
            <Bar dataKey="throughput" fill="rgba(0, 255, 100, 0.6)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {animatedData.map((gate) => (
          <motion.div
            key={gate.gate}
            className={`p-3 rounded-lg border flex items-center justify-between ${
              gate.bottleneck
                ? 'border-red-500/50 bg-red-500/10'
                : 'border-[var(--color-border)] bg-black/30'
            }`}
          >
            <div>
              <p className="text-sm font-semibold text-white">{gate.gate}</p>
              <p className="text-xs text-[var(--color-glow)]/70">
                {gate.throughput} scans/min • {gate.capacity}% capacity
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-black/50 rounded-full overflow-hidden border border-[var(--color-border)]">
                <motion.div
                  className={`h-full ${gate.bottleneck ? 'bg-red-500' : 'bg-green-500'}`}
                  animate={{ width: `${Math.min(100, gate.capacity)}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
              {gate.bottleneck && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <AlertTriangle size={14} className="text-red-500" />
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
