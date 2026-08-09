# Development

## Install

```bash
npm install
```

## Frontend Dev Server

```bash
npm run dev
```

This runs Vite. The Vite server proxies `/api` to `http://localhost:3000`, so API requests require a separate Vercel dev process when testing backend behavior.

## Vercel Dev

```bash
npm run dev:vercel
```

Use this when testing `api/` handlers locally, including the Python contact endpoint.

## Build

```bash
npm run build
```

## Lint

```bash
npm run lint
```

## Formatting

The repository uses tabs by default through `.prettierrc` and `src/.editorconfig`. Python uses four spaces.

## Tests

There is no test script currently defined in `package.json`.
