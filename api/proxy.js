export default async function handler(req, res) {
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    // Log the incoming OPTIONS request to help with debugging
    console.log('Handling CORS preflight request');

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'https://cben29.github.io');  // Allow only from your GitHub Pages
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    return res.status(200).end(); // Respond successfully to preflight request
  }

  // Handle POST request for forwarding to Botpress
  if (req.method === 'POST') {
    // Log the incoming POST request data to debug
    console.log('Handling POST request with body:', req.body);

    // Set CORS headers for POST request
    res.setHeader('Access-Control-Allow-Origin', 'https://cben29.github.io');  // Allow only from your GitHub Pages
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    try {
      const userQuestion = req.body.text;  // Extract the user's question
      console.log('User question:', userQuestion);

      // Forward the request to the Botpress webhook
      const response = await fetch('https://webhook.botpress.cloud/e775a3c6-d30b-439b-afdd-0535b4edb42f', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: userQuestion }),
      });

      // If Botpress responded with an error, handle it
      if (!response.ok) {
        return res.status(500).json({ error: 'Failed to fetch response from Botpress' });
      }

      // Get the Botpress response and return it to the front-end
      const data = await response.json();
      console.log('Botpress response:', data);
      return res.status(200).json(data);

    } catch (error) {
      console.error('Error occurred:', error);
      return res.status(500).json({ error: 'Error forwarding request to Botpress' });
    }
  }

  // If any other HTTP method is used, respond with Method Not Allowed
  return res.status(405).json({ error: 'Method not allowed' });
}
