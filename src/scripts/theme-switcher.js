// src/scripts/theme-switcher.js
document.addEventListener('DOMContentLoaded', () => {
  const themeSwitcher = document.getElementById('theme-switcher');
  const body = document.body;

  const themes = [
    {
      '--bg': '#050910',
      '--text': '#e6f3ff',
      '--grid': '#102033',
      '--neon-cyan': '#07f0ff',
      '--neon-purple': '#a24cff',
    },
    {
      '--bg': '#f0f0f0',
      '--text': '#333',
      '--grid': '#ddd',
      '--neon-cyan': '#007acc',
      '--neon-purple': '#6e48cf',
    },
    {
      '--bg': '#1a1a1a',
      '--text': '#f0f0f0',
      '--grid': '#333',
      '--neon-cyan': '#ff4081',
      '--neon-purple': '#7c4dff',
    },
  ];

  let currentTheme = 0;

  themeSwitcher.addEventListener('click', () => {
    currentTheme = (currentTheme + 1) % themes.length;
    const theme = themes[currentTheme];
    for (const [key, value] of Object.entries(theme)) {
      body.style.setProperty(key, value);
    }
  });
});
