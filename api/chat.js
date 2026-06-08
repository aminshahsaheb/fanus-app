export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, system } = req.body;

    const groqMessages = [
      { role: 'system', content: system },
      ...messages
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': Bearer ${process.env.GROQ_API_KEY}
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1000,
        messages: groqMessages
      })
    });

    const data = await response.json();

    // Convert Groq response to Anthropic-like format
    const text = data.choices?.[0]?.message?.content || '';
    res.status(200).json({
      content: [{ type: 'text', text }]
    });

  } catch (error) {
    res.status(500).json({ error: 'خطا در ارتباط با سرور' });
  }
}
