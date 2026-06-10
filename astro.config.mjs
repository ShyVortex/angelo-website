// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from "astro-icon";
import cloudflare from '@astrojs/cloudflare';

const isDev = process.argv.includes('dev') || process.argv.includes('start');

// https://astro.build/config
export default defineConfig({
  adapter: isDev ? undefined : cloudflare(),
  i18n: {
    defaultLocale: 'it',
    locales: ['it', 'en'],
    routing: {
      prefixDefaultLocale: false
    }
  },
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [icon()]
});