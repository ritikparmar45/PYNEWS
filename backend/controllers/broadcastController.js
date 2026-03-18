import BroadcastLog from '../models/BroadcastLog.js';

export const simulateBroadcast = async (req, res) => {
  try {
    const { newsId, platform } = req.body;
    
    if (!newsId || !platform) {
      return res.status(400).json({ message: 'newsId and platform are required' });
    }

    const log = await BroadcastLog.create({
      newsId,
      platform,
      status: 'Success'
    });

    res.status(200).json({ message: `Successfully simulated broadcast on ${platform}`, log });
  } catch (error) {
    res.status(500).json({ message: 'Error simulating broadcast' });
  }
};
