// /api/proxy.js

export default async function handler(req, res) {
  // Allow preflight requests (OPTIONS method)
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://cben29.github.io');  // Allow requests from your frontend URL
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');  // Allow GET, POST, and OPTIONS methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');  // Allow the Content-Type header
    return res.status(200).end();  // Respond with 200 for OPTIONS requests
  }

  // Handle POST request
  if (req.method === 'POST') {
    try {
      // Parse the question from the front-end
      const { text } = req.body;

      // Make the request to the Botpress webhook
      const response = await fetch('https://webhook.botpress.cloud/e775a3c6-d30b-439b-afdd-0535b4edb42f', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),  // Send the user's question to Botpress
      });

      const data = await response.json();  // Parse the response from Botpress

      // Set CORS headers for the response
      res.setHeader('Access-Control-Allow-Origin', 'https://cben29.github.io');  // Allow your frontend domain
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');  // Allow the appropriate methods
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');  // Allow Content-Type header

      // Send the response back to the client
      return res.status(200).json({ text: data.text || "No response from webhook" });

    } catch (error) {
      console.error('Error processing request:', error);
      return res.status(500).json({ error: 'Error handling request' });
    }
  }

  // Handle any other HTTP methods
  return res.status(405).json({ error: 'Method Not Allowed' });
}
