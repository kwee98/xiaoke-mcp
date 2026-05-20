export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET' && req.query.path === 'sse') {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const endpoint = `${req.headers['x-forwarded-proto']}://${req.headers['x-forwarded-host']}/api?path=message`;
    res.write(`event: endpoint\ndata: ${endpoint}\n\n`);

    const keepAlive = setInterval(() => {
      res.write(`: ping\n\n`);
    }, 30000);

    req.on('close', () => clearInterval(keepAlive));
    return;
  }

  if (req.method === 'POST' && req.query.path === 'message') {
    const { method, params } = req.body;

    if (method === 'initialize') {
      return res.json({
        jsonrpc: '2.0',
        id: req.body.id,
        result: {
          protocolVersion: '2024-11-05',
          serverInfo: { name: 'xiaoke-mcp', version: '1.0.0' },
          capabilities: { tools: {} }
        }
      });
    }

    if (method === 'tools/list') {
      return res.json({
        jsonrpc: '2.0',
        id: req.body.id,
        result: {
          tools: [{
            name: 'hello',
            description: '昭昭和小克的第一个工具',
            inputSchema: {
              type: 'object',
              properties: {
                message: { type: 'string', description: '消息内容' }
              }
            }
          }]
        }
      });
    }

    if (method === 'tools/call') {
      return res.json({
        jsonrpc: '2.0',
        id: req.body.id,
        result: {
          content: [{ type: 'text', text: `收到：${params?.arguments?.message || ''}` }]
        }
      });
    }

    return res.json({ jsonrpc: '2.0', id: req.body.id, result: {} });
  }

  res.status(404).json({ error: 'not found' });
}

