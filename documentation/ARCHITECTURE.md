# Architecture Overview

## High-Level Design

Hyg-Go frontend is a Vite-powered React TypeScript SPA.

- Routing is handled by `react-router-dom`.
- Authentication state is managed by `AuthContext`.
- Basket/selection flow state is handled by `BasketContext`.
- API communication is centralized in `src/utils/apiHelper.ts`.
- Real-time updates are handled via a reusable WebSocket manager in `src/utils/websocket/factory.ts`.

## Routing

Main route definitions live in `src/App.tsx`.

Key routes:

- `/` -> `MainPage` (protected)
- `/wallet` -> `MainPage` wallet section (protected)
- `/map` -> `MainPage` map section (protected)
- `/user` -> user auth/profile entry point
- `/create-plan` -> create plan flow (protected)
- `/create-plan/:id/*` -> activity selection flow (protected + basket provider)
- `/plan/:planId/itinerary` -> itinerary view (protected)
- `/plan/:planId/share` -> share plan view (protected)

## Data and API Layer

`src/utils/apiHelper.ts` provides typed wrappers for backend modules:

- activities
- locations
- plans and plan activities
- auth/user profile
- media upload intent and completion
- pass generation and QR retrieval
- plan media upload intent, upload execution, and completion

The Axios client is configured with:

- Environment-aware base URL selection
- Authorization header injection
- Unified API/network error mapping

### Auth Idempotency

To keep auth behavior stable in local development (including React StrictMode):

- `refreshTokenUser` in `src/utils/apiHelper.ts` dedupes in-flight refresh requests.
- `AuthContext` dedupes in-flight `login`, `register`, `update`, and `refreshToken` calls.
- Concurrent callers receive the same promise until the in-flight call settles.

This prevents multiple overlapping auth calls from causing inconsistent request outcomes during app bootstrap.

## WebSocket Layer

`WebSocketManager` supports:

- Connect/disconnect
- Auto reconnect with retry limit
- Message send helper
- Lifecycle callbacks (`onOpen`, `onMessage`, `onError`, `onClose`)

WebSocket URL selection also follows `VITE_ENV_TYPE`.

## Types and Contracts

Types are split for clarity:

- `src/types/contract`: API request/response contracts
- `src/types/common`: app-level mapped models

This separation helps keep backend DTOs and frontend view models independent.
