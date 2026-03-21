# Feature Notes

## Authentication and Access Control

- Protected pages are wrapped with `ProtectedRoute`.
- If a user is not logged in, navigation redirects to `/user`.

## Plan Creation Flow

1. User starts in `/create-plan`.
2. User selects a location and enters trip parameters.
3. User navigates to `/create-plan/:id/*` to browse and select activities.
4. Basket context is used to manage selected activities before finalizing.

## Activity Discovery

- Activities can be explored through map and list interfaces.
- Location and category-based filtering is supported through API endpoints.
- Bounds-based queries can be used for map viewport-driven search.

## Itinerary and Sharing

- Itinerary details are available under `/plan/:planId/itinerary`.
- Share page is available under `/plan/:planId/share`.

## Wallet and Passes

- Wallet-related views are part of the main authenticated experience.
- Pass generation and QR retrieval are supported via API helper methods.

## Real-Time Updates

- WebSocket utilities are available for flows that require live events.
- Auto-reconnect behavior is built in with capped retry attempts.
