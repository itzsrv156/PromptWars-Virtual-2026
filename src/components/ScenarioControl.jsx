import { motion } from 'framer-motion';
import { AlertTriangle, CloudRain, Zap, Flag, Pause } from 'lucide-react';
import { useRace } from '../context/RaceContext';
import { telemetryService } from '../services/supabaseClient';

const scenarios = [
  { id: 'SAFETY_CAR', label: 'Safety Car', icon: Flag, color: 'from-yellow-600 to-yellow-500', description: '+40% crowd gravity' },
  { id: 'RAIN', label: 'Rain Start', icon: CloudRain, color: 'from-blue-600 to-blue-500', description: 'Redirect to covered zones' },
  { id: 'RED_FLAG', label: 'Red Flag', icon: AlertTriangle, color: 'from-red-700 to-red-600', description: 'Full evacuation alert' },
  { id: 'VSC', label: 'Virtual SC', icon: Zap, color: 'from-orange-600 to-orange-500', description: 'Moderate crowd response' },
];

export default function ScenarioControl() {
  const { triggerScenario, activeScenario } = useRace();

  const handleScenarioTrigger = async (scenarioType) => {
    const { data } = await triggerScenario(scenarioType);
    if (data) {
      const command = {
        alert_type: scenarioType,
        radio_message: `${scenarioType} SCENARIO ACTIVATED - All zones on standby`,
        redirect_recommendation: 'Redirect to available zones',
      };
      await telemetryService.storeAICommand(data[0]?.id, command);
    }
  };

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
        <Pause size={16} className="text-[var(--color-glow)]" />
        <h3 className="text-sm font-mono uppercase tracking-wider text-[var(--color-glow)]">
          Scenario Control
        </h3>
      </div>

      <motion.div
        className="space-y-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {scenarios.map((scenario) => {
          const Icon = scenario.icon;
          const isActive = activeScenario === scenario.id;

          return (
            <motion.button
              key={scenario.id}
              variants={itemVariants}
              onClick={() => handleScenarioTrigger(scenario.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full p-3 rounded-lg border transition-all relative group ${
                isActive
                  ? `border-[var(--color-glow)] bg-gradient-to-r ${scenario.color} text-black font-bold shadow-lg`
                  : 'border-[var(--color-border)] bg-black/30 hover:bg-black/40 text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={16} />
                <div className="flex-1 text-left">
                  <p className="font-semibold text-sm">{scenario.label}</p>
                  <p className="text-xs opacity-70">{scenario.description}</p>
                </div>
                {isActive && (
                  <motion.div
                    className="w-2 h-2 rounded-full bg-white"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      <div className="mt-6 pt-4 border-t border-[var(--color-border)] text-xs text-[var(--color-glow)]/60 font-mono">
        <p>Crowd multiplier active: {activeScenario === 'SAFETY_CAR' ? '1.4x' : '1.0x'}</p>
      </div>
    </div>
  );
}
