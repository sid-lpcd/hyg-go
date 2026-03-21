# Hyg-Go Frontend

Hyg-Go is a travel planning frontend focused on helping users discover activities, build itineraries, and manage trip-related details from one interface.

## Live App

[hyg-go-one.vercel.app](https://hyg-go-one.vercel.app/)

## Current Scope

- React + TypeScript single-page application (Vite).
- Authenticated user experience (protected routes).
- Plan creation flow with map/list activity selection.
- Itinerary and plan sharing pages.
- Wallet and user profile related views.

## Tech Stack

- React 18
- TypeScript
- Vite
- Sass
- Axios
- Mapbox GL
- Vitest + Testing Library

## Project Structure

```text
hyg-go/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── base/
│   │   └── sections/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   │   ├── CreatePlanPages/
│   │   ├── MainPage/
│   │   ├── SharePlanPage/
│   │   ├── UserPage/
│   │   └── WalletPage/
│   ├── styles/
│   ├── types/
│   └── utils/
├── public/
├── documentation/
├── package.json
└── README.md
```

## Getting Started

1. Clone and enter the repository:
   ```bash
   git clone https://github.com/sid-lpcd/hyg-go.git
   cd hyg-go
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the project root (same level as `package.json`):
   ```env
   VITE_HYGGO_API_URL=
   VITE_HYGGO_API_URL_PRODUCTION=
   VITE_HYGGO_API_URL_WS=
   VITE_HYGGO_API_URL_WSS_PRODUCTION=
   VITE_MAPGL_API_KEY=
   VITE_ENV_TYPE=DEV
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open the local app URL printed by Vite (default: `http://localhost:5173`).

## Scripts

- `npm run dev` - Run local development server.
- `npm run build` - Create production build in `dist/`.
- `npm run preview` - Preview production build locally.
- `npm run lint` - Run ESLint.
- `npm run test` - Run test suite with Vitest.

## Documentation

More detailed docs are available in the [`documentation/`](./documentation) folder:

- [`documentation/SETUP.md`](./documentation/SETUP.md)
- [`documentation/ARCHITECTURE.md`](./documentation/ARCHITECTURE.md)
- [`documentation/FEATURES.md`](./documentation/FEATURES.md)

## Contact

For questions or feedback, contact [Sidonio Silva](https://github.com/sid-lpcd) or open an issue on GitHub.
