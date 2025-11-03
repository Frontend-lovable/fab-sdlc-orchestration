const BASE_URL_ENDPOINT = "http://deluxe-sdlc-dev-79296622.us-east-1.elb.amazonaws.com:8000"
// const BASE_URL_ENDPOINT = "http://deluxe-internet-300914418.us-east-1.elb.amazonaws.com:8000"
// const BASE_URL_ENDPOINT = "http://localhost:8000"

// API Configuration
// Uses proxy endpoints configured in vite.config.ts
export const API_CONFIG = {
  // Base URL for all API endpoints (proxied through /api)
  BASE_URL: `${BASE_URL_ENDPOINT}/api/v1`,
  
  // Chat API URL (proxied through /api)
  CHATBOT_API_URL: `${BASE_URL_ENDPOINT}/api/v1/chat`,
  
  // Request timeout in milliseconds
  TIMEOUT: 30000
};

// Instructions for making the API accessible:
// 1. Expose your API through a public load balancer or API Gateway
// 2. Add CORS headers to allow browser requests:
//    - Access-Control-Allow-Origin: * (or your domain)
//    - Access-Control-Allow-Methods: POST, OPTIONS
//    - Access-Control-Allow-Headers: Content-Type
// 3. Update the CHATBOT_API_URL above with your public endpoint