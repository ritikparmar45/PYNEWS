import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

import newsRoutes from './routes/newsRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import broadcastRoutes from './routes/broadcastRoutes.js';

// Routes
app.use('/api/news', newsRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/broadcast', broadcastRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
