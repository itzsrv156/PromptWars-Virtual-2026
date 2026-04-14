import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { telemetryService } from '../services/supabaseClient';

export default function SystemLogs() {
  const [logs, setLogs] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const logsEndRef = useRef(null);

  useEffect(() => {
    loadCommandHistory();
    const interval = setInterval(loadCommandHistory, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadCommandHistory = async () => {
    const { data } = await telemetryService.getAICommandHistory(15);
    if (data) {
      const formattedLogs = data.map((cmd) => ({
        id: cmd.id,
        timestamp: new Date(cmd.created_at).toLocaleTimeString(),
        message: cmd.radio_message,
        type: cmd.alert_type,
        confidence: Math.round(cmd.confidence * 100),
      }));
      setCommandHistory(formattedLogs);
      setLogs(formattedLogs);
    }
  };

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getLogColor = (type) => {
    switch (type) {
      case 'SAFETY_CAR':
        return 'text-yellow-400';
      case 'RAIN':
        return 'text-blue-400';
      case 'RED_FLAG':
        return 'text-red-500';
      case 'VSC':
        return 'text-orange-400';
      default:
        return 'text-green-400';
    }
  };

  return (
    <div className="h-full flex flex-col bg-black/20 rounded-lg border border-[var(--color-border)] p-4 font-mono">
      <h3 className="text-sm font-mono uppercase tracking-wider text-[var(--color-glow)] mb-4">
        System Radio Log
      </h3>

      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {logs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[var(--color-glow)]/40 text-xs">
            <p>Awaiting AI commands...</p>
          </div>
        ) : (
          logs.map((log, idx) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="p-2 bg-black/40 rounded border border-[var(--color-border)]/30 text-xs leading-relaxed"
            >
              <div className="flex gap-2">
                <span className="text-[var(--color-glow)]/60 flex-shrink-0">{log.timestamp}</span>
                <span className={`flex-shrink-0 font-bold uppercase ${getLogColor(log.type)}`}>
                  [{log.type}]
                </span>
                <span className="text-[var(--color-glow)] flex-1 break-words">{log.message}</span>
                <span className="text-[var(--color-accent)]/60 flex-shrink-0">{log.confidence}%</span>
              </div>
            </motion.div>
          ))
        )}
        <div ref={logsEndRef} />
      </div>

      <div className="pt-3 border-t border-[var(--color-border)] text-xs text-[var(--color-glow)]/60 space-y-1">
        <p>Total Commands: {logs.length}</p>
        <p>Last Update: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
}
