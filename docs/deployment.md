# Deployment

The site is configured for Vercel.

## Build Settings

`vercel.json` defines:

- `buildCommand`: `npm run build`
- `outputDirectory`: `dist`
- SPA rewrite rules that serve `index.html` for non-asset, non-API routes.

## Deployment Ignore Behavior

The `ignoreCommand` intentionally skips public deployment unless the commit message contains `[deploy]`. This allows normal commits without publishing the current site state, while `[deploy]` acts as the explicit publish marker.

## Runtime Requirements

Production API routes need the server-only environment variables documented in `docs/environment-variables.md`.

The frontend build is static, but portfolio content, contact email, and music features depend on Vercel functions and configured external services.
