import { telemetryService } from './supabaseClient';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const aiService = {
  async generateAICommand(scenario, telemetryData) {
    try {
      const prompt = `You are an F1 race control AI managing crowd flow and fan safety. Analyze this scenario and provide a JSON response with commands.

Scenario: ${scenario}

Current Telemetry:
- Gates throughput: ${JSON.stringify(telemetryData.gates || [])}
- Grandstand occupancy: ${JSON.stringify(telemetryData.grandstands || [])}
- Active zones: ${telemetryData.zones?.join(', ') || 'all'}

Generate a JSON response with these fields (no markdown, just raw JSON):
{
  "alert_type": "SAFETY_CAR|RAIN|RED_FLAG|VSC|INFO",
  "gate_target": "Gate A|Gate B|null",
  "color_override": "#ff0000|#00ff00|null",
  "radio_message": "Your tactical recommendation for race control",
  "redirect_recommendation": "Send fans to covered zones|Close Gate A|null"
}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return {
          alert_type: 'INFO',
          radio_message: 'Scenario acknowledged, monitoring situation',
          redirect_recommendation: null,
        };
      }

      const command = JSON.parse(jsonMatch[0]);
      return command;
    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        alert_type: 'INFO',
        radio_message: 'System monitoring active - continue with caution',
        redirect_recommendation: null,
      };
    }
  },

  async analyzeGateThroughput(gateData) {
    try {
      const bottlenecks = gateData.filter((g) => g.bottleneck_flag);
      if (bottlenecks.length === 0) return null;

      const prompt = `Analyze F1 gate throughput data and provide strategic recommendations.

Bottleneck Gates: ${JSON.stringify(bottlenecks)}

Provide a JSON response:
{
  "alert_type": "BOTTLENECK_WARNING",
  "affected_gates": ["Gate A", "Gate B"],
  "recommendation": "Open alternate access routes or reduce entry rate",
  "priority": "HIGH|MEDIUM"
}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (error) {
      console.error('Throughput Analysis Error:', error);
      return null;
    }
  },
};
