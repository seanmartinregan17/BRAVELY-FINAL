// Simple API request helper for demo purposes
export async function apiRequest(method: string = 'GET', url: string, data?: any) {
  // In production, this would come from environment variables
  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://your-app.railway.app/api'  // Replace with your Railway URL
    : '/api';
  
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data && method !== 'GET') {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE_URL}${url}`, config);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}