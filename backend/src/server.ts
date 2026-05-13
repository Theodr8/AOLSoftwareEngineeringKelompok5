import 'dotenv/config'; // Pastikan .env terbaca paling pertama
import express from 'express';
import cors from 'cors';
import routes from './routes'; // Ini otomatis memanggil index.ts di folder routes

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Panggil semua rute dari hub utama
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});