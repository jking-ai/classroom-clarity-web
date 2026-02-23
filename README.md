# Classroom Clarity Web

Frontend for [Classroom Clarity RAG](https://github.com/jking-ai/classroom-clarity-rag) — a semantic Q&A system for school documents. Built with Astro, Tailwind CSS v4, and Material Symbols.

**Pages:**
- **Ask** (`/`) — Chat-style Q&A with AI-generated answers and source citations
- **Documents** (`/library`) — Browse, search, and manage uploaded documents
- **Upload** (`/upload`) — Drag-and-drop PDF upload with title and description

**Features:**
- Dark/light mode toggle (persists via localStorage)
- Responsive top navigation with mobile hamburger menu
- Source cards showing document title and page number

---

## Local Development (Full Stack)

The Astro dev server proxies `/api/*` requests to the Spring Boot backend, handling API key injection and CORS automatically. No Firebase emulators needed for local development.

### Prerequisites

- **Node.js 20+**
- **Docker** (for PostgreSQL with pgvector)
- The [classroom-clarity-rag](https://github.com/jking-ai/classroom-clarity-rag) repo cloned alongside this one

### 1. Start the backend

From the `classroom-clarity-rag` directory:

```bash
# Start PostgreSQL + Spring Boot (auto-detects GCP credentials for real AI)
bash scripts/start.sh
```

This starts:
- PostgreSQL with pgvector on port 5432
- Spring Boot API on port 8080
- Profile `local-ai` if `.env` has GCP credentials, otherwise `local` with mock AI

See the [RAG repo's local dev guide](https://github.com/jking-ai/classroom-clarity-rag/blob/main/docs/local-dev-guide.md) for full setup instructions.

### 2. Start the frontend

From this directory:

```bash
npm install
npm run dev
```

The Astro dev server starts at **http://localhost:4321**.

### 3. Verify

| URL | Expected |
|-----|----------|
| http://localhost:4321/ | Q&A page with welcome state and example question chips |
| http://localhost:4321/library | Document table populated from the backend API |
| http://localhost:4321/upload | Upload form — submit a PDF and verify it appears in the library |

Click an example question on the Ask page to test the full pipeline: frontend → Vite proxy → Spring Boot → Vertex AI → response with sources.

### Dev proxy configuration

The Vite dev server proxy is configured in `astro.config.mjs`:
- Forwards all `/api/*` requests to `http://localhost:8080`
- Injects the `X-API-Key` header (`dev-local-key-changeme`)
- Overrides the `Origin` header to satisfy backend CORS

---

## Production (Firebase Hosting)

For production deployment, Firebase Hosting serves the static build and a Cloud Function (`apiProxy`) proxies API requests to the backend.

```bash
# Build the Astro site
npm run build

# Build the Firebase function
cd functions && npm run build && cd ..

# Deploy
firebase deploy
```

The proxy function target URL is configured via `functions/.env` (`API_TARGET`).

---

## Project Structure

```
src/
├── components/
│   └── TopNav.astro          # Shared top navigation (nav links, dark/light toggle, mobile menu)
├── layouts/
│   └── Layout.astro          # Base HTML layout (fonts, theme init script)
├── pages/
│   ├── index.astro           # Q&A chat page
│   ├── library.astro         # Document library with search/sort
│   └── upload.astro          # Document upload form
└── styles/
    └── global.css            # Tailwind v4 config, theme colors, dark mode variant

functions/                     # Firebase Cloud Function (Express API proxy)
├── src/index.ts
└── .env                       # API_TARGET for production backend URL

astro.config.mjs               # Astro + Vite config (dev proxy, Tailwind plugin)
firebase.json                  # Firebase Hosting rewrites + Functions config
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Astro 5](https://astro.build) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Icons | [Material Symbols](https://fonts.google.com/icons) |
| Fonts | Lexend (headings), Noto Sans (body) |
| Hosting | Firebase Hosting |
| API Proxy | Firebase Cloud Functions (Express) |
| Backend | [classroom-clarity-rag](https://github.com/jking-ai/classroom-clarity-rag) (Spring Boot + Vertex AI) |
