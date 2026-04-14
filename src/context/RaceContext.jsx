import { createContext, useContext, useState, useEffect } from 'react';
import { telemetryService } from '../services/supabaseClient';

const RaceContext = createContext();

export function RaceProvider({ children }) {
  const [selectedTeam, setSelectedTeam] = useState('Red Bull Racing');
  const [selectedCircuit, setSelectedCircuit] = useState('Silverstone Grand Prix');
  const [gateTelemetry, setGateTelemetry] = useState([]);
  const [grandstandData, setGrandstandData] = useState([]);
  const [simulatorQueue, setSimulatorQueue] = useState([]);
  const [activeScenario, setActiveScenario] = useState(null);
  const [showTeamSelector, setShowTeamSelector] = useState(true);

  useEffect(() => {
    if (!showTeamSelector) {
      loadInitialData();
      const interval = setInterval(loadInitialData, 3000);
      return () => clearInterval(interval);
    }
  }, [showTeamSelector, selectedCircuit]);

  const loadInitialData = async () => {
    const [{ data: gates }, { data: grandstands }, { data: sims }] = await Promise.all([
      telemetryService.getGateTelemetry(),
      telemetryService.getGrandstandOccupancy(),
      telemetryService.getSimulatorQueue(),
    ]);

    if (gates) setGateTelemetry(gates);
    if (grandstands) setGrandstandData(grandstands);
    if (sims) setSimulatorQueue(sims);
  };

  const updateGate = async (gateId, scansPerMinute) => {
    await telemetryService.updateGateTelemetry(gateId, scansPerMinute);
    await loadInitialData();
  };

  const updateGrandstand = async (name, occupancy) => {
    await telemetryService.updateGrandstandOccupancy(name, occupancy);
    await loadInitialData();
  };

  const triggerScenario = async (scenarioType) => {
    const { data } = await telemetryService.triggerScenario(scenarioType, [
      'food',
      'merch',
      'simulator',
    ]);
    setActiveScenario(scenarioType);
    return data;
  };

  return (
    <RaceContext.Provider
      value={{
        selectedTeam,
        setSelectedTeam,
        selectedCircuit,
        setSelectedCircuit,
        gateTelemetry,
        grandstandData,
        simulatorQueue,
        activeScenario,
        setActiveScenario,
        updateGate,
        updateGrandstand,
        triggerScenario,
        showTeamSelector,
        setShowTeamSelector,
      }}
    >
      {children}
    </RaceContext.Provider>
  );
}

export function useRace() {
  const context = useContext(RaceContext);
  if (!context) {
    throw new Error('useRace must be used within RaceProvider');
  }
  return context;
}
