# HKGD Deployment Guide

## Prerequisites
- Cloudflare account with domain configured
- Wrangler CLI installed (`npm install -g wrangler`)

## Step 1: Create D1 Database

```bash
cd worker
wrangler d1 create hkgd-db
```

Copy the `database_id` from the output and update `worker/wrangler.toml`:
```toml
database_id = "YOUR_ACTUAL_D1_DATABASE_ID"
```

## Step 2: Initialize Database Schema

```bash
# Create tables
wrangler d1 execute hkgd-db --remote --file=./schema.sql

# Import existing data
wrangler d1 execute hkgd-db --remote --file=./seed.sql
```

## Step 3: Set Secrets

```bash
wrangler secret put JWT_SECRET
# Enter your JWT secret (e.g., a random 32+ character string)

wrangler secret put ADMIN_PASSWORD
# Enter your admin password
```

## Step 4: Deploy the Worker (API)

```bash
wrangler deploy
```

Note the worker URL (e.g., `hkgd-api.YOUR-SUBDOMAIN.workers.dev`)

## Step 5: Deploy Frontend to Cloudflare Pages

Option A - Via CLI:
```bash
cd ../frontend
npm run build
wrangler pages deploy dist --project-name=hkgd-frontend
```

Option B - Via Cloudflare Dashboard:
1. Connect your GitHub repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set build output directory: `dist`
4. Deploy

## Step 6: Configure Custom Domain

1. Go to Cloudflare Pages > hkgd-frontend > Custom domains
2. Add `hkgdl.dpdns.org`

## Step 7: Route API to Worker

In Cloudflare Dashboard:
1. Go to Workers Routes
2. Add route: `hkgdl.dpdns.org/api/*`
3. Select worker: `hkgd-api`

## Local Development

```bash
# Terminal 1 - API (with local D1)
cd worker
wrangler dev --local

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Environment Variables

Production secrets are set via `wrangler secret put`.
Local development uses `.dev.vars` file:

```env
JWT_SECRET=your-local-jwt-secret
ADMIN_PASSWORD=your-local-password
```
