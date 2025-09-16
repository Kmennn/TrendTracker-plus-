import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { VertexAI } from '@google-cloud/vertexai';
import admin from 'firebase-admin';
import cron from 'node-cron';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 3001;

// --- Middleware ---
app.use(cors());
app.use(express.json());

const startServer = async () => {
  try {
    // --- Initializations ---
    const vertexAI = new VertexAI({ project: process.env.PROJECT_ID, location: process.env.LOCATION });
    admin.initializeApp();
    const db = admin.firestore();
    const generativeModel = vertexAI.getGenerativeModel({ model: 'gemini-1.5-flash-001' });

    // --- Data Fetching & Processing Jobs ---
    const SYMBOLS = ['IBM', 'TSLA', 'AAPL', 'GOOG', 'MSFT', 'AMZN', 'TSCO.LON', 'RELIANCE.BSE'];

    // Function to fetch and store stock data
    const fetchAndStoreStockData = async () => {
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
        // Re-throw the error to be caught by the outer catch block
        throw error;
      }
    };

    // --- Perform an initial fetch on startup AND WAIT FOR IT ---
    await fetchAndStoreStockData();

    // --- Schedule Cron Jobs ---
    cron.schedule('*/15 * * * *', fetchAndStoreStockData);
    cron.schedule('* * * * *', async () => {
      console.log('Checking for triggered alerts...');
      // ... (alert logic remains the same)
    });

    // --- API Endpoints ---
    // Get all stock data
    app.get('/api/stocks', async (req, res) => {
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
    app.get('/api/stocks/:symbol([A-Za-z0-9\\.-]+)', async (req, res) => {
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

    // ... other endpoints ...
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

    // --- Start Listening ---
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });

  } catch (error) {
    console.error("Failed to initialize and start backend:", error);
    // Fallback server for initialization errors
    app.use((req, res, next) => {
      res.status(503).send('Backend server is not available due to an initialization error.');
    });
    app.listen(port, () => {
      console.log(`Fallback server running on http://localhost:${port}`);
    });
  }
};

startServer();