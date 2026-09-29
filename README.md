# End-to-End Frequent Flyer Portal

Digital replacement for the paper and Excel workflow used by airline floor staff. Staff can enrol members, log flown miles, search members and see loyalty tiers.

**Ticket:** ENG-163087 · **Stack:** React (Vite) + Node/Express + MongoDB Atlas · **Styling:** plain CSS (no Tailwind)

## Features

- Enrol members (name + email) with an auto-generated member ID
- Log miles per member; the tier updates automatically (Silver under 5,000, Gold 5,000+, Platinum 20,000+)
- Search by name, email or member ID (debounced)
- Remove members
- Empty state, loading indicators, form validation with red highlights, retry on network failure
- Console analytics ping: `[Analytics] User interacted with End-to-End Frequent Flyer Portal: <action>`

## Folder structure

```
frequent-flyer-portal/
├── backend/
│   ├── server.js                 # app entry
│   ├── .env                      # MONGO_URI only
│   └── src/
│       ├── config/db.js          # MongoDB connection
│       ├── models/Member.js      # schema + tier virtual
│       ├── controllers/          # request logic
│       ├── routes/               # URL -> controller
│       ├── middleware/           # sanitize + error handler
│       └── utils/tier.js         # tier rules
└── frontend/
    └── src/
        ├── api/client.js         # fetch wrapper (timeout, errors)
        ├── context/              # MemberContext + MemberProvider
        ├── hooks/                # useMembers, useDebounce
        ├── components/           # Form, List, SearchBar, Loader, EmptyState
        ├── utils/                # sanitize, validate, analytics
        └── styles/               # variables, base, layout, components
```

## Run locally

```bash
# Terminal 1 - API
cd backend
npm install
npm run dev          # http://localhost:5000

# Terminal 2 - UI
cd frontend
npm install
npm run dev          # http://localhost:5173
```

The backend `.env` has only `MONGO_URI`. CORS is open, so no client URL is needed. The frontend has no `.env`: its API address is one line at the top of `frontend/src/api/client.js`.

## API

| Method | Endpoint                 | Purpose                 |
| ------ | ------------------------ | ----------------------- |
| GET    | `/api/health`            | Health check            |
| GET    | `/api/members?q=`        | List / search members   |
| POST   | `/api/members`           | Enrol `{ name, email }` |
| PATCH  | `/api/members/:id/miles` | Add miles `{ miles }`   |
| DELETE | `/api/members/:id`       | Remove member           |

## Production build

```bash
cd frontend
npm run lint         # must show 0 warnings
npm run build        # output in frontend/dist
```

Deploy `backend` (Render/Railway) and `frontend/dist` (Vercel/Netlify). `.env` is git-ignored, so add `MONGO_URI` in the backend host's dashboard. Before building the frontend, change `BASE_URL` in `frontend/src/api/client.js` to your deployed API URL (ending in `/api`). In MongoDB Atlas, allow the host's IP under Network Access.

## Definition of Done

- [x] Builds and runs without fatal errors
- [x] ESLint with `--max-warnings 0`, no unused imports
- [x] Happy path: enrol, log miles, search, remove
- [x] Unhappy path: empty state, loaders, red invalid fields, network error with retry
- [x] Accessibility: labels, `aria-invalid`, `aria-describedby`, live regions, skip link, focus styles
- [x] XSS sanitization on the frontend (before state) and the backend (before saving)
- [x] Secrets only in git-ignored `.env` files
- [x] Monochrome palette, 16px / 32px spacing

## Security note

`.env` is in `.gitignore`. Never commit it, and rotate the database password if it was ever shared or pushed.
