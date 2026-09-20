<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# LORÉA

LORÉA is a women's fashion storefront with a Vite/React frontend and an optional Express API for authentication, checkout, Supabase data, and server-side AI styling.

- [Live storefront](https://kareem-500.github.io/Loreaofficial/)
- [GitHub repository](https://github.com/Kareem-500/Loreaofficial)

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env` and set the server-side `GEMINI_API_KEY`, `AUTH_SECRET`, and database settings as needed. Never use a `VITE_` variable for private keys.
3. Run the app:
   `npm run dev`

## Production

Run `npm run build` to build the frontend and bundle the API server. Use `npm run build:frontend` when deploying only the static frontend.

### Database and API

The app supports two database paths:

- The Express API uses local SQLite at `DATABASE_URL` for local development.
- Supabase PostgreSQL powers hosted authentication, profiles, wishlist, orders, and admin data. Apply the SQL migration in `supabase/migrations/` to a Supabase project, then configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

Never expose `AUTH_SECRET`, `JWT_SECRET`, `GEMINI_API_KEY`, payment credentials, or SMTP credentials in frontend variables. Only the Supabase URL and public anon key belong in `VITE_` variables.

### GitHub Pages

The workflow at `.github/workflows/deploy-pages.yml` builds and deploys the frontend from `main`. In the repository settings, set **Pages > Source** to **GitHub Actions**, then add:

- Repository variable `VITE_SUPABASE_URL`
- Repository secret `VITE_SUPABASE_ANON_KEY`

Do not select **Deploy from a branch**. That mode serves the source `index.html` directly, so React and TypeScript components will not be bundled and the page will appear blank.

GitHub Pages hosts the storefront only. The Express API still needs a Node-compatible host, and `VITE_API_URL` should point to that deployed API. The workflow creates a `404.html` SPA fallback so product and collection URLs continue to work on refresh.
