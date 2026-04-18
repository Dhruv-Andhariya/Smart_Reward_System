# Smart Reward System Deployment Guide

This project has two deployable parts:
- Client: React + Vite frontend
- Server: Node.js + Express + MongoDB API

Automation files added in repository:
- `render.yaml` for backend service defaults on Render
- `Client/vercel.json` for frontend defaults on Vercel

## 1. Deploy the backend (Render recommended)

1. Push the repository to GitHub.
2. In Render, create a new Blueprint (recommended) or Web Service from the repository.
3. If you use Blueprint, Render auto-reads `render.yaml` from repo root.
3. Set the service root directory to `Server`.
4. Configure:
   - Build command: `npm install`
   - Start command: `npm start`
5. Add environment variables:
   - `PORT=5000`
   - `MONGO_URI=<your MongoDB Atlas connection string>`
   - `JWT_SECRET=<long random secret>`
   - `CLIENT_URL=<your frontend domain, for example https://smart-reward.vercel.app>`
6. Deploy and verify health endpoints:
   - `https://your-backend-domain.com/`
   - `https://your-backend-domain.com/test`

If service is created from `render.yaml`, most settings are prefilled. You only need to set secret env vars.

## 2. Configure MongoDB Atlas

1. Create a database user with readWrite access.
2. In Network Access, allow your deployment platform IPs.
   - For quick setup, `0.0.0.0/0` works, but is less strict.
3. Put the resulting connection string in `MONGO_URI`.

## 3. Deploy the frontend (Vercel recommended)

1. In Vercel, create a project from the same repository.
2. Set the root directory to `Client`.
3. Vercel reads `Client/vercel.json`; defaults are already set. Keep:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Add environment variable:
   - `VITE_API_BASE_URL=https://your-backend-domain.com`
5. Deploy.

## 4. Connect frontend and backend

1. Copy your deployed frontend URL.
2. Update backend env `CLIENT_URL` with that exact URL.
3. Redeploy backend so CORS allows your frontend origin.

## 5. Local to production env mapping

- Client env example: `Client/.env.example`
- Server env example: `Server/.env.example`
- Frontend API base URL is read from `VITE_API_BASE_URL` in `Client/src/lib/api.js`.

## 6. Common failures and fixes

- CORS error in browser:
  - Confirm backend `CLIENT_URL` exactly matches frontend URL, including `https`.
- Mongo connection error:
  - Check Atlas IP allowlist and credentials in `MONGO_URI`.
- 401 auth errors after deploy:
  - Ensure `JWT_SECRET` is set in backend environment.

## Optional single-platform deployment

You can deploy frontend and backend on one platform too (for example Render static site + web service), but Vercel for frontend and Render for backend is the fastest setup for this stack.

## Quick execute checklist

1. Commit and push code:
   - `git add .`
   - `git commit -m "chore: add deployment configs"`
   - `git push`
2. On Render, create from repo (Blueprint) and set:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLIENT_URL` (use Vercel URL after frontend deploy)
3. On Vercel, import repo with root `Client` and set:
   - `VITE_API_BASE_URL=https://<your-render-api-domain>`
4. Redeploy backend after final Vercel domain is available.
5. Final smoke tests:
   - Frontend opens without console CORS error
   - Login/Register works
   - Restaurants/Offers/Transactions/Rewards pages load API data
