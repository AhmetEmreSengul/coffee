# Coffee — Booking & Menu App

https://timeslot-dtqf.onrender.com

## Overview

THE TIME SLOT CAFE

## Repository structure

- `backend/` — Express backend with API routes, controllers, models and utilities.
- `frontend/` — Vite + React + TypeScript frontend application.

## Quick features

- User signup / login (JWT-based authentication).
- Booking tables (create / view bookings).
- Simple menu display 
- Seed script for populating tables in the backend (`backend/scripts/seedTables.js`).

## Tech stack

- Backend: Node.js, Express (JavaScript)
- Frontend: React, TypeScript, Vite
- Data: simple models in `backend/models/` 

## Prerequisites

- Node.js (16+ recommended) and npm
- Git (optional)

## Environment

Create a `.env` file in `backend/` (a `.env` file is already present in the project root of the backend). Common variables the backend expects include:

- `PORT` — server port (e.g. `4000`)
- `DATABASE_URL` or `DB_URL` — connection string for the database (if applicable)
- `JWT_SECRET` — secret used for signing JSON Web Tokens
- `NODE_ENV` — `development` or `production`

Check `backend/lib/env.js` (or similar) for exact variable names used by this project.

## Setup & Run (Windows PowerShell)

Run these from the repository root.

Backend

```
cd backend
npm install
# Start in development (script name may vary - check backend/package.json)
npm run dev
# or if no dev script: node src/server.js
```

Frontend

```
cd frontend
npm install
npm run dev
# build for production
npm run build
```

## Seeding the table database

There is a seed script at `backend/scripts/seedTables.js`. From the `backend` folder run:

```
node scripts/seedTables.js
```

## API

- Authentication: routes in `backend/routes/auth.route.js` (signup, login)
- Booking: routes in `backend/routes/booking.route.js` (create booking, list bookings)

Check `backend/src/server.js` (or `backend/server.js`) to see how routes are mounted (for example under `/api`).

## Development tips

- Use `nodemon` for backend development to auto-restart on changes (`npm i -D nodemon`).
- If frontend and backend run on different ports, configure CORS in the backend or set up a proxy in the Vite config.
- Inspect `backend/lib/db.js` to see what kind of database or data layer is used (file-based, SQLite, Mongo, etc.).

## Contributing

- Clone the repo and create a feature branch.
- Keep backend and frontend changes isolated to their folders when possible.

## Where to look first

- Backend entry: `backend/src/server.js`
- Backend routes: `backend/routes/`
- Frontend entry: `frontend/src/main.tsx` and `frontend/src/App.tsx`
- Frontend data: `frontend/public/coffee.json` and `frontend/src/Data.tsx`


