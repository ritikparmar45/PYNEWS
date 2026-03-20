# PYNEWS: AI News Aggregation Dashboard

A full-stack news aggregation platform designed specifically for Artificial Intelligence updates. The application automates the ingestion of top AI RSS feeds, standardizes and deduplicates the data, and provides an interactive UI for saving and sharing key articles.

---

## 🏗️ Architecture

The project follows a standard decoupled **MERN** architecture. The codebase is organized as a monorepo containing two distinct modules:
- `/backend`: Node.js/Express API with centralized business logic (controllers, models, services).
- `/frontend`: Client-side React application managed via Vite with Tailwind CSS.

### Tech Stack
- **Frontend Engine**: React 19, Vite, Tailwind CSS 3 
- **Backend API**: Node.js 18+, Express.js 5
- **Database**: MongoDB (via Mongoose)
- **External Integrations**: `@google/generative-ai` (Gemini 1.5 Flash), `rss-parser`

---

## ✨ Features

1. **AI LinkedIn Caption Generator** _(Core Requirement)_
   - Integrates the Gemini API to analyze article contents and dynamically draft professional 3-sentence social media captions directly from the dashboard.
2. **Automated News Ingestion**
   - Headless background service built on `rss-parser` that fetches payloads from 9 major AI publications (TechCrunch, arXiv, PapersWithCode, Reddit ML, etc.).
3. **Data Deduplication Engine**
   - Prevents database bloating by verifying exact URL matches and performing case-insensitive title comparisons before insertion.
4. **Favorites System**
   - Click-to-save feature persistently storing articles to the database for subsequent reading.
5. **Broadcast Simulation**
   - Allows users to mock-broadcast articles to LinkedIn, WhatsApp, and Email. Action states are permanently recorded in a `BroadcastLog` schema.

---

## 🛠️ Local Development Setup

> **Note**: For local development speed, the backend utilizes `mongodb-memory-server` if no `MONGO_URI` is provided. This allows zero-configuration execution without a local MongoDB service.

### 1. Clone the repository
```bash
git clone https://github.com/ritikparmar45/PYNEWS.git
cd PYNEWS
```

### 2. Start the Backend Service
```bash
cd backend
npm install
npm run dev
```
The server will initialize on `http://localhost:5000`.

### 3. Start the Frontend Client
Open a second terminal window:
```bash
cd frontend
npm install
npm run dev
```
The client will initialize on `http://localhost:5173`.

---

## 📡 Core API Reference

| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/news` | Retrieve the latest aggregated articles. |
| `POST` | `/api/news/fetch` | Trigger the ingestion service to pull new RSS payloads. |
| `POST` | `/api/favorites` | Bookmark an article ID to the user's favorites. |
| `GET` | `/api/favorites` | Retrieve the user's bookmarked collection. |
| `DELETE` | `/api/favorites/:id` | Remove a bookmarked article. |
| `POST` | `/api/broadcast` | Log a platform broadcasting action. |
| `POST` | `/api/ai/generate-caption` | Execute the Gemini model against an article ID. |

---

*This project was engineered to demonstrate proficient full-stack capabilities, API building, and third-party data handling within a Node.js ecosystem.*
