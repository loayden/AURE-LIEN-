---
name: bout-deploy
description: Ship BOUT changes safely. Use when asked to push, deploy, promote, or release the BOUT luxury store. Encodes the verify-clean-push-promote pipeline.
---

# BOUT Deploy Pipeline

Follow these steps in order. Never skip verification. Never commit secrets.

## 1. Verify (local)

1. `npx tsc --noEmit` — must be clean.
2. `npm run build` — must exit 0. If the failure mentions `next/font` module resolution, clear `.next` and rebuild (known Turbopack cache issue, not a code problem).
3. `npm test` — unit tests must pass.
4. Start prod server on a free port, smoke-test: `/`, `/shop`, `/api/products`, `/api/health`. Expect 200s.
5. `grep -c "Dynamic server usage" <server-log>` — must be 0.

## 2. Test-data discipline

- Mark all test entities clearly (`ADMINCHECK`, `QA`, `Test`, `*-test@example.com`).
- Clean Mongo + Upstash Redis + local `data/*.json` + uploaded files after every test.
- Verify counts return to baseline (products 79, apps 8, users/orders per baseline).
- NEVER touch real customer orders, real applications, or real users. Check IDs/dates first.
- Kill test servers by PID (`lsof -i :PORT`), never leave strays. Port 3001 is not ours — leave it alone.

## 3. Secrets

- Never print, commit, or paste secret values. Scan staged diffs before commit.
- `.env.local` is gitignored and must never be staged.
- Vercel env: read names only (`vercel env ls`). `vercel env pull` masks production secrets as `"[SENSITIVE]"` — do not mistake that for the value.
- Only ever ADD new keys (e.g. `CRON_SECRET`); never rotate existing ones without explicit instruction.

## 4. Push

- Stage only intended source files. Exclude `.next/`, `next-env.d.ts`, `tsconfig.tsbuildinfo`, `data/`, dead `scripts/*`.
- Commit message style: `feat: ...` / `fix: ...`, concise.
- `git push origin HEAD` (branch `codex/competitive-10-10-phase`).

## 5. Promote (standing instruction)

- Wait for the Preview build (`vercel ls` → Ready).
- `yes | vercel promote <preview-url> --timeout 5m` (rebuilds with production env).
- Verify production: new routes return 200/403 correctly, `/api/health` shows 79 products + mongo, fresh logs show zero `Dynamic server usage` errors.

## 6. Report

Commit hash, deploy URLs, what was verified, what still needs the owner (Stripe/Paymob keys, Google OAuth origin, VAPID keys, PR merges). Never claim production is updated without curl-proof.
