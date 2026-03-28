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
- If local frontend points to a remote backend, authentication still follows remote backend rules (token validity, issuer/audience, expiration, etc.).

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

## Troubleshooting Auth 401s

- In development, React StrictMode can trigger duplicate effects and duplicate protected fetches.
- Auth calls are deduped in-flight, but feature-level data requests may still appear more than once in Network tab.
- If you see mixed `401` and `200` for the same protected endpoint, verify:
  - `VITE_ENV_TYPE` and API URL variables point to the intended backend.
  - `authToken` exists in `localStorage` and has not expired.
  - The token was issued for the backend you are calling.
