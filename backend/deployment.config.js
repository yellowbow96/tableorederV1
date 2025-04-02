module.exports = {
  // Server configuration
  server: {
    port: process.env.PORT || 3001,
    host: process.env.HOST || '0.0.0.0'
  },

  // MongoDB configuration
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant_db',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Additional production MongoDB options
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 50
    }
  },

  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH'],
    credentials: true
  },

  // Security configuration
  security: {
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    },
    helmet: {
      contentSecurityPolicy: true,
      crossOriginEmbedderPolicy: true
    }
  },

  // Logging configuration
  logging: {
    level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
    format: 'combined'
  }
};