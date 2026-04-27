import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://sayanth2091.github.io',
  base: '/Sayanth-dev',
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false })
  ],
  vite: {
    ssr: {
      noExternal: ['gsap', 'lenis']
    }
  }
});
