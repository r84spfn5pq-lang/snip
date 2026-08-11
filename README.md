# Snip

A URL shortener with a live analytics dashboard. Paste a long URL, get a short one back, watch click
counts tick up as people use it.

Built as the flagship project for a software-job study plan — each phase below adds one real piece.

## Status

- [x] Phase 0 — skeleton: submit a URL, get a short code, redirect route, no auth yet
- [x] Phase 1 — tests for the short-code generator and URL validator (`npm test`)
- [x] Phase 2 — CI running those tests on every push via GitHub Actions
- [x] Phase 3 — containerized with Docker (`docker compose up`)
- [x] Phase 4 — real accounts (bcryptjs + JWT), links tied to their owner
- [x] Phase 5 — live click counter via Socket.io
- [x] Phase 6 — Redis caching on redirects + a background job queue for click logging
- [ ] Phase 7 (optional) — semantic search over saved links

## Run it

In Docker (recommended — starts the app, the worker, and Redis together):
```
docker compose up --build
```

Locally (needs Redis running separately, e.g. `docker compose up redis`, plus the worker in another terminal):
```
npm install
npm start        # in one terminal
node worker.js   # in another
```

Either way, open http://localhost:4141

## How it works right now

- `POST /api/links` — takes `{ url }`, validates it, generates a short code, saves it, warms the Redis cache
- `GET /api/links` — lists all saved links
- `GET /:code` — checks Redis first; on a cache miss, falls back to the JSON store and re-caches.
  Either way it redirects immediately, then queues a `record-click` job instead of writing synchronously.
- `worker.js` — a separate process that consumes the `clicks` queue, updates the click count, and
  publishes a Redis pub/sub message so the web process can push a live update over Socket.io
- Links/users are stored in `data/links.json` / `data/users.json` (not committed — runtime data, not source)
- `lib/generateCode.js` and `lib/isValidUrl.js` are kept as small, pure functions on purpose —
  they're the easiest things to unit test in Phase 1
