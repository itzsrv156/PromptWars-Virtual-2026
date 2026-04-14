import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const telemetryService = {
  async getGateTelemetry() {
    const { data, error } = await supabase
      .from('gate_telemetry')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async updateGateTelemetry(gateId, scansPerMinute) {
    const { data, error } = await supabase
      .from('gate_telemetry')
      .upsert(
        {
          gate_id: gateId,
          scans_per_minute: scansPerMinute,
          capacity_percent: Math.min(100, (scansPerMinute / 40) * 100),
          status: scansPerMinute > 30 ? 'bottleneck' : 'normal',
          bottleneck_flag: scansPerMinute > 30,
          last_reading: new Date(),
        },
        { onConflict: 'gate_id' }
      )
      .select();
    return { data, error };
  },

  async getGrandstandOccupancy() {
    const { data, error } = await supabase
      .from('grandstand_occupancy')
      .select('*')
      .order('grandstand_name');
    return { data, error };
  },

  async updateGrandstandOccupancy(grandstandName, occupancyPercent) {
    const { data, error } = await supabase
      .from('grandstand_occupancy')
      .update({
        occupancy_percent: occupancyPercent,
        capacity_flag: occupancyPercent >= 90,
        status: occupancyPercent >= 90 ? 'critical' : occupancyPercent >= 70 ? 'busy' : 'moderate',
        last_updated: new Date(),
      })
      .eq('grandstand_name', grandstandName)
      .select();
    return { data, error };
  },

  async triggerScenario(scenarioType, affectedZones = []) {
    const { data, error } = await supabase
      .from('scenario_events')
      .insert({
        scenario_type: scenarioType,
        crowd_gravity_multiplier: scenarioType === 'SAFETY_CAR' ? 1.4 : 1.0,
        affected_zones: affectedZones,
      })
      .select();
    return { data, error };
  },

  async storeAICommand(scenarioId, command) {
    const { data, error } = await supabase
      .from('ai_commands')
      .insert({
        scenario_id: scenarioId,
        alert_type: command.alert_type || 'info',
        gate_target: command.gate_target || null,
        color_override: command.color_override || null,
        radio_message: command.radio_message,
        redirect_recommendation: command.redirect_recommendation || null,
        confidence: command.confidence || 0.95,
      })
      .select();
    return { data, error };
  },

  async getAICommandHistory(limit = 10) {
    const { data, error } = await supabase
      .from('ai_commands')
      .select('*, scenario_events(*)')
      .order('created_at', { ascending: false })
      .limit(limit);
    return { data, error };
  },

  async getSessionConfig() {
    const { data, error } = await supabase
      .from('session_config')
      .select('*')
      .maybeSingle();
    return { data, error };
  },

  async updateSessionConfig(circuit, team) {
    const { data: existing } = await this.getSessionConfig();
    if (existing) {
      const { data, error } = await supabase
        .from('session_config')
        .update({ circuit_name: circuit, selected_team: team, updated_at: new Date() })
        .eq('id', existing.id)
        .select();
      return { data, error };
    } else {
      const { data, error } = await supabase
        .from('session_config')
        .insert({ circuit_name: circuit, selected_team: team })
        .select();
      return { data, error };
    }
  },

  async getSimulatorQueue() {
    const { data, error } = await supabase
      .from('simulator_queue')
      .select('*')
      .order('simulator_id');
    return { data, error };
  },

  async updateSimulatorQueue(simulatorId, queuePosition, waitTime) {
    const { data, error } = await supabase
      .from('simulator_queue')
      .update({
        queue_position: queuePosition,
        wait_time_minutes: waitTime,
        last_updated: new Date(),
      })
      .eq('simulator_id', simulatorId)
      .select();
    return { data, error };
  },
};
