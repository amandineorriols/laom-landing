# LAOM Landing Page

A beautiful, multilingual landing page for LAOM - a rural coliving in the south of Aveyron, France.

## Features

- 🌍 **Multilingual**: French (default) and English support using Astro i18n
- 🎨 **Beautiful Design**: Inspired by luxury wellness brands with a minimal, elegant aesthetic
- 🚀 **Performance**: Built with Astro for optimal performance
- ☁️ **Cloudflare Workers**: Deployed on Cloudflare Workers for global edge distribution
- 🔍 **SEO Optimized**: Complete SEO setup with sitemap, structured data, and SEO checker
- 📱 **Responsive**: Fully responsive design for all devices

## Tech Stack

- [Astro](https://astro.build/) - Web framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Cloudflare Workers](https://workers.cloudflare.com/) - Deployment
- [Bun](https://bun.sh/) - Package manager and runtime

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your system

### Installation

Install dependencies:

```bash
bun install
```

### Development

Start the development server:

```bash
bun run dev
```

Or use the VS Code/Cursor task runner:
- Open the Command Palette (Cmd+Shift+P / Ctrl+Shift+P)
- Select "Tasks: Run Task"
- Choose "bun: dev"

The site will be available at `http://localhost:4321`

### Building

Build for production:

```bash
bun run build
```

### Preview

Preview the production build:

```bash
bun run preview
```

## SEO Checking

Check SEO compliance:

```bash
bun run seo:check
```

For detailed reports:

```bash
bun run seo:check:report
```

## Deployment

The site is automatically deployed to Cloudflare Workers via GitHub Actions when you push to the `main` branch.

### Manual Deployment

To deploy manually:

```bash
bunx wrangler deploy
```

Make sure you have:
- `CLOUDFLARE_API_TOKEN` in your environment variables
- `CLOUDFLARE_ACCOUNT_ID` in your environment variables

## Project Structure

```
├── public/           # Static assets
├── src/
│   ├── components/   # Astro components
│   ├── i18n/         # Translation files
│   ├── layouts/      # Page layouts
│   ├── pages/        # Page routes
│   ├── styles/       # Global styles
│   └── utils/        # Utility functions
├── .github/          # GitHub Actions workflows
└── astro.config.mjs  # Astro configuration
```

## Languages

- **French (fr)**: Default language at `/`
- **English (en)**: Available at `/en`

The language switcher is available in the header.

## License

© 2025 LAOM. All rights reserved.
