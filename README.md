# Snip

A URL shortener with a live analytics dashboard. Paste a long URL, get a short one back, watch click
counts tick up as people use it.

Built as the flagship project for a software-job study plan — each phase below adds one real piece.

## Status

- [x] Phase 0 — skeleton: submit a URL, get a short code, redirect route, no auth yet
- [x] Phase 1 — tests for the short-code generator and URL validator (`npm test`)
- [x] Phase 2 — CI running those tests on every push via GitHub Actions
- [ ] Phase 3 — Docker + docker-compose (app + Postgres + Redis) (needs Docker Desktop installed)
- [x] Phase 4 — real accounts (bcryptjs + JWT), links tied to their owner
- [ ] Phase 5 — live click counter via Socket.io
- [ ] Phase 6 — Redis caching on redirects + a background job queue for click logging
- [ ] Phase 7 (optional) — semantic search over saved links

## Run it

```
npm install
npm start
```

Then open http://localhost:4141

## How it works right now

- `POST /api/links` — takes `{ url }`, validates it, generates a short code, saves it
- `GET /api/links` — lists all saved links
- `GET /:code` — looks up the code and redirects, or 404s if it doesn't exist
- Links are stored in `data/links.json` (not committed — it's runtime data, not source)
- `lib/generateCode.js` and `lib/isValidUrl.js` are kept as small, pure functions on purpose —
  they're the easiest things to unit test in Phase 1
