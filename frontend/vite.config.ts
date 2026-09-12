import { defineConfig } from 'vitest/config';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';


export default defineConfig({
  plugins: [
    react(), 
    babel({ presets: [reactCompilerPreset()] })
  ],
  resolve: {
    alias: {
      '@': '/src',
      '@tests': '/tests',
      '@Header': '/src/components/Header',
      '@Home': '/src/components/Home',
      '@Account': '/src/components/Account',
      '@FrontPage': '/src/components/FrontPage',
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setupTests.ts',
  },

});