# Backend Deployment Guide

This guide outlines the steps to deploy the restaurant order management backend to production.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB instance (production database)
- Environment variables configuration

## Deployment Steps

### 1. Environment Setup

Copy the `.env` file and update it with production values:

```env
PORT=3001
MONGODB_URI=your_production_mongodb_uri
CORS_ORIGIN=your_production_frontend_url
NODE_ENV=production
```

### 2. MongoDB Configuration

1. Set up a production MongoDB instance (e.g., MongoDB Atlas)
2. Update `MONGODB_URI` in `.env` with your production connection string
3. Ensure proper database user permissions are set
4. Enable MongoDB security features (authentication, encryption)

### 3. Security Measures

The following security measures are already configured in `deployment.config.js`:

- Helmet.js for HTTP headers security
- Rate limiting to prevent abuse
- CORS configuration for frontend access
- Error handling that doesn't expose sensitive information

### 4. Production Deployment

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Start the production server:
   ```bash
   yarn start
   ```

### 5. Health Checks

Verify the deployment by checking:

1. MongoDB connection is successful
2. API endpoints are accessible
3. CORS is working with the frontend
4. Rate limiting is active

### 6. Monitoring

Monitor the application for:

- Server logs for errors
- MongoDB connection status
- API response times
- Rate limit hits

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| PORT | Server port | Yes |
| MONGODB_URI | MongoDB connection string | Yes |
| CORS_ORIGIN | Frontend URL | Yes |
| NODE_ENV | Environment (production) | Yes |

## Security Considerations

- Keep environment variables secure
- Regularly update dependencies
- Monitor for security vulnerabilities
- Implement proper backup strategies
- Use SSL/TLS for all connections