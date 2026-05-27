# GrowthForge AI

**Analyze. Improve. Grow.**

AI-powered business growth dashboard for local businesses. Scan websites, discover weaknesses, compare competitors, receive AI recommendations, and track leads.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, Vite, Tailwind CSS, Framer Motion, Recharts, Axios |
| Backend | Node.js, Express, MongoDB, JWT, Socket.io |
| Features | Website audit, SEO analyzer, performance metrics, competitor comparison, CRM leads, AI chatbot, PDF reports |

## Project Structure

```
growthforge/
├── client/                 # React frontend
│   └── src/
│       ├── components/     # UI, layout, AI chatbot
│       ├── pages/          # Landing, auth, onboarding
│       ├── dashboard/      # Dashboard pages
│       ├── charts/         # Recharts components
│       ├── services/       # API & Socket.io
│       └── context/        # Auth context
└── server/                 # Express API
    ├── models/             # User, Report, Lead, Message, Competitor
    ├── routes/
    ├── controllers/
    ├── middleware/
    └── services/           # Scanner, AI, PDF
```

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### 1. Backend

```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT_SECRET

npm install
npm run dev
```

Server runs at `http://localhost:5000`

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

App runs at `http://localhost:5173`

### Environment Variables

**server/.env**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/growthforge
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
OPENAI_API_KEY=sk-...   # Optional — uses smart fallbacks without it
```

## Features

- **Landing Page** — Hero, features, pricing, FAQ, testimonials
- **Auth** — Register, login, Google sign-in (demo), forgot password
- **Onboarding** — 4-step wizard with animated scan
- **Dashboard** — Stats, SEO/traffic charts, competitor radar
- **Website Audit** — Broken links, meta, headings, images, mobile
- **SEO Analyzer** — Score breakdown with recommendations
- **Performance** — FCP, LCP, TTI metrics and warnings
- **Competitors** — Side-by-side comparison table
- **Lead CRM** — Add/edit/delete with status pipeline
- **AI Assistant** — Floating chat + full page, context-aware
- **PDF Reports** — Downloadable growth reports

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/google` | Google OAuth |
| POST | `/api/reports/generate` | Run full website scan |
| GET | `/api/reports/latest` | Get latest report |
| GET | `/api/reports/:id/pdf` | Download PDF |
| CRUD | `/api/leads` | Lead management |
| POST | `/api/ai/chat` | AI assistant |

## Design

- Dark SaaS theme (`#0f172a` background, `#6366f1` accent)
- Glassmorphism cards, smooth Framer Motion animations
- Responsive with sticky sidebar
- Loading skeletons and animated progress bars

## License

MIT
