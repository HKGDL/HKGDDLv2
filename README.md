# HKGD Demon List

Hong Kong Geometry Dash Community Demon List - Track the hardest Extreme Demon levels beaten by HKGD members.

## Project Structure

```
├── api/           # Backend API (Node.js/Express)
└── frontend/      # Frontend (React/TypeScript/Vite)
```

## Tech Stack

### Backend
- Node.js + Express
- SQLite (better-sqlite3)
- JWT Authentication
- Rate Limiting
- Helmet.js (Security)

### Frontend
- React 19 + TypeScript
- Vite
- Tailwind CSS
- Radix UI Components

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Backend Setup

```bash
cd api
npm install
cp .env.example .env
# Edit .env with your settings
npm start
```

The API server runs on port 19132 (HTTPS) or 8081 (HTTP).

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on http://localhost:5173

## Environment Variables

### Backend (.env)
```env
JWT_SECRET=your-jwt-secret
ADMIN_PASSWORD=your-admin-password
ALLOWED_ORIGINS=http://localhost:5173,https://your-domain.com
SSL_KEY_PATH=./certs/key.pem
SSL_CERT_PATH=./certs/cert.pem
HTTPS_PORT=19132
TRUST_PROXY=false
```

### Frontend (.env)
```env
VITE_API_URL=https://your-api-domain.com/api
```

## Features

- **Demon List** - Browse and search extreme demon levels
- **Platformer List** - Platformer extreme demons
- **Record Submission** - Submit your completions
- **Admin CMS** - Manage levels, records, and submissions
- **AREDL Sync** - Sync with Another Relative Extreme Demon List
- **Changelog** - Track all list changes

## API Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | /api/levels | Get all levels |
| GET | /api/levels/:id | Get level by ID |
| POST | /api/levels | Create level (admin) |
| PUT | /api/levels/:id | Update level (admin) |
| DELETE | /api/levels/:id | Delete level (admin) |
| POST | /api/levels/:id/records | Add record (admin) |
| GET | /api/members | Get all members |
| GET | /api/changelog | Get changelog |
| POST | /api/pending-submissions | Submit record |
| POST | /api/auth/login | Admin login |

## License

ISC
