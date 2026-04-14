import { motion } from 'framer-motion';

export default function TelemetryPanel({ label, value, percent }) {
    return (
        <div className="bg-[#0a0a0c] border-l-2 border-red-600 p-4 mb-2 hover:bg-white/[0.02] transition-all">
            <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">{label}</span>
                <span className="text-lg font-black italic tracking-tighter">{value}</span>
            </div>
            <div className="h-1 w-full bg-gray-900 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    className={`h-full ${percent > 80 ? 'bg-red-600' : 'bg-blue-500'}`}
                />
            </div>
        </div>
    );
}