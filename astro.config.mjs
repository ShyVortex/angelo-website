// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from "astro-icon";
import cloudflare from '@astrojs/cloudflare';

const isDev = process.argv.includes('dev') || process.argv.includes('start');

// https://astro.build/config
export default defineConfig({
  output: 'server',
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
  integrations: [
    icon({
      include: {
        mdi: [
          'language-java', 'language-python', 'bash', 'angular', 'language-php', 'language-html5',
          'language-typescript', 'database', 'microsoft-azure-devops', 'internet', 'server', 'laptop',
          'toolbox', 'clock', 'star-three-points', 'file-pdf-box', 'translate', 'react',
          'chevron-left', 'chevron-right', 'magnify', 'close-circle', 'tailwind', 'linux', 'docker',
          'alert-circle-outline', 'hand-wave', 'star', 'star-half-full', 'star-outline', 'git', 'github',
          'wordpress'
        ],
        'simple-icons': ['ionic', 'flutter', 'nestjs', 'astro', 'django', 'blender', 'adobephotoshop'],
        'icon-park-outline': ['system'],
        tabler: ['seo'],
        ph: ['graduation-cap-fill'],
        logos: ['whatsapp-icon', 'telegram'],
        'skill-icons': ['linkedin', 'discord', 'instagram', 'github-dark'],
        'material-symbols': ['mail-rounded']
      }
    })
  ]
});