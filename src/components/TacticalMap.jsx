import { motion } from 'framer-motion';

export default function TacticalMap({ activeSectors = [] }) {
    return (
        <div className="relative w-full h-full p-8 flex items-center justify-center bg-[#050507]">
            <svg viewBox="0 0 800 500" className="w-full h-full overflow-visible">
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                {/* Main Track Loop */}
                <path d="M150,350 L100,250 L200,100 L500,80 L700,200 L650,400 L400,450 Z"
                    fill="none" stroke="#1e293b" strokeWidth="30" strokeLinejoin="round" />

                {/* Sector 1 - Abbey */}
                <motion.path d="M150,350 L100,250 L200,100" fill="none"
                    stroke={activeSectors.includes('sector1') ? '#ff0000' : '#334155'}
                    strokeWidth="32" filter="url(#glow)"
                    animate={activeSectors.includes('sector1') ? { opacity: [0.3, 1, 0.3] } : {}}
                    transition={{ repeat: Infinity, duration: 1.5 }} />

                {/* Labels */}
                <text x="50" y="380" fill="#64748b" className="text-[10px] font-mono uppercase tracking-tighter">SEC_01: ABBEY_GATES</text>
                <circle cx="150" cy="350" r="6" fill="#ef4444" className="animate-pulse" />
            </svg>
        </div>
    );
}