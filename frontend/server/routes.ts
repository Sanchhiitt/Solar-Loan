import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Proxy routes to Python backend
  const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5500';

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', service: 'Frontend API Proxy' });
  });

  // Proxy qualification check to Python backend
  app.post('/api/check-qualification', async (req, res) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/check-qualification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      res.json(data);
    } catch (error) {
      console.error('Backend proxy error:', error);
      res.status(500).json({
        error: 'Failed to connect to backend service',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Proxy stats endpoint to Python backend
  app.get('/api/stats', async (req, res) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/stats`);
      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      res.json(data);
    } catch (error) {
      console.error('Backend stats proxy error:', error);
      res.status(500).json({
        error: 'Failed to connect to backend service',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Proxy electricity data endpoint to your app.py backend
  app.get('/api/electricity-data', async (req, res) => {
    try {
      const zipCode = req.query.zip;
      const response = await fetch(`${BACKEND_URL}/electricity-data?zip=${zipCode}`);
      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      res.json(data);
    } catch (error) {
      console.error('Electricity data proxy error:', error);
      res.status(500).json({
        error: 'Failed to connect to electricity data service',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Proxy demographic data endpoint to your app.py backend
  app.get('/api/demographic-data', async (req, res) => {
    try {
      const zipCode = req.query.zip;
      const response = await fetch(`${BACKEND_URL}/demographic-data?zip=${zipCode}`);
      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      res.json(data);
    } catch (error) {
      console.error('Demographic data proxy error:', error);
      res.status(500).json({
        error: 'Failed to connect to demographic data service',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Proxy vantage score endpoint to your app.py backend
  app.get('/api/vantage-score', async (req, res) => {
    try {
      const zipCode = req.query.zip;
      const response = await fetch(`${BACKEND_URL}/vantage-score?zip=${zipCode}`);
      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      res.json(data);
    } catch (error) {
      console.error('Vantage score proxy error:', error);
      res.status(500).json({
        error: 'Failed to connect to vantage score service',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
