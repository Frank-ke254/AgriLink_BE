# AgriLink Backend 

A complete Express.js project that ties together:
- Routes & methods (GET, POST, PATCH, DELETE)
- Security hardening (helmet, CORS, HPP, input validation)
- Rate limiting (express-rate-limit)
- Pagination & basic query optimization
- Caching (node-cache, route-level & key-based)

> This version uses in-memory data to keep things simple and self-contained.

## Endpoints (examples)

- `GET /api/v1/listings?search=fruit&type=feed&page=1&limit=5&sort=-quantity`
- `POST /api/v1/listings` (create)
- `PATCH /api/v1/listings/:id`
- `DELETE /api/v1/listings/:id`
- Similar endpoints for `/suppliers` and `/farmers`.

## Caching
- Popular list queries are cached by a computed key of query params.
- TTL is controlled by `CACHE_TTL_SECONDS`.

## Rate Limiting
- `RATE_LIMIT_WINDOW_MIN` and `RATE_LIMIT_MAX_REQ` control request budgets per IP.

## Tests
- A tiny smoke test in `tests/smoke.js` to show the API boots.
