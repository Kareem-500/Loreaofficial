# LORÉA

LORÉA is a React 19, TypeScript, and Vite fashion storefront. The repository includes a static GitHub Pages frontend, Supabase client integration and PostgreSQL migrations, plus an optional Express/SQLite API for deployments that host a Node server.

## Local development

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env.local` to enable Supabase Auth and catalog features. Without those values, the storefront can still be previewed against its bundled catalog. The local Express API serves at port 3000. Set `VITE_API_URL` in production builds to the API origin (including when frontend and API share an origin) so the frontend knows the API is available.

## Supabase setup

Apply the SQL files in `supabase/migrations/` in filename order using the Supabase CLI or SQL editor. They create the commerce schema, triggers, RPCs, RLS and storage policies. The later security-hardening migration removes direct client order writes, limits RPC execution to authenticated users, and closes anonymous chat table writes. Review migrations against the target project's existing schema before applying them.

Set the Supabase Auth site's production URL and allowed redirect URLs for both the Pages URL and any future custom domain. New signups receive the `customer` role. Provision the first administrator through the Supabase SQL editor by updating that user's `profiles.role` to `admin`; never accept a role from signup metadata or the browser.

The Express API is a separate server deployment and is not deployed by GitHub Pages. It uses local SQLite and must be hosted on a persistent Node-capable platform for its API routes. GitHub Pages cannot run those routes; point `VITE_API_URL` at the separately hosted HTTPS API if using it. Do not set that variable to a Pages URL. Configure the API host's `CORS_ALLOWED_ORIGINS` with the exact Pages/custom-domain origins allowed to call it.

## GitHub Pages

The workflow in `.github/workflows/deploy-pages.yml` builds the Vite frontend and publishes `dist/` using GitHub's Pages deployment actions. Repository subpaths are inferred from the repository name. Configure these GitHub Actions **Variables** for the frontend:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY` (public browser key; RLS must protect every table)
- `VITE_SITE_URL` (optional override; by default derived from the Pages repository URL)
- `VITE_BASE_PATH` (optional override; set to `/` for a custom root domain)
- `VITE_API_URL` (optional HTTPS URL for a separately hosted Express API)

The build copies `index.html` to `404.html` for direct route loads and refreshes, and adds `.nojekyll`. For a custom domain, set `VITE_SITE_URL` to the HTTPS origin, set the `VITE_BASE_PATH` Actions variable to `/`, configure the domain in GitHub Pages, and add the corresponding Supabase Auth redirect URL.

## Environment variables

`.env.example` contains placeholders only. `VITE_*` values are public and compiled into browser assets. Server credentials such as `AUTH_SECRET`, `ADMIN_INITIAL_PASSWORD`, SMTP credentials, AI/payment credentials, and Supabase service credentials must only be configured in the server host's secret store. Never add real values to frontend source, Pages artifacts, or GitHub Actions YAML. The service role key is not needed by the Pages frontend.

## Build and checks

```sh
npm run build:frontend
npm run build
npm run lint
```

`build:frontend` is the GitHub Pages artifact build. `build` also bundles the optional Express server for a Node host. For the server, set a strong `AUTH_SECRET`; configure `ADMIN_INITIAL_EMAIL` and a unique 16+ character `ADMIN_INITIAL_PASSWORD` only for first-admin bootstrap. Existing non-admin accounts are never promoted by bootstrap. No test admin/customer accounts are seeded.

## Security and production limits

- Supabase public access depends on applying the migrations and keeping RLS enabled. The browser must only use the publishable key.
- The Pages workflow publishes a static frontend; it does not provide order processing, email delivery, rate limiting, or the Express routes. Configure and operate the needed backend separately before accepting real orders.
- The SQLite API is a local/small deployment option and needs persistent storage and operational backups; Supabase PostgreSQL migrations do not automatically migrate SQLite data.
- Previously committed bootstrap passwords existed in repository history. They were removed from the current code; rotate/revoke any credentials that may have been reused. History rewriting is not part of this deployment because it would require a coordinated force push.
- Password recovery and email delivery require valid Supabase Auth email configuration, or a separately hosted API with its mail provider configured.
