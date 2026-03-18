# AI News Aggregation & Broadcasting Dashboard

A full-stack web application that automatically collects AI-related news from multiple RSS feeds, deduplicates them, and displays them in a modern dashboard. Users can mark news as favorites and simulate broadcasting via Email, LinkedIn, and WhatsApp.

## 🚀 Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, React Router, Axios, Lucide React
- **Backend**: Node.js, Express, Mongoose, rss-parser
- **Database**: MongoDB
- **Deployment**: Docker, Docker Compose

## 🛠️ Setup & Execution

The easiest way to run the application is using Docker.

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) & Docker Compose installed on your system.

### Running with Docker

1. Open your terminal in the project root directory.
2. Run the following command:
   ```bash
   docker-compose up --build
   ```
3. Access the application:
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:5000/api

### Running Locally (Without Docker)

You will need an active MongoDB instance (e.g., `mongodb://localhost:27017/ai_news`).

**Backend Setup:**
```bash
cd backend
npm install
npm run dev
```

**Frontend Setup:**
```bash
cd frontend
npm install
npm run dev
```

## 🔌 API Endpoints

- `GET /api/news` - Fetch all ingested news articles.
- `POST /api/news/fetch` - Trigger news ingestion from RSS feeds and store deduplicated records.
- `POST /api/favorites` - Add a news article to your favorites list.
- `GET /api/favorites` - Fetch all favorite articles.
- `DELETE /api/favorites/:id` - Remove an article from favorites.
- `POST /api/broadcast` - Simulate broadcasting an article to a specific platform.

## 📁 Architecture Overview

- **Ingestion Service**: Uses `rss-parser` to periodically fetch or manually ingest news from top AI sources (TechCrunch, Hacker News, Reddit ML, etc.).
- **Deduplication**: Before inserting an article into MongoDB, the backend checks if the URL or exact Title already exists in the `News` collection.
- **Frontend Dashboard**: A responsive, card-structured UI allowing single-click Favorites and hover-to-share Broadcast simulations.

Enjoy curating AI News!
