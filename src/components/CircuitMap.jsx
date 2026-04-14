import { motion } from 'framer-motion';
import { useRace } from '../context/RaceContext';

const circuitMaps = {
  'Silverstone Grand Prix': {
    width: 800,
    height: 600,
    sectors: [
      { id: 'S1', name: 'Sector 1', x: 150, y: 200 },
      { id: 'S2', name: 'Sector 2', x: 500, y: 150 },
      { id: 'S3', name: 'Sector 3', x: 650, y: 400 },
    ],
    gates: [
      { id: 'A', name: 'Gate A', x: 100, y: 300 },
      { id: 'B', name: 'Gate B', x: 400, y: 100 },
      { id: 'C', name: 'Gate C', x: 700, y: 250 },
      { id: 'D', name: 'Gate D', x: 600, y: 500 },
    ],
    path: 'M 100 300 Q 150 200 200 150 Q 300 100 400 100 Q 500 120 550 200 Q 600 300 650 350 Q 700 400 700 500 Q 600 550 400 550 Q 200 550 100 450 Z',
  },
  'Monaco Grand Prix': {
    width: 800,
    height: 600,
    sectors: [
      { id: 'S1', name: 'Casino', x: 150, y: 200 },
      { id: 'S2', name: 'Mirabeau', x: 500, y: 150 },
      { id: 'S3', name: 'Portier', x: 650, y: 400 },
    ],
    gates: [
      { id: '1', name: 'Gate 1', x: 100, y: 300 },
      { id: '2', name: 'Gate 2', x: 500, y: 100 },
      { id: '3', name: 'Gate 3', x: 700, y: 350 },
    ],
    path: 'M 100 300 L 150 250 Q 200 200 250 150 Q 350 100 450 100 Q 550 110 600 180 Q 650 250 680 350 Q 700 450 650 500 Q 500 550 300 550 Q 150 550 100 450 Z',
  },
  'Monza Italian Grand Prix': {
    width: 800,
    height: 600,
    sectors: [
      { id: 'S1', name: 'Main', x: 200, y: 200 },
      { id: 'S2', name: 'Ascari', x: 600, y: 200 },
      { id: 'S3', name: 'Parabolica', x: 700, y: 400 },
    ],
    gates: [
      { id: 'N', name: 'Gate North', x: 100, y: 150 },
      { id: 'S', name: 'Gate South', x: 100, y: 500 },
      { id: 'E', name: 'Gate East', x: 750, y: 300 },
    ],
    path: 'M 100 200 L 200 150 L 400 120 L 600 130 L 700 200 L 720 400 L 650 520 L 300 550 L 100 450 Z',
  },
  'Spa-Francorchamps': {
    width: 800,
    height: 600,
    sectors: [
      { id: 'S1', name: 'Eau Rouge', x: 200, y: 150 },
      { id: 'S2', name: 'Les Combes', x: 550, y: 250 },
      { id: 'S3', name: 'Pouhon', x: 650, y: 450 },
    ],
    gates: [
      { id: 'A', name: 'Gate A', x: 100, y: 250 },
      { id: 'B', name: 'Gate B', x: 450, y: 100 },
      { id: 'C', name: 'Gate C', x: 750, y: 400 },
    ],
    path: 'M 100 250 Q 150 180 200 130 Q 300 80 450 90 Q 550 100 600 200 Q 650 350 680 450 Q 700 500 600 540 Q 400 560 200 520 Q 120 500 100 350 Z',
  },
};

export default function CircuitMap() {
  const { selectedCircuit, gateTelemetry } = useRace();
  const circuit = circuitMaps[selectedCircuit] || circuitMaps['Silverstone Grand Prix'];

  const getGateStatus = (gateId) => {
    const gate = gateTelemetry.find((g) => g.gate_id === gateId);
    if (!gate) return { status: 'normal', color: '#00ff00' };
    if (gate.bottleneck_flag) return { status: 'bottleneck', color: '#ff3333' };
    if (gate.status === 'busy') return { status: 'busy', color: '#ffaa00' };
    return { status: 'normal', color: '#00ff00' };
  };

  return (
    <div className="h-full flex flex-col bg-black/20 rounded-lg border border-[var(--color-border)] p-4">
      <h3 className="text-sm font-mono uppercase tracking-wider text-[var(--color-glow)] mb-4">
        Live Circuit Topology
      </h3>

      <svg
        viewBox={`0 0 ${circuit.width} ${circuit.height}`}
        className="w-full h-full max-h-96"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(0, 153, 255, 0.3)" />
            <stop offset="100%" stopColor="rgba(0, 51, 102, 0.2)" />
          </linearGradient>
        </defs>

        <path
          d={circuit.path}
          fill="url(#trackGradient)"
          stroke="rgba(0, 153, 255, 0.5)"
          strokeWidth="2"
          filter="url(#glow)"
        />

        {circuit.sectors.map((sector) => (
          <g key={sector.id}>
            <circle cx={sector.x} cy={sector.y} r="30" fill="rgba(0, 255, 100, 0.1)" stroke="rgba(0, 255, 100, 0.5)" strokeWidth="2" />
            <text x={sector.x} y={sector.y} textAnchor="middle" dy="0.3em" fill="rgba(0, 255, 100, 0.8)" fontSize="12" fontWeight="bold" fontFamily="monospace">
              {sector.id}
            </text>
          </g>
        ))}

        {circuit.gates.map((gate) => {
          const status = getGateStatus(gate.id);
          return (
            <motion.g
              key={gate.id}
              animate={status.status === 'bottleneck' ? { opacity: [1, 0.5, 1] } : {}}
              transition={status.status === 'bottleneck' ? { duration: 0.6, repeat: Infinity } : {}}
            >
              <rect x={gate.x - 15} y={gate.y - 15} width="30" height="30" fill={status.color} opacity="0.3" rx="4" />
              <rect
                x={gate.x - 15}
                y={gate.y - 15}
                width="30"
                height="30"
                fill="none"
                stroke={status.color}
                strokeWidth="2"
                rx="4"
              />
              <text
                x={gate.x}
                y={gate.y}
                textAnchor="middle"
                dy="0.3em"
                fill={status.color}
                fontSize="11"
                fontWeight="bold"
                fontFamily="monospace"
              >
                {gate.id}
              </text>
            </motion.g>
          );
        })}
      </svg>

      <div className="mt-4 grid grid-cols-4 gap-2 text-xs">
        {circuit.gates.map((gate) => {
          const status = getGateStatus(gate.id);
          return (
            <div key={gate.id} className="flex items-center gap-1 p-2 bg-black/30 rounded border border-[var(--color-border)]">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: status.color }}
              />
              <span className="text-[var(--color-glow)] font-mono">{gate.id}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
