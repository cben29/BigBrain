// /api/proxy.js

export default async function handler(req, res) {
  // Allow requests from your GitHub Pages domain
  res.setHeader('Access-Control-Allow-Origin', 'https://cben29.github.io'); // Allow your domain here
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST'); // Allow only GET and POST methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow Content-Type header

  // Handle preflight requests (OPTIONS request)
  if (req.method === 'OPTIONS') {
    // Respond with status 200 to handle preflight request
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    // Your webhook handling logic
    try {
      const { text } = req.body; // Get the question from the frontend
      const response = await fetch('YOUR_WEBHOOK_URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      return res.status(200).json({ text: data.answer || "No response from webhook" }); // Adjust based on webhook response
    } catch (error) {
      return res.status(500).json({ error: 'Error handling request' });
    }
  }

  // Handle other methods (if needed)
  res.status(405).json({ error: 'Method Not Allowed' });
}
