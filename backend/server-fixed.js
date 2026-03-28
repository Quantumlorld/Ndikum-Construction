const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const WebSocket = require('ws');
const http = require('http');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const rateLimit = require('express-rate-limit');
const compression = require('compression');

// Load environment variables
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// In-memory storage (replace with database in production)
let productionData = {
  isRunning: false,
  outputRate: 2847,
  efficiency: 94,
  activeMachines: 8,
  totalMachines: 10,
  status: 'stopped',
  lastUpdate: new Date().toISOString()
};

let metrics = {
  dailyOutput: 2847,
  monthlyRevenue: 35000000,
  systemEfficiency: 94,
  productionAccuracy: 99.8,
  uptime: 98.5
};

let users = [
  {
    id: '1',
    name: 'System Administrator',
    email: 'admin@ndikum.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 'admin123'
    role: 'admin',
    permissions: ['read', 'write', 'admin']
  }
];

let sessions = new Map();
let connectedClients = new Set();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here';

// WebSocket connection handling
wss.on('connection', (ws) => {
  const clientId = uuidv4();
  connectedClients.add(ws);
  
  console.log(`WebSocket client connected: ${clientId}`);
  
  // Send initial data
  ws.send(JSON.stringify({
    type: 'production_update',
    data: productionData,
    timestamp: new Date().toISOString()
  }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received WebSocket message:', data);
      
      // Broadcast to all connected clients
      connectedClients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            ...data,
            timestamp: new Date().toISOString()
          }));
        }
      });
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });

  ws.on('close', () => {
    connectedClients.delete(ws);
    console.log(`WebSocket client disconnected: ${clientId}`);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    connectedClients.delete(ws);
  });
});

// Broadcast function
function broadcast(message) {
  const messageStr = JSON.stringify({
    ...message,
    timestamp: new Date().toISOString()
  });
  
  connectedClients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageStr);
    }
  });
}

// Simulate real-time production updates
setInterval(() => {
  if (productionData.isRunning) {
    // Random fluctuations in production data
    productionData.outputRate = 2847 + Math.floor(Math.random() * 200 - 100);
    productionData.efficiency = Math.min(99, Math.max(85, 94 + Math.floor(Math.random() * 6 - 3)));
    productionData.lastUpdate = new Date().toISOString();
    
    broadcast({
      type: 'production_update',
      data: productionData
    });
  }
}, 5000); // Update every 5 seconds

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: 'Access token required' 
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      error: 'Invalid token' 
    });
  }
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: process.uptime()
    }
  });
});

// Authentication routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Create session
    const sessionId = uuidv4();
    sessions.set(sessionId, {
      userId: user.id,
      loginTime: new Date(),
      lastActivity: new Date()
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          permissions: user.permissions
        },
        token,
        sessionId
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.post('/api/auth/logout', authenticateToken, (req, res) => {
  try {
    const sessionId = req.body.sessionId;
    if (sessionId) {
      sessions.delete(sessionId);
    }
    
    res.json({
      success: true,
      data: { message: 'Logged out successfully' }
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.get('/api/auth/profile', authenticateToken, (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Production routes
app.get('/api/production', authenticateToken, (req, res) => {
  try {
    res.json({
      success: true,
      data: [{
        id: '1',
        timestamp: productionData.lastUpdate,
        outputRate: productionData.outputRate,
        efficiency: productionData.efficiency,
        activeMachines: productionData.activeMachines,
        totalMachines: productionData.totalMachines,
        status: productionData.status
      }]
    });
  } catch (error) {
    console.error('Production data error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.get('/api/production/metrics', authenticateToken, (req, res) => {
  try {
    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Metrics error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.post('/api/production/start', authenticateToken, (req, res) => {
  try {
    productionData.isRunning = true;
    productionData.status = 'running';
    productionData.activeMachines = 8;
    productionData.lastUpdate = new Date().toISOString();
    
    broadcast({
      type: 'production_update',
      data: productionData
    });
    
    res.json({
      success: true,
      data: { message: 'Production started successfully' }
    });
  } catch (error) {
    console.error('Start production error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.post('/api/production/stop', authenticateToken, (req, res) => {
  try {
    productionData.isRunning = false;
    productionData.status = 'stopped';
    productionData.activeMachines = 0;
    productionData.lastUpdate = new Date().toISOString();
    
    broadcast({
      type: 'production_update',
      data: productionData
    });
    
    res.json({
      success: true,
      data: { message: 'Production stopped successfully' }
    });
  } catch (error) {
    console.error('Stop production error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.post('/api/production/pause', authenticateToken, (req, res) => {
  try {
    productionData.isRunning = false;
    productionData.status = 'maintenance';
    productionData.lastUpdate = new Date().toISOString();
    
    broadcast({
      type: 'production_update',
      data: productionData
    });
    
    res.json({
      success: true,
      data: { message: 'Production paused successfully' }
    });
  } catch (error) {
    console.error('Pause production error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Error reporting
app.post('/api/errors', (req, res) => {
  try {
    const errorReport = req.body;
    console.error('Client error report:', errorReport);
    
    // In production, save to database or logging service
    // For now, just log to console
    
    res.json({
      success: true,
      data: { message: 'Error report received' }
    });
  } catch (error) {
    console.error('Error reporting error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Analytics endpoints
app.post('/api/analytics', (req, res) => {
  try {
    const analyticsData = req.body;
    console.log('Analytics event:', analyticsData);
    
    // In production, save to analytics database
    // For now, just log to console
    
    res.json({
      success: true,
      data: { message: 'Analytics data received' }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.post('/api/analytics/session', (req, res) => {
  try {
    const sessionData = req.body;
    console.log('Session data:', sessionData);
    
    // In production, save to analytics database
    // For now, just log to console
    
    res.json({
      success: true,
      data: { message: 'Session data received' }
    });
  } catch (error) {
    console.error('Session analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`🚀 Ndikum Construction Backend Server running on port ${PORT}`);
  console.log(`📡 WebSocket server ready for connections`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
