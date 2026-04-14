export const teamThemes = {
  'Red Bull Racing': {
    primary: '#1e3050',
    accent: '#0066ff',
    glow: '#0099ff',
    text: '#ffffff',
    border: 'rgba(0, 153, 255, 0.3)',
    font: 'Orbitron',
    teamColor: '#0066ff',
  },
  'Ferrari': {
    primary: '#dc0000',
    accent: '#ff0000',
    glow: '#ff3333',
    text: '#ffffff',
    border: 'rgba(255, 0, 0, 0.3)',
    font: 'Orbitron',
    teamColor: '#ff0000',
  },
  'Mercedes': {
    primary: '#00a19a',
    accent: '#00d9d9',
    glow: '#00ffff',
    text: '#ffffff',
    border: 'rgba(0, 217, 217, 0.3)',
    font: 'Orbitron',
    teamColor: '#00d9d9',
  },
  'McLaren': {
    primary: '#ff6200',
    accent: '#ff8800',
    glow: '#ffaa00',
    text: '#ffffff',
    border: 'rgba(255, 136, 0, 0.3)',
    font: 'Orbitron',
    teamColor: '#ff8800',
  },
  'Alpine': {
    primary: '#0066ff',
    accent: '#0099ff',
    glow: '#00ccff',
    text: '#ffffff',
    border: 'rgba(0, 153, 255, 0.3)',
    font: 'Orbitron',
    teamColor: '#0099ff',
  },
  'Aston Martin': {
    primary: '#006443',
    accent: '#00ff00',
    glow: '#00ff33',
    text: '#ffffff',
    border: 'rgba(0, 255, 0, 0.3)',
    font: 'Orbitron',
    teamColor: '#00ff00',
  },
};

export const circuits = {
  silverstone: {
    name: 'Silverstone Grand Prix',
    code: 'GB',
    sectors: 3,
    grandstands: ['Abbey', 'Luffield', 'Stowe', 'Copse', 'Maggotts', 'Becketts'],
    gates: ['Gate A', 'Gate B', 'Gate C', 'Gate D'],
  },
  monaco: {
    name: 'Monaco Grand Prix',
    code: 'MC',
    sectors: 3,
    grandstands: ['Casino', 'Mirabeau', 'Portier', 'Loews', 'Tabac'],
    gates: ['Gate 1', 'Gate 2', 'Gate 3'],
  },
  monza: {
    name: 'Monza Italian Grand Prix',
    code: 'IT',
    sectors: 3,
    grandstands: ['Main', 'Ascari', 'Parabolica', 'Posti', 'Curva'],
    gates: ['Gate North', 'Gate South', 'Gate East'],
  },
  spa: {
    name: 'Spa-Francorchamps',
    code: 'BE',
    sectors: 3,
    grandstands: ['Eau Rouge', 'Les Combes', 'Pouhon', 'Campus', 'Radillion'],
    gates: ['Gate A', 'Gate B', 'Gate C'],
  },
};

export const applyTheme = (team) => {
  const theme = teamThemes[team] || teamThemes['Red Bull Racing'];
  const root = document.documentElement;

  root.style.setProperty('--color-primary', theme.primary);
  root.style.setProperty('--color-accent', theme.accent);
  root.style.setProperty('--color-glow', theme.glow);
  root.style.setProperty('--color-text', theme.text);
  root.style.setProperty('--color-border', theme.border);
  root.style.setProperty('--team-font', theme.font);
  root.style.setProperty('--team-color', theme.teamColor);
};
