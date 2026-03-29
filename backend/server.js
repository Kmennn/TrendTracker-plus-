import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { VertexAI } from '@google-cloud/vertexai';
import admin from 'firebase-admin';
import cron from 'node-cron';
import summarizeVideo from './videoSummarizer.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 3001;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// Global state for services
let db = null;
let generativeModel = null;
let servicesInitialized = false;

const initServices = async () => {
  try {
    console.log("Attempting to initialize external services (Firebase, VertexAI)...");
    
    // Check for credentials presence to avoid immediate crash if sensible
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && !process.env.PROJECT_ID) {
        console.warn("Warning: Missing credentials. Running in limited mode.");
    }

    const vertexAI = new VertexAI({ project: process.env.PROJECT_ID, location: process.env.LOCATION });
    
    if (admin.apps.length === 0) {
        admin.initializeApp();
    }
    db = admin.firestore();
    generativeModel = vertexAI.getGenerativeModel({ model: 'gemini-1.5-flash-001' });
    
    servicesInitialized = true;
    console.log("External services initialized successfully.");
    
    // Start Cron Jobs only if initialized
    startCronJobs();
    
  } catch (error) {
    console.error("Failed to initialize external services. Running in offline/limited mode.", error.message);
  }
};

const SYMBOLS = ['IBM', 'TSLA', 'AAPL', 'GOOG', 'MSFT', 'AMZN', 'TSCO.LON', 'RELIANCE.BSE'];

const fetchAndStoreStockData = async () => {
    if (!generativeModel || !db) return;
    console.log('Fetching latest stock data using Gemini...');
    try {
    const prompt = `You are a financial data API. For the following stock symbols, provide the current market price and the percentage change since the last market close. The symbols are: ${SYMBOLS.join(', ')}. Provide the output in a single, clean, parsable JSON array. Each object in the array must correspond to a symbol and have these exact keys: "symbol", "price" (as a number), "percentChange" (as a number), and "volume" (as a string like "1.2M" or "15.3K"). Do not include any introductory text, markdown formatting, or backticks. The output should be only the raw JSON array.`;

    const result = await generativeModel.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const stockDataArray = JSON.parse(jsonString);

    if (stockDataArray && Array.isArray(stockDataArray)) {
        for (const stockData of stockDataArray) {
        if (stockData.symbol) {
            const cleanData = {
            ...stockData,
            price: parseFloat(stockData.price) || 0,
            percentChange: parseFloat(stockData.percentChange) || 0,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
            };
            await db.collection('stocks').doc(stockData.symbol).set(cleanData, { merge: true });
        }
        }
        console.log('Stock data updated successfully from Gemini for:', SYMBOLS.join(', '));
    } else {
        console.log('Failed to parse stock data from Gemini. Response was not an array.');
    }
    } catch (error) {
    console.error('Error fetching or processing stock data from Gemini:', error);
    }
};

const startCronJobs = () => {
    // Initial fetch
    fetchAndStoreStockData();
    cron.schedule('*/15 * * * *', fetchAndStoreStockData);
    cron.schedule('* * * * *', async () => {
        console.log('Checking for triggered alerts...');
        // Alert logic here
    });
};

// --- API Endpoints ---

// Video Summarization Endpoint
app.post('/api/summarize-video', async (req, res) => {
    const { videoUrl, prompt } = req.body;

    if (!videoUrl || !prompt) {
        return res.status(400).json({ error: 'Missing videoUrl or prompt in request body' });
    }

    try {
        const summary = await summarizeVideo(videoUrl, prompt);
        res.json({ summary });
    } catch (error) {
        console.error('Error in /api/summarize-video:', error);
        res.status(500).json({ error: error.message || 'Failed to summarize video.' });
    }
});

// Get all stock data
app.get('/api/stocks', async (req, res) => {
    if (!db) return res.status(503).json({ error: "Database not initialized (check credentials)" });
    try {
    const snapshot = await db.collection('stocks').orderBy('lastUpdated', 'desc').get();
    const stocks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(stocks);
    } catch (error) {
    console.error('Error fetching stocks:', error);
    res.status(500).json({ error: 'Failed to fetch stocks.' });
    }
});

// Get single stock data
app.get('/api/stocks/:symbol', async (req, res) => {
    if (!db) return res.status(503).json({ error: "Database not initialized" });
    try {
        const symbol = req.params.symbol;
        const doc = await db.collection('stocks').doc(symbol).get();
        if (!doc.exists) {
            // Initial fetch might be happening, wait a moment and retry once.
            await new Promise(resolve => setTimeout(resolve, 2000));
            const docAfterWait = await db.collection('stocks').doc(symbol).get();
            if (!docAfterWait.exists) {
                return res.status(404).json({ error: 'Stock not found after retry' });
            }
            res.json({ id: docAfterWait.id, ...docAfterWait.data() });
        } else {
            res.json({ id: doc.id, ...doc.data() });
        }
    } catch (error) {
        console.error(`Error fetching stock ${req.params.symbol}:`, error);
        res.status(500).json({ error: 'Failed to fetch stock data.' });
    }
});

app.get('/api/social-movers', (req, res) => {
    const movers = [
        { name: 'Tesla', symbol: 'TSLA', change: '+5.2%', sentiment: 'positive', volume: '1.2M' },
        { name: 'Apple', symbol: 'AAPL', change: '-2.1%', sentiment: 'negative', volume: '800k' },
        { name: 'Google', symbol: 'GOOG', change: '+1.8%', sentiment: 'positive', volume: '650k' },
    ];
    res.json(movers);
});

app.get('/api/daily-trends', (req, res) => {
    const trends = [
        { keyword: 'AI Regulation', volume: '300K' },
        { keyword: 'Quantum Computing', volume: '150K' },
        { keyword: 'Next.js 15', volume: '120K' },
    ];
    res.json(trends);
});

// --- Middleware ---
const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    // Ensure admin is initialized (it might be lazy loaded)
    if (admin.apps.length === 0) { 
        // This is a safety check; ideally initServices handles this at startup
        return res.status(503).json({ error: 'Service unavailable' });
    }
    
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

// --- Alerts API ---
let mockAlerts = [];

// Apply authentication to all alert routes
app.use('/api/alerts', authenticateUser);

app.post('/api/alerts', async (req, res) => {
  const { symbol, condition, value } = req.body;
  const userId = req.user.uid; // Securely obtained from token

  if (!symbol || !value) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newAlert = {
    id: db ? undefined : `alert_${Date.now()}`,
    userId,
    symbol,
    condition,
    value,
    createdAt: new Date().toISOString()
  };

  try {
    if (db) {
      const docRef = await db.collection('alerts').add(newAlert);
      res.json({ id: docRef.id, ...newAlert });
    } else {
      mockAlerts.unshift(newAlert);
      res.json(newAlert);
    }
  } catch (error) {
    console.error('Error creating alert:', error);
    res.status(500).json({ error: 'Failed to create alert' });
  }
});

app.get('/api/alerts', async (req, res) => {
  const userId = req.user.uid;
  try {
    if (db) {
      const snapshot = await db.collection('alerts')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();
      const alerts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(alerts);
    } else {
      const userAlerts = mockAlerts.filter(a => a.userId === userId);
      res.json(userAlerts);
    }
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

app.delete('/api/alerts/:id', async (req, res) => {
  const { id } = req.params;
  const userId = req.user.uid;

  try {
    if (db) {
      const docRef = db.collection('alerts').doc(id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
          return res.status(404).json({ error: 'Alert not found' });
      }
      
      // Ownership check
      if (doc.data().userId !== userId) {
          return res.status(403).json({ error: 'Forbidden' });
      }

      await docRef.delete();
      res.json({ success: true });
    } else {
      const alert = mockAlerts.find(a => a.id === id);
      if (!alert) return res.status(404).json({ error: 'Alert not found' });
      if (alert.userId !== userId) return res.status(403).json({ error: 'Forbidden' });

      mockAlerts = mockAlerts.filter(a => a.id !== id);
      res.json({ success: true });
    }
  } catch (error) {
    console.error('Error deleting alert:', error);
    res.status(500).json({ error: 'Failed to delete alert' });
  }
});

// --- Start Listening ---
app.listen(port, async () => {
    console.log(`Server is running on http://localhost:${port}`);
    await initServices();
});