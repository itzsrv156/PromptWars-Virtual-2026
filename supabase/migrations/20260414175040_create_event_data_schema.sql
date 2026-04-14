/*
  # Event Telemetry and Fan Zone Management Schema

  1. New Tables
    - `gate_telemetry`: Real-time gate scan throughput tracking
    - `grandstand_occupancy`: Live occupancy percentages and bottleneck flags
    - `scenario_events`: Triggered scenarios (Safety Car, Rain, VSC, etc.)
    - `ai_commands`: AI-generated JSON commands and responses
    - `simulator_queue`: F1 25 simulator queue telemetry
    - `session_config`: Circuit and team selection state

  2. Security
    - Enable RLS on all tables
    - Allow public read access for live dashboards
    - Restrict write operations to authenticated or backend functions

  3. Features
    - Real-time data with timestamps
    - Scenario history for debrief analysis
    - AI command audit trail
    - Session persistence across reconnects
*/

CREATE TABLE IF NOT EXISTS session_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  circuit_name text DEFAULT 'Silverstone',
  selected_team text DEFAULT 'Red Bull Racing',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS gate_telemetry (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gate_id text NOT NULL,
  scans_per_minute integer DEFAULT 0,
  capacity_percent integer DEFAULT 0,
  status text DEFAULT 'normal',
  bottleneck_flag boolean DEFAULT false,
  last_reading timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS grandstand_occupancy (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grandstand_name text NOT NULL UNIQUE,
  occupancy_percent integer DEFAULT 0,
  capacity_flag boolean DEFAULT false,
  is_covered boolean DEFAULT false,
  status text DEFAULT 'clear',
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS scenario_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_type text NOT NULL,
  crowd_gravity_multiplier numeric DEFAULT 1.0,
  affected_zones text[] DEFAULT ARRAY[]::text[],
  ai_response_id uuid,
  triggered_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_commands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id uuid REFERENCES scenario_events(id),
  alert_type text NOT NULL,
  gate_target text,
  color_override text,
  radio_message text NOT NULL,
  redirect_recommendation text,
  confidence numeric DEFAULT 0.95,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS simulator_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  simulator_id integer NOT NULL,
  queue_position integer DEFAULT 0,
  wait_time_minutes integer DEFAULT 0,
  status text DEFAULT 'available',
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE session_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE gate_telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE grandstand_occupancy ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenario_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_commands ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulator_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on session_config"
  ON session_config FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read on gate_telemetry"
  ON gate_telemetry FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read on grandstand_occupancy"
  ON grandstand_occupancy FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read on scenario_events"
  ON scenario_events FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read on ai_commands"
  ON ai_commands FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read on simulator_queue"
  ON simulator_queue FOR SELECT
  TO anon, authenticated
  USING (true);

INSERT INTO grandstand_occupancy (grandstand_name, occupancy_percent, is_covered, status)
VALUES
  ('Abbey', 65, false, 'moderate'),
  ('Luffield', 45, true, 'clear'),
  ('Stowe', 78, false, 'busy'),
  ('Copse', 82, true, 'busy'),
  ('Maggotts', 55, false, 'moderate'),
  ('Becketts', 40, true, 'clear')
ON CONFLICT DO NOTHING;

INSERT INTO simulator_queue (simulator_id, queue_position, wait_time_minutes, status)
VALUES
  (1, 5, 45, 'active'),
  (2, 3, 25, 'active'),
  (3, 7, 55, 'active'),
  (4, 2, 15, 'active'),
  (5, 6, 50, 'active')
ON CONFLICT DO NOTHING;
