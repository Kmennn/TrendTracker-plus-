import express from 'express';
import cors from 'cors';
import { getJson } from 'serpapi';
import dotenv from 'dotenv';
import { VertexAI } from '@google-cloud/vertexai';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Initialize Vertex AI
const vertexAI = new VertexAI({ 
  project: process.env.PROJECT_ID, 
  location: process.env.LOCATION 
});
const model = 'gemini-1.5-flash-001';

const generativeModel = vertexAI.getGenerativeModel({
  model: model,
  generationConfig: {
    'maxOutputTokens': 8192,
    'temperature': 1,
    'topP': 0.95,
  },
});

app.get('/api/daily-trends', async (req, res) => {
  try {
    const response = await getJson({
      engine: 'google_trends_trending_now',
      frequency: 'daily',
      api_key: process.env.SERPAPI_API_KEY,
    });
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from SerpApi.', details: error.message });
  }
});

app.post('/api/generate-chat-response', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const request = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    };

    const result = await generativeModel.generateContent(request);
    const response = result.response;
    const generatedText = response.candidates[0].content.parts[0].text;
    res.json({ response: generatedText });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Failed to generate chat response.', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
