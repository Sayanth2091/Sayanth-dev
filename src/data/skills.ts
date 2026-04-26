export interface Skill {
  id: string;
  name: string;
  category: 'defense' | 'offense' | 'engineering' | 'creative';
  description: string;
  position: [number, number, number];
  connections: string[];
}

export const skills: Skill[] = [
  // DEFENSE — clustered upper-left
  { id: 'soc',       name: 'SOC monitoring',       category: 'defense',     description: 'Two years of alerts. Patterns become instinct.',               position: [-3,   2,    0   ], connections: ['siem', 'mitre', 'ir'] },
  { id: 'siem',      name: 'SIEM analysis',         category: 'defense',     description: 'AlienVault USM. ELK. Search until the noise speaks.',          position: [-2.2, 2.6,  0.5 ], connections: ['soc', 'detection'] },
  { id: 'mitre',     name: 'MITRE ATT&CK',          category: 'defense',     description: 'A framework for naming what you see.',                         position: [-3.5, 1.2, -0.3 ], connections: ['soc', 'threat'] },
  { id: 'ir',        name: 'incident response',     category: 'defense',     description: 'Containment first. Forensics second.',                         position: [-2.5, 1.6,  0.8 ], connections: ['soc', 'forensics'] },
  { id: 'detection', name: 'detection engineering', category: 'defense',     description: 'Write the rule. Tune the rule. Trust the rule.',               position: [-1.8, 2.2, -0.4 ], connections: ['siem', 'soc'] },
  { id: 'forensics', name: 'forensics',             category: 'defense',     description: 'What happened. When. To whom.',                                position: [-3.2, 0.8,  0.6 ], connections: ['ir', 'mitre'] },
  { id: 'threat',    name: 'threat hunting',        category: 'defense',     description: 'Assume breach. Look for ghosts.',                              position: [-2.8, 0.4, -0.8 ], connections: ['mitre', 'detection'] },

  // OFFENSE — clustered upper-right
  { id: 'pentest',   name: 'penetration testing',  category: 'offense',     description: 'Validating defense by violating it.',                          position: [3,    2,    0   ], connections: ['recon', 'exploit'] },
  { id: 'recon',     name: 'reconnaissance',        category: 'offense',     description: 'Most attacks succeed before they begin.',                      position: [2.4,  2.8, -0.4 ], connections: ['pentest'] },
  { id: 'exploit',   name: 'exploitation',          category: 'offense',     description: 'A known vulnerability is not a vulnerability for long.',       position: [3.5,  1.4,  0.5 ], connections: ['pentest', 'redteam'] },
  { id: 'redteam',   name: 'adversarial mindset',   category: 'offense',     description: 'Ask: how would I attack this?',                               position: [2.7,  0.6, -0.6 ], connections: ['exploit', 'pentest'] },

  // ENGINEERING — clustered lower-center
  { id: 'python',    name: 'python',                category: 'engineering', description: 'The lingua franca of automation.',                             position: [0,    -1,   0.4 ], connections: ['n8n', 'api', 'docker'] },
  { id: 'n8n',       name: 'n8n',                   category: 'engineering', description: 'Workflows that survive their author.',                         position: [-0.8, -1.4, -0.3], connections: ['python', 'api'] },
  { id: 'docker',    name: 'docker',                category: 'engineering', description: 'Reproducible everything.',                                     position: [0.8,  -1.6,  0.2], connections: ['python', 'linux'] },
  { id: 'linux',     name: 'linux',                 category: 'engineering', description: 'Where the work actually happens.',                             position: [1.4,  -0.8, -0.5], connections: ['docker', 'iptables'] },
  { id: 'iptables',  name: 'iptables',              category: 'engineering', description: 'The oldest firewall. Still the strictest.',                    position: [-1.6, -0.4,  0.7], connections: ['linux'] },
  { id: 'api',       name: 'fastapi',               category: 'engineering', description: 'Where logic meets the network.',                               position: [0.4,  -2.2, -0.4], connections: ['python', 'docker'] },

  // CREATIVE — clustered far-right
  { id: 'astro',     name: 'astro · next',          category: 'creative',    description: 'Frontends that load fast and look slow.',                      position: [4,    0,    0.5 ], connections: ['react', 'flutter'] },
  { id: 'react',     name: 'react · r3f',           category: 'creative',    description: 'For the moments words can\'t carry.',                         position: [4.4,  -0.8, -0.3], connections: ['astro', 'three'] },
  { id: 'three',     name: 'three.js · gsap',       category: 'creative',    description: 'Math, but cinematic.',                                         position: [4.8,  0.6,  0.4 ], connections: ['react'] },
  { id: 'flutter',   name: 'flutter',               category: 'creative',    description: 'For when the work needs a phone home.',                        position: [3.6,  -1.4, -0.6], connections: ['astro'] },
];
