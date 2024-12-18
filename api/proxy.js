export default async function handler(req, res) {
  // Handle OPTIONS request for CORS preflight (needed for browsers to check permissions)
  if (req.method === 'OPTIONS') {
    // Log the incoming OPTIONS request to see what's happening
    console.log('CORS Preflight request received');
    
    res.setHeader('Access-Control-Allow-Origin', '*');  // Allow all origins (replace '*' with your domain if needed)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end(); // End the preflight request successfully
  }

  // Handle POST request
  if (req.method === 'POST') {
    // Log the incoming POST request
    console.log('POST request received with body:', req.body);

    res.setHeader('Access-Control-Allow-Origin', '*');  // Allow all origins (replace '*' with your domain if needed)
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

      // Check if Botpress responded successfully
      if (!response.ok) {
        return res.status(500).json({ error: 'Failed to fetch response from Botpress' });
      }

      // Parse the Botpress response and return it to the front-end
      const data = await response.json();
      console.log('Botpress response:', data);

      return res.status(200).json(data);
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Error forwarding request to Botpress' });
    }
  }

  // If any other method is used, respond with Method Not Allowed
  return res.status(405).json({ error: 'Method not allowed' });
}
