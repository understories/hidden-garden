import express from 'express';

const app = express();
const PORT = process.env.PORT || 4000;

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Indexer service running on port ${PORT}`);
});

