<p align="center">
  <img width="180" src="public/astro-logo.png" alt="astro-logo"></img>
  <h1 align="center">Angelo Trotta | Portfolio</h1>
  <p align="center">Personal website to present my biography, educational and professional experience, resume, skills and contact information.
</p>

## Description
This is a modern, fast, and secure personal portfolio website.  
It is fully responsive, optimized for search engines (SEO), and supports both English and Italian.

### Tech Stack
- **Astro**: built with Astro utilizing Server-Side Rendering (SSR) mode to deliver optimal performance.
- **Tailwind CSS**: modern utility-first CSS framework configured via the official Vite plugin for rapid and responsive UI development.
- **TypeScript**: used throughout the codebase to ensure type safety, modular design, and robust data models.
- **Deployment & Hosting**: hosted serverless on **Cloudflare Pages** utilizing the `@astrojs/cloudflare` adapter.

### Key Features
- **Astro i18n**: full internationalization mapping routes between Italian (`/`) and English (`/en`).
- **Language Detection**: automatic browser language routing that redirects non-Italian users to the `/en` portal upon landing on the root page.
- **Dynamic Skills & Portfolio Grid**: dynamic search, filtering by category, and client-side pagination on Skills and Project pages.
- **Accessibility & SEO**: built following semantic HTML standards, featuring Schema.org metadata (JSON-LD), hreflang alternate links, XML sitemap mapping, and custom Open Graph metadata for rich sharing.

### Integrated Services
- **Contact Form**: secure form validation sending messages via a serverless API endpoint communicating with **Resend API**.
- **Security Check**: integrates client-side public IP lookup via the `ipify` API to ensure proper logging and abuse prevention.

### Directory Structure
```text
src/
├── assets/       # Visual resources and images
├── components/   # Reusable UI elements
├── i18n/         # UI dictionary keys, route translations, and helpers
├── icons/        # Custom SVG icon bindings
├── layouts/      # HTML layout wrappers with SEO metatags
├── pages/        # Astro pages (Italian root, /en/ for English)
├── resources/    # Localized JSON data stores
├── scripts/      # Client-side typescript logic
├── styles/       # Tailwind CSS style tokens and custom styling
├── types/        # TypeScript type interfaces
└── views/        # Page view wrappers
```


## License
- This project is distributed under the [GNU General Public License v3.0](https://github.com/ShyVortex/angelo-website/blob/main/LICENSE).
- © Copyright of [@ShyVortex](https://github.com/ShyVortex), 2026.
