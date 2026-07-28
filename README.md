# DocMind AI — Frontend

Next.js (App Router) client for DocMind AI, an AI-powered RAG document assistant. Pairs with [backend-DocMind AI](https://github.com/ChamathDilshanC/backend-DocMind-AI).

## Stack

React 19, Next.js 16, Tailwind CSS v4, shadcn/ui (Base UI), TanStack Query, Zustand, `@microsoft/signalr`, `@react-oauth/google`, React Hook Form + Zod.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in NEXT_PUBLIC_GOOGLE_CLIENT_ID
npm run dev
```

Requires the backend API running (default `http://localhost:5180`) — see `backend-DocMind AI/appsettings.README.md` for setup, including how to obtain a Google OAuth Client ID.

## Structure

- `src/app/(auth)` — login/register pages, no sidebar shell.
- `src/app/(dashboard)` — authenticated app shell (sidebar + navbar), client-side auth guard (see note below).
- `src/lib/api` — typed fetch wrappers per backend module, with automatic 401 → refresh-token retry.
- `src/lib/signalr` — shared hub connection for document-processing progress and chat token streaming.
- `src/stores/auth-store.ts` — Zustand store (persisted to `localStorage`) holding the access/refresh tokens and user.

### Why no `proxy.ts` (middleware) route guard

The backend issues tokens in the response body rather than a cookie (simpler across two different local ports without `SameSite=None; Secure` cross-origin cookie complications). Since tokens live in `localStorage`, a server-side Next.js proxy can't see them, so route protection is done client-side in `app/(dashboard)/layout.tsx` instead.

## Scripts

- `npm run dev` — start the dev server (Turbopack)
- `npm run build` / `npm run start` — production build/serve
- `npm run lint` — ESLint
