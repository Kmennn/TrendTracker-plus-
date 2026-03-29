# TrendTracker+ 🚀

> **Real-time trend intelligence platform** — discover, analyze, and forecast emerging trends across social media, financial markets, and the web.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?style=for-the-badge&logo=github)](https://kmennn.github.io/TrendTracker-plus-/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-10-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Screenshots](#-screenshots)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Backend API](#-backend-api)
- [Deployment](#-deployment)
- [Scripts Reference](#-scripts-reference)
- [Contributing](#-contributing)

---

## 🌐 Overview

**TrendTracker+** is a full-stack, real-time trend intelligence dashboard that empowers creators, marketers, and analysts to:

- **Track viral trends** across Google Trends, social media, and news in one unified hub
- **Compare keywords** side-by-side with advanced charting and historical data
- **View regional breakdowns** on an interactive 3D globe map
- **Monitor stock movers** correlating financial sentiment with social buzz
- **Set smart price alerts** that trigger when market conditions are met
- **Generate AI-powered insights** through a built-in conversational AI assistant
- **Export professional reports** in PDF and CSV formats

The platform features an immersive 3D landing page built with Three.js and React Three Fiber, a glassmorphic dark-mode dashboard, PWA support, and a Node.js backend powered by Google Vertex AI and Firebase.

---

## 🎯 Live Demo

**👉 [https://kmennn.github.io/TrendTracker-plus-/](https://kmennn.github.io/TrendTracker-plus-/)**

> To access the full dashboard, create a free account or use the demo credentials.

---

## ✨ Features

### 🏠 Landing Page
- Immersive **3D scene** built with React Three Fiber (`Three.js`) featuring a procedural iridescent hummingbird, dense floral environment, and cinematic purple atmospheric lighting
- **Glassmorphism pill navigation** with smooth Lenis scroll and Framer Motion animations
- Fully responsive hero layout with asymmetric composition and scroll indicator

### 📊 Dashboard
- **Live trend cards** with momentum indicators and keyword volume metrics
- **Animated data nebula** background visualization
- **Radar scanner** for emerging trend detection
- Integrated **stock tickers** for social media movers (TSLA, AAPL, GOOG, MSFT, etc.)
- **Command palette** (⌘K / Ctrl+K) for quick navigation

### 🔍 Trend Explorer
- **Keyword Comparison** — side-by-side trend analysis with stacked/line charts, correlation scores, and audience overlap
- **Trend Details** — deep-dive page with share metrics, community detection, influencer identification, and audience demographics
- **Google Trends Integration** — embedded Google Trends widget with topic category filters
- **Trend Radar** — radar chart visualization showing multi-dimensional trend scoring (momentum, virality, longevity, reach)

### 🗺️ Regional Map
- Interactive **3D globe** (`react-globe.gl`) showing regional trend distribution
- Click-through **region detail modals** with localized keyword breakdowns
- Country-level heatmap overlays

### 📈 Markets Page
- Real-time **stock cards** with price, percentage change, and volume
- **Social movers list** correlating trending topics with stock movement
- **Correlated charts** showing sentiment vs price action

### 🔔 Alerts System
- Create **price alert conditions** per stock symbol (above/below thresholds)
- Alerts persisted to **Firestore** (per authenticated user)
- **Cron-based** backend checker (runs every 60 seconds)
- Full CRUD — create, list, and delete alerts with ownership verification

### 🤖 AI Chat
- Conversational interface powered by **Google Vertex AI (Gemini 1.5 Flash)**
- Context-aware trend analysis and market commentary
- Streaming response support

### 📄 Reports Module
- Generate **PDF and CSV reports** for keyword trends, market data, and demographics
- Scheduled report history
- Shareable report links

### 👤 User & Admin
- **UserSettings** — profile management, notification preferences, theme toggle
- **AdminPanel** — user management, system statistics, and content moderation tools
- **Saved** — bookmark trends for later review

### 🔐 Authentication
- **Firebase Authentication** (email/password + protected routes)
- JWT-based backend auth middleware
- Public → redirect to dashboard, Private → redirect to login

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Vite + React 18)                  │
│                                                                     │
│  ┌──────────┐  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │ Landing  │  │  Dashboard  │  │   Trend       │  │  Markets   │  │
│  │  Page    │  │  /alerts    │  │  Explorer     │  │  /reports  │  │
│  │ (3D/R3F) │  │  /saved     │  │  /radar       │  │  /admin    │  │
│  └──────────┘  └─────────────┘  │  /comparison  │  └────────────┘  │
│                                  │  /map         │                  │
│                                  └──────────────┘                  │
│                                                                     │
│  State: Zustand (auth, UI)   │  Data: TanStack Query               │
│  Animations: Framer Motion   │  Forms: React Hook Form + Zod        │
│  3D: Three.js + R3F + Drei   │  Routing: React Router v6           │
└──────────────────┬──────────────────────────────────────────────────┘
                   │ HTTP / REST API  (proxied via Vite dev server)
                   │
┌──────────────────▼──────────────────────────────────────────────────┐
│                    BACKEND (Node.js / Express — port 3001)          │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Routes                                                      │   │
│  │  POST /api/summarize-video   (Vertex AI video summarization)  │   │
│  │  GET  /api/stocks            (All stocks from Firestore)      │   │
│  │  GET  /api/stocks/:symbol    (Single stock)                   │   │
│  │  GET  /api/social-movers     (Social sentiment movers)        │   │
│  │  GET  /api/daily-trends      (Trending keywords)              │   │
│  │  CRUD /api/alerts            (Auth-protected alert CRUD)      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌──────────────────┐   ┌─────────────────────────────────────┐   │
│  │  Google Vertex AI │   │  Firebase Admin SDK (Firestore Auth)│   │
│  │  Gemini 1.5 Flash │   │  Collections: stocks, alerts        │   │
│  └──────────────────┘   └─────────────────────────────────────┘   │
│                                                                     │
│  Cron Jobs:                                                         │
│    • Every 15 min  → fetchAndStoreStockData() via Gemini            │
│    • Every 1 min   → checkTriggeredAlerts()                         │
└─────────────────────────────────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────────────┐
│                    FIREBASE (Client SDK)                            │
│  • Auth — email/password sign-in/sign-up                           │
│  • Realtime Database — live alert state sync                        │
│  • Firestore — stock data, user alerts                              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | 18 | UI framework |
| **Vite** | 5 | Build tool & dev server |
| **React Router** | v6 | Client-side routing |
| **Framer Motion** | 12 | Animations & transitions |
| **Three.js** | 0.182 | 3D rendering engine |
| **@react-three/fiber** | 8 | React renderer for Three.js |
| **@react-three/drei** | 9 | Three.js helper abstractions |
| **Tailwind CSS** | 3 | Utility-first CSS |
| **Zustand** | 5 | Lightweight global state |
| **TanStack Query** | 5 | Server-state caching & fetching |
| **React Hook Form** | 7 | Form state management |
| **Zod** | 4 | Schema validation |
| **Recharts** | 2 | SVG charting library |
| **Chart.js** | 4 | Canvas charting |
| **react-globe.gl** | 2 | 3D globe visualisation |
| **Lenis** | 1 | Smooth scroll |
| **Lucide React** | 0.563 | Icon library |
| **Firebase** | 10 | Auth + Realtime DB |
| **Axios** | 1.7 | HTTP client |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express** | REST API server |
| **Google Vertex AI** | Gemini 1.5 Flash (stock data, video summarization) |
| **Firebase Admin SDK** | Firestore access & JWT verification |
| **node-cron** | Scheduled stock refresh & alert checking |
| **dotenv** | Environment configuration |

### Dev Tooling
| Tool | Purpose |
|---|---|
| **Vitest** | Unit & integration testing |
| **@testing-library/react** | Component testing |
| **ESLint** | Code linting |
| **Prettier** | Code formatting |
| **TypeScript** | Type checking (`tsc --noEmit`) |
| **vite-plugin-pwa** | Progressive Web App support |
| **gh-pages** | GitHub Pages deployment |

---

## 📁 Project Structure

```
TrendTracker-plus-/
│
├── 📄 index.html                    # App entry point
├── 📄 main.jsx                      # React root mount
├── 📄 App.jsx                       # Router + providers setup
├── 📄 App.css / index.css           # Global styles
├── 📄 vite.config.js                # Build & alias configuration
├── 📄 tailwind.config.js            # Tailwind customization
├── 📄 vitest.config.js              # Test configuration
├── 📄 tsconfig.json                 # TypeScript config
├── 📄 firebase.json                 # Firebase hosting config
├── 📄 .env.example                  # Environment variable template
│
├── 📂 pages/                        # Route-level page components
│   ├── LandingPage.jsx              # Public landing page (3D hero)
│   ├── LoginPage.jsx                # Authentication — sign in
│   ├── SignupPage.jsx               # Authentication — register
│   ├── Dashboard.jsx                # Main analytics hub
│   ├── TrendDetails.jsx             # Deep-dive on a single trend
│   ├── TrendRadar.jsx               # Radar chart trend scoring
│   ├── KeywordComparison.jsx        # Side-by-side keyword analysis
│   ├── RegionalMap.jsx              # Globe-based regional map
│   ├── AIChat.jsx                   # Vertex AI conversational assistant
│   ├── AlertsPage.jsx               # Alert management UI
│   ├── Saved.jsx                    # Bookmarked trends
│   ├── ReportsModule.jsx            # PDF/CSV report generation
│   ├── GoogleTrends.jsx             # Embedded Google Trends widget
│   ├── MarketsPage.jsx              # Stock market overview
│   ├── AdminPanel.jsx               # Admin user & content control
│   └── UserSettings.jsx             # Profile & preferences
│
├── 📂 components/                   # Shared UI components
│   ├── AppShell.jsx                 # Layout shell (sidebar + header)
│   ├── Header.jsx                   # Top navigation bar
│   ├── Sidebar.jsx                  # Left navigation panel
│   ├── BottomNav.jsx                # Mobile bottom navigation
│   ├── TrendCard.jsx                # Trend result card
│   ├── KeywordCard.jsx              # Keyword metric card
│   ├── StatCard.jsx                 # Statistic display card
│   ├── StockCard.jsx                # Market stock card
│   ├── RadarScanner.jsx             # Animated radar component
│   ├── DataNebula.jsx               # Background particle effect
│   ├── Globe.jsx                    # 3D globe wrapper
│   ├── TrendAtlas.jsx               # Atlas overlay chart
│   ├── AlertsManager.jsx            # Alert CRUD UI
│   ├── CommandPalette.jsx           # ⌘K search/command overlay
│   ├── FilterModal.jsx              # Search/filter dialog
│   ├── SearchBar.jsx                # Global search input
│   ├── NotificationPanel.jsx        # Notification drawer
│   ├── Analytics.jsx                # Analytics chart panel
│   ├── AudienceDemographics.jsx     # Demographics visualization
│   ├── CommunityDetection.jsx       # Community graph analysis
│   ├── InfluencerIdentification.jsx # Influencer ranking component
│   ├── CorrelatedChart.jsx          # Multi-dataset correlation chart
│   ├── SocialMoversList.jsx         # Social sentiment movers
│   ├── Chart.jsx                    # Generic chart wrapper
│   ├── AnimatedNumber.jsx           # Counter animation utility
│   ├── Skeleton.jsx                 # Loading skeleton screens
│   ├── EmptyState.jsx               # Empty/zero-state display
│   ├── ErrorBoundary.jsx            # React error boundary
│   ├── Button.jsx                   # Reusable button component
│   ├── ShareModal.jsx               # Share/export modal
│   ├── RegionDetailModal.jsx        # Region click modal
│   ├── ProtectedLayout.jsx          # Auth guard wrapper
│   └── landing/                     # Landing page 3D components
│       ├── CosmicScene.jsx          # Three.js scene root
│       ├── PremiumBird.jsx          # Iridescent hummingbird (GLSL shaders)
│       ├── FloralDepth.jsx          # Dense floral 3D environment
│       ├── TrendConstellation.jsx   # Constellation data viz
│       ├── IntelligenceSwarm.jsx    # Particle swarm effect
│       ├── DashboardShowcase.jsx    # Animated dashboard preview
│       ├── LandingCanvas.jsx        # R3F canvas wrapper
│       ├── MagneticButton.jsx       # Magnetic hover button
│       ├── StaggeredText.jsx        # Text reveal animation
│       └── ...                      # Other visual effect components
│
├── 📂 contexts/
│   └── AuthContext.jsx              # Firebase auth React context
│
├── 📂 stores/                       # Zustand global stores
│   ├── useAuthStore.js              # Auth state (user, tokens)
│   └── useUIStore.js                # UI state (sidebar, theme, modals)
│
├── 📂 hooks/                        # Custom React hooks
│   ├── useAlerts.js                 # Alert CRUD operations
│   ├── useStocks.js                 # Stock data fetching
│   ├── useScrollCamera.js           # Scroll-linked 3D camera
│   ├── useCursorParallax.js         # Mouse parallax effects
│   ├── useDebounce.js               # Input debounce utility
│   └── useMediaQuery.js             # Responsive breakpoint detection
│
├── 📂 lib/
│   └── queryClient.js               # TanStack Query client config
│
├── 📂 providers/
│   ├── SmoothScrollProvider.jsx     # Lenis smooth scroll
│   ├── MotionConfigProvider.jsx     # Framer Motion global config
│   └── CanvasProvider.jsx           # R3F canvas context
│
├── 📂 motion/                       # Framer Motion animation presets
│
├── 📂 backend/                      # Node.js Express API server
│   ├── server.js                    # Main server + all routes
│   ├── videoSummarizer.js           # Vertex AI video summarization helper
│   ├── package.json                 # Backend dependencies
│   └── .env                         # Backend secrets (not committed)
│
├── 📂 tests/                        # Vitest test suites
├── 📂 assets/                       # Static assets (images, icons)
├── 📂 public/                       # Public static files (manifest, favicon)
│
├── 🐍 youtube_collector.py          # YouTube trend data collector
├── 🐍 trend_forecaster.py           # ML-based trend forecasting
├── 🐍 virality_predictor.py         # Virality scoring model
├── 🐍 extract_text_features.py      # NLP text feature extraction
├── 🐍 extract_audio_features.py     # Audio feature extraction
├── 🐍 extract_visual_features.py    # Video/image feature extraction
└── 📄 requirements.txt              # Python dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and npm v9+
- **Git**
- A **Firebase** project (for auth + database)
- A **Google Cloud** project with **Vertex AI** enabled (for backend AI features)

### 1. Clone the Repository

```bash
git clone https://github.com/Kmennn/TrendTracker-plus-.git
cd TrendTracker-plus-
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### 4. Configure Environment Variables

Copy the example and fill in your credentials:

```bash
cp .env.example .env
```

See the [Environment Variables](#-environment-variables) section for details.

### 5. Run the Development Server

**Frontend** (port 5173):
```bash
npm run dev
```

**Backend** (port 3001) — in a separate terminal:
```bash
npm run server
```

The Vite dev server automatically proxies `/api/*` requests to `http://localhost:3001`, so you only need to open `http://localhost:5173`.

---

## 🔐 Environment Variables

### Frontend (`.env` in project root)

| Variable | Description |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase Web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_DATABASE_URL` | Firebase Realtime Database URL |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `VITE_API_BASE_URL` | Backend API base URL (default: `http://localhost:3001/api`) |
| `VITE_ENABLE_3D` | Enable/disable 3D scenes (`true`/`false`) |
| `VITE_ENABLE_DEVTOOLS` | Enable React Query devtools |

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `PROJECT_ID` | Google Cloud project ID |
| `LOCATION` | Vertex AI region (e.g., `us-central1`) |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to GCP service account JSON key |

---

## 🌐 Backend API

The Express server runs on **port 3001** and exposes the following endpoints:

### Public Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/summarize-video` | Summarize a video URL using Vertex AI |
| `GET` | `/api/stocks` | Get all tracked stocks from Firestore |
| `GET` | `/api/stocks/:symbol` | Get a single stock (e.g., `TSLA`) |
| `GET` | `/api/social-movers` | Get social sentiment movers |
| `GET` | `/api/daily-trends` | Get daily trending keywords |

### Authenticated Endpoints (requires `Authorization: Bearer <firebase-id-token>`)

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/alerts` | Create a new price alert |
| `GET` | `/api/alerts` | List all alerts for the current user |
| `DELETE` | `/api/alerts/:id` | Delete an alert (ownership enforced) |

### Cron Jobs

| Schedule | Action |
|---|---|
| Every **15 minutes** | Fetch & store latest stock prices using Gemini AI |
| Every **1 minute** | Check triggered alerts for all users |

---

## 📦 Deployment

### GitHub Pages (Frontend)

The project is pre-configured for GitHub Pages deployment using `gh-pages`.

```bash
npm run deploy
```

This command will:
1. Run `npm run build` to produce the `dist/` folder
2. Push the `dist/` contents to the `gh-pages` branch of your repository

> **Note:** The Vite base path is set to `/TrendTracker-plus-/` to match the GitHub Pages URL. Change this in `vite.config.js` if your repo name differs.

**Live URL:** `https://kmennn.github.io/TrendTracker-plus-/`

### Backend Deployment

The backend Node.js server can be hosted separately on platforms like:
- **Google Cloud Run** — recommended (same GCP project as Vertex AI)
- **Railway** or **Render**
- **Heroku**

Ensure the `GOOGLE_APPLICATION_CREDENTIALS`, `PROJECT_ID`, and `LOCATION` environment variables are set in your hosting environment.

---

## 📜 Scripts Reference

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Start Vite dev server (port 5173) |
| `build` | `npm run build` | Production build to `dist/` |
| `preview` | `npm run preview` | Preview production build locally |
| `server` | `npm run server` | Start the backend Express server |
| `deploy` | `npm run deploy` | Build + deploy to GitHub Pages |
| `test` | `npm run test` | Run Vitest test suite |
| `test:watch` | `npm run test:watch` | Run tests in watch mode |
| `test:ui` | `npm run test:ui` | Open Vitest UI in browser |
| `test:coverage` | `npm run test:coverage` | Generate coverage report |
| `lint` | `npm run lint` | Run ESLint |
| `lint:fix` | `npm run lint:fix` | Auto-fix lint errors |
| `format` | `npm run format` | Format all files with Prettier |
| `type-check` | `npm run type-check` | Run TypeScript type checking |

---

## 🧪 Python ML Scripts

The repository includes Python data science scripts for advanced trend analysis:

| Script | Description |
|---|---|
| `youtube_collector.py` | Collects YouTube video metadata and trend signals |
| `trend_forecaster.py` | Forecasts trend trajectory using time-series modeling |
| `virality_predictor.py` | Scores content for virality potential |
| `extract_text_features.py` | NLP feature extraction from text content |
| `extract_audio_features.py` | Audio feature extraction from video files |
| `extract_visual_features.py` | Visual feature extraction from thumbnails/frames |

**Install Python dependencies:**
```bash
pip install -r requirements.txt
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. Create a **feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. Open a **Pull Request**

Please ensure your code passes linting (`npm run lint`) and type-checking (`npm run type-check`) before submitting.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/Kmennn">Kmennn</a></p>
  <p>
    <a href="https://kmennn.github.io/TrendTracker-plus-/">Live Demo</a> •
    <a href="https://github.com/Kmennn/TrendTracker-plus-/issues">Report Bug</a> •
    <a href="https://github.com/Kmennn/TrendTracker-plus-/issues">Request Feature</a>
  </p>
</div>