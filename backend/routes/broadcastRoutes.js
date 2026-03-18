import express from 'express';
import { simulateBroadcast } from '../controllers/broadcastController.js';

const router = express.Router();

router.post('/', simulateBroadcast);

export default router;
