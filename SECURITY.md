# Security

This document describes the security posture of **Prompt Maker** and steps taken to keep secrets safe.

## API key handling (critical)

- The API key is stored **only** in `.env.local` (or Vercel Environment Variables), which is **gitignored** and never committed.
- The key is read **exclusively server-side** inside `app/api/generate/route.ts` via `process.env.API_KEY`.
- **Never expose the key to the browser.** The client only calls the local `/api/generate` route; it never receives the key.
- Error messages returned to the browser are **sanitized** to redact any `sk-` / bearer / `api_key` patterns and the exact key value (see `sanitize()` in `app/api/generate/route.ts`).

## Gitignore (prevents accidental commit)

`.gitignore` ignores:
- `.env`, `.env.local`, `.env.*.local` — environment / secrets
- `*.key`, `*.pem` — key material
- `secrets.*`
- `node_modules/`, `.next/`, `out/`, `build/` — build artifacts
- `.vercel/`
- `*.tsbuildinfo`, `next-env.d.ts`

## Verified audit (before push)

The files that git will commit contain **no** API key or `sk-` secrets. Verification commands used:

```bash
# Is the .env.local ignored?
git check-ignore -v .env.local

# Scan every file that would be committed for the real key
git ls-files --others --exclude-standard | xargs grep -rl "<your-key>"

# Scan for any sk- secrets in source
grep -rEn "sk-[A-Za-z0-9]{8,}" --include="*.ts" --include="*.tsx" .
```

## The repository is project-scoped

The git repository for this project is initialized **inside** the project folder (`prompt-maker/.git`). It does **not** include the user's home directory or personal files.

## Deploying to Vercel

Do **not** put the key in the repository. Instead, set it as a Vercel Environment Variable:

1. Push the project to GitHub (repo contains no secrets).
2. Import the repo into Vercel.
3. In Vercel → Project → **Settings → Environment Variables**, add:
   - `API_KEY` = your JembatanAI key
   - `API_BASE_URL` = `https://freeai.jembatanai.com`
   - `API_MODELS` = comma-separated model list (optional)
4. Redeploy.

The app reads these from `process.env` at runtime on Vercel's servers.
