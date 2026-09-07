import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';


export default defineConfig({
  plugins: [react()],
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