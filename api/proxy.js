// /api/proxy.js

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://cben29.github.io');  // Your front-end domain
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');  // Allow GET, POST, OPTIONS methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');  // Allow the Content-Type header
  
  // Handle preflight (OPTIONS) request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();  // Return OK status for OPTIONS requests
  }

  // Handle POST request
  if (req.method === 'POST') {
    try {
      const { text } = req.body; // Get the question from the frontend
      
      // Make the request to the webhook (replace YOUR_WEBHOOK_URL with your actual webhook URL)
      const response = await fetch('https://webhook.botpress.cloud/e775a3c6-d30b-439b-afdd-0535b4edb42f', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),  // Send the user question to the webhook
      });

      const data = await response.json();  // Parse the response from the webhook

      // Return the data back to the front-end
      return res.status(200).json({ text: data.text || "No response from webhook" });
    } catch (error) {
      console.error('Error processing the request:', error);
      return res.status(500).json({ error: 'Error handling request' });
    }
  }

  // Handle any other HTTP methods
  return res.status(405).json({ error: 'Method Not Allowed' });
}
