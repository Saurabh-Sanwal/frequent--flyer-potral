# Prompts.md - How It Works (Q&A)

Questions and answers to explain the project in a review or viva.

---

## General

**Q1. What problem does this solve?**
Staff used paper and Excel, which lost data and was slow. This portal stores members in MongoDB and gives a fast UI to enrol, search and update miles.

**Q2. Why this stack?**
React for a fast UI, Express for a small REST API, MongoDB because a member is one self-contained document. Plain CSS keeps the bundle small and follows the design handoff.

---

## Frontend

**Q3. What is Context and why use it here?**
Context shares state without passing props through every component. `MemberContext` holds the members list, loading, error and the action functions, so the form, list and cards all read the same data.

**Q4. Why are there both `MemberContext.js` and `MemberProvider.jsx`?**
The ESLint rule `react-refresh/only-export-components` wants component files to export only components. The context object lives in a `.js` file and the Provider component in `.jsx`.

**Q5. What does the `useMembers` hook do?**
It wraps `useContext(MemberContext)` and throws a clear error if used outside the Provider. Components just call `useMembers()`.

**Q6. Why `useCallback` and `useMemo` in the Provider?**
`loadMembers` is a dependency of `useEffect` in `App`. Without `useCallback` it would be a new function each render and cause an infinite fetch loop. `useMemo` on the context value stops needless re-renders of consumers.

**Q7. How does search work without hammering the server?**
`useDebounce` waits 400 ms after the last keystroke, then `App` calls `loadMembers(debounced)`.

**Q8. What is the `latest` ref for?**
Race conditions. If a slow request for "sa" returns after a fast one for "saurabh", the ref id check ignores the stale result.

**Q9. How is form validation done?**
`validateMember` returns an errors object. On submit, if it has keys the request is blocked, the bad inputs get the `invalid` class (red border) and `aria-invalid`, the message is linked by `aria-describedby`, and focus moves to the first bad field.

**Q10. How does the UI handle bad connectivity?**
`api/client.js` aborts after 15 seconds and turns network failures into readable messages. The list shows a spinner while loading, and on failure shows an alert with a "Try again" button. Buttons show "Saving…" and are disabled during requests.

**Q11. Where is the analytics ping?**
In `utils/analytics.js`. The Provider's `run` helper calls `track()` only after an action succeeds (enrol, add miles, remove).

---

## Backend

**Q12. How is the backend structured?**
Routes map URLs to controllers, controllers hold the logic, the model defines the data, middleware handles cross-cutting work (sanitizing, errors), and `config/db.js` connects to MongoDB.

**Q13. Why is there no client URL in the backend `.env`?**
CORS is opened with `cors()`, so the API accepts any origin. The `.env` holds only `MONGO_URI`. For a stricter production setup you could restrict origins later.

**Q14. Why `$inc` for adding miles?**
`$inc` increments atomically in the database. Reading, adding in JS and saving could lose updates if two staff add miles at the same time.

**Q15. How is the tier calculated?**
`utils/tier.js` computes it from points, and a Mongoose virtual exposes `tier` in the JSON. It is never stored, so it cannot go out of sync with the points.

**Q16. How are errors returned consistently?**
Controllers throw errors (Express 5 catches async errors). `errorHandler` maps duplicate email to 409, bad ids to 400, validation to 400, unknown to a generic 500 message, and always returns `{ message }`.

**Q17. How is search made safe?**
The query is trimmed, length-limited and regex-escaped with `escapeRegex`, so users cannot inject regex patterns.

---

## Security and quality

**Q18. How is XSS handled?**
Twice. The frontend strips `<`, `>` and `javascript:` before values enter state (`sanitizeText`). The backend does the same in `sanitizeBody` before saving. React also escapes output by default.

**Q19. How are secrets handled?**
The only secret, the database string, lives in the backend `.env`, which is git-ignored. On hosting, set it as an environment variable in the dashboard. The frontend has no secrets and no `.env`; it just has the API URL in `api/client.js`.

**Q20. How is accessibility covered?**
Every input has a `<label>`, errors use `aria-invalid` and `aria-describedby`, loaders use `role="status"`, errors use `role="alert"`, there is a skip link, visible focus outlines, semantic landmarks (`header`, `main`, `aside`) and a proper heading order. Text colors meet contrast requirements and motion respects `prefers-reduced-motion`.

**Q21. How does the design follow the handoff?**
All colors are CSS variables in `styles/variables.css` (grays only, plus one red for errors as the brief requires). Padding uses 16px and 32px steps. Tiers are told apart by fill (outline, light gray, dark), not by color.
