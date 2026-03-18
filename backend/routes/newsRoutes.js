import express from 'express';
import { getNews, fetchNews } from '../controllers/newsController.js';

const router = express.Router();

router.get('/', getNews);
router.post('/fetch', fetchNews);

export default router;
