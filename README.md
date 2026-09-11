# Product Leadership Studio — CRM

> Full-stack CRM and marketing website for Pranjal Sarkar's Product Leadership Studio.

## Tech Stack

| Layer    | Technology                           |
| -------- | ------------------------------------ |
| Frontend | React 18 · TypeScript · Vite         |
| Backend  | Express.js · Node.js 18+ (ESM)       |
| Database | MongoDB (Mongoose)                   |
| Auth     | JWT (single admin)                   |
| Email    | Nodemailer (Gmail SMTP)              |
| Deploy   | Vercel (frontend) · Render (backend) |

## Project Structure

```
pranjalsarkar-r/
├── .github/workflows/        # CI & deploy GitHub Actions
├── docker/                   # Dockerfiles & docker-compose
├── docs/                     # Architecture, API ref, deployment
├── backend/                  # Express REST API
│   ├── src/
│   │   ├── config/           # DB, CORS, Sentry, env
│   │   ├── constants/        # Shared constants
│   │   ├── controllers/      # Route controllers
│   │   ├── errors/           # AppError + error codes
│   │   ├── jobs/             # Background tasks
│   │   ├── middlewares/       # Auth, error handler, rate limiter
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # Express routes + aggregator
│   │   ├── services/         # Business logic
│   │   ├── upload/           # Cloud file uploads
│   │   ├── utils/            # Helpers (email, logger)
│   │   ├── validators/       # Request validators
│   │   ├── app.js            # Express app setup
│   │   └── server.js         # Server entrypoint
│   └── tests/                # Unit + integration tests
└── frontend/                 # React SPA
    ├── src/
    │   ├── admin/            # Admin panel feature
    │   ├── api/              # HTTP client + API modules
    │   ├── components/       # Layout, sections, UI
    │   ├── constants/        # App-wide constants
    │   ├── context/          # React context providers
    │   ├── hooks/            # Custom hooks
    │   ├── lib/              # Library utilities
    │   ├── pages/            # Page components
    │   ├── routes/           # Route definitions
    │   ├── styles/           # CSS files
    │   ├── utils/            # Helper functions
    │   ├── assets/           # Static assets (logos)
    │   └── __tests__/        # Component tests
    └── public/               # Static public assets
```

## Getting Started

### Prerequisites

- Node.js ≥ 18
- MongoDB (local or Atlas)

### Installation

```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### Development

```bash
# Start backend (port 5000)
cd backend && npm run dev

# Start frontend (port 5173)
cd frontend && npm run dev
```

### Docker

```bash
cd docker && docker compose up --build
```

## Documentation

- [Architecture](docs/architecture.md)
- [API Reference](docs/api-reference.md)
- [Deployment](docs/deployment.md)
- [AI Prompt Notes](docs/ai-prompt-notes.md)

## License

[MIT](LICENSE)
