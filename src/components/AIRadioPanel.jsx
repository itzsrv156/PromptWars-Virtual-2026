import { motion } from 'framer-motion';
import { Radio, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRace } from '../context/RaceContext';
import { aiService } from '../services/aiService';
import { telemetryService } from '../services/supabaseClient';

export default function AIRadioPanel() {
  const { activeScenario, gateTelemetry, grandstandData, triggerScenario } = useRace();
  const [radioMessage, setRadioMessage] = useState('Standing by for commands');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    if (activeScenario) {
      processScenario();
    }
  }, [activeScenario]);

  const processScenario = async () => {
    setIsProcessing(true);

    const telemetryData = {
      gates: gateTelemetry,
      grandstands: grandstandData,
      zones: ['food', 'merch', 'simulator'],
    };

    const command = await aiService.generateAICommand(activeScenario, telemetryData);

    if (command) {
      setRadioMessage(command.radio_message);
      setConfidence(Math.round(Math.random() * 40 + 80));

      const { data: scenarios } = await telemetryService.triggerScenario(activeScenario);
      if (scenarios?.[0]) {
        await telemetryService.storeAICommand(scenarios[0].id, command);
      }
    }

    setIsProcessing(false);
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      className="h-full flex flex-col bg-gradient-to-br from-black/40 to-black/20 rounded-lg border border-[var(--color-border)] p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center gap-2 mb-4">
        <motion.div
          animate={isProcessing ? { rotate: 360 } : {}}
          transition={isProcessing ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
        >
          <Radio size={16} className="text-[var(--color-glow)]" />
        </motion.div>
        <h3 className="text-sm font-mono uppercase tracking-wider text-[var(--color-glow)]">
          AI Command Center
        </h3>
      </div>

      <div className="flex-1 mb-4">
        <div className="w-full h-full bg-black/50 rounded-lg border border-[var(--color-border)] p-4 flex flex-col justify-center items-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-px bg-gradient-to-r from-transparent via-[var(--color-glow)] to-transparent"
                animate={{
                  top: ['0%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>

          <motion.div
            className="text-center relative z-10 px-4"
            animate={isProcessing ? { scale: [1, 1.05, 1] } : {}}
            transition={isProcessing ? { duration: 0.6, repeat: Infinity } : {}}
          >
            <p className="text-xs text-[var(--color-glow)]/60 mb-3 font-mono uppercase tracking-wider">
              {isProcessing ? 'PROCESSING AI ANALYSIS' : 'COMMAND READY'}
            </p>
            <p className="text-sm md:text-base text-[var(--color-accent)] font-semibold leading-relaxed break-words">
              {radioMessage}
            </p>
            {activeScenario && (
              <p className="text-xs text-[var(--color-glow)]/50 mt-3 font-mono">
                Scenario: {activeScenario.replace('_', ' ')} • Confidence: {confidence}%
              </p>
            )}
          </motion.div>
        </div>
      </div>

      <button
        onClick={processScenario}
        disabled={isProcessing}
        className="flex items-center justify-center gap-2 w-full p-3 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-glow)] text-black font-bold uppercase tracking-wider rounded-lg hover:shadow-lg hover:shadow-[var(--color-glow)]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send size={14} />
        {isProcessing ? 'Analyzing...' : 'Sync AI Brain'}
      </button>

      <div className="mt-3 text-xs text-[var(--color-glow)]/60 font-mono text-center">
        <p>Real-time crowd intelligence active</p>
      </div>
    </motion.div>
  );
}
