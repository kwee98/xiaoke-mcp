const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let data = {};

app.get('/get/:key', (req, res) => {
  const val = data[req.params.key];
  if (val === undefined) return res.status(404).json({ error: 'not found' });
  res.json({ value: val });
});

app.post('/set/:key', (req, res) => {
  data[req.params.key] = req.body.value;
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('xiaoke-mcp running on port ' + PORT));
