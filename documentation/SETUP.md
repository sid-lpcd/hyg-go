# Setup Guide

## Prerequisites

- Node.js 18+
- npm 9+
- Access to the Hyg-Go backend and WebSocket endpoints
- Mapbox API key

## Environment Variables

Create a `.env` file at the project root.

```env
VITE_HYGGO_API_URL=http://localhost:3000
VITE_HYGGO_API_URL_PRODUCTION=https://api.example.com
VITE_HYGGO_API_URL_WS=ws://localhost:3000
VITE_HYGGO_API_URL_WSS_PRODUCTION=wss://api.example.com
VITE_MAPGL_API_KEY=your_mapbox_token
VITE_ENV_TYPE=DEV
```

Notes:

- Use `VITE_ENV_TYPE=DEV` for local development.
- Any value other than `DEV` will make the app use the production API and WSS variables.

## Install and Run

```bash
npm install
npm run dev
```

Vite usually serves the app on `http://localhost:5173`.

## Build and Preview

```bash
npm run build
npm run preview
```

## Validation Checklist

- App loads without blank screen.
- Login/register page (`/user`) is reachable.
- Protected routes redirect to `/user` when not authenticated.
- Map renders correctly (valid Mapbox token).
- API requests and WebSocket connection use expected endpoints.
