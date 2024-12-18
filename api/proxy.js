// /api/proxy.js

export default async function handler(req, res) {
  // Allow preflight requests (OPTIONS method)
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://cben29.github.io');  // Your frontend's domain
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');  // Allowed methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');  // Allowed headers
    res.setHeader('Access-Control-Max-Age', '86400');  // Cache the preflight request for 24 hours
    return res.status(200).end();  // Respond with 200 OK to the OPTIONS request
  }

  // Handle POST request (this is where you process the user's question)
  if (req.method === 'POST') {
    try {
      const { text } = req.body;  // Get the user's question from the request body

      // Send the request to the Botpress webhook
      const response = await fetch('https://webhook.botpress.cloud/e775a3c6-d30b-439b-afdd-0535b4edb42f', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),  // Send the question as JSON to Botpress
      });

      // Parse the response from Botpress
      const data = await response.json();

      // Set CORS headers for the response (this is for the actual POST request)
      res.setHeader('Access-Control-Allow-Origin', 'https://cben29.github.io');  // Allow the frontend domain
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');  // Allowed methods
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');  // Allowed headers

      // Send the response back to the frontend with the Botpress answer
      return res.status(200).json({ text: data.text || "No response from Botpress" });

    } catch (error) {
      console.error('Error handling request:', error);
      return res.status(500).json({ error: 'Failed to fetch response from Botpress' });
    }
  }

  // If it's an unsupported HTTP method, return Method Not Allowed
  return res.status(405).json({ error: 'Method Not Allowed' });
}
