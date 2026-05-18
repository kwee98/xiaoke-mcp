export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const key = req.query.key;
  
  if (!key) {
    return res.status(400).json({ error: 'key required' });
  }

  if (req.method === 'GET') {
    const val = global._store?.[key];
    if (val === undefined) return res.status(404).json({ error: 'not found' });
    return res.json({ value: val });
  }

  if (req.method === 'POST') {
    if (!global._store) global._store = {};
    global._store[key] = req.body?.value;
    return res.json({ ok: true });
  }

  res.status(405).json({ error: 'method not allowed' });
}
