import express from 'express';
import cors from 'cors';
import { getJson } from 'serpapi';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 3001;

app.use(cors());

app.get('/api/daily-trends', async (req, res) => {
  try {
    const response = await getJson({
      engine: 'google_trends_trending_now',
      frequency: 'daily',
      api_key: process.env.SERPAPI_API_KEY, // This should now have the correct value
    });
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from SerpApi.', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
