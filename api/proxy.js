// api/proxy.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const userQuestion = req.body.text;

    try {
      const response = await fetch('https://webhook.botpress.cloud/e775a3c6-d30b-439b-afdd-0535b4edb42f', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: userQuestion }),
      });

      if (!response.ok) {
        return res.status(response.status).json({ error: 'Error from Botpress webhook' });
      }

      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
