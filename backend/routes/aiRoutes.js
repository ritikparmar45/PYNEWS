import express from 'express';
import { generateCaption } from '../controllers/aiController.js';

const router = express.Router();

router.post('/generate-caption', generateCaption);

export default router;
