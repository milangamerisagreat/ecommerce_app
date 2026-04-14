import connectDB from './database/db.js';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
const app = express();
app.use(cors());
connectDB();
dotenv.config();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('');
});

app.listen(PORT, () => {
  console.log(`localhost:${PORT} is running`);
});
