import 'dotenv/config'; // Pastikan .env terbaca paling pertama
import express from 'express';
import cors from 'cors';
import routes from './routes'; // Ini otomatis memanggil index.ts di folder routes
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.resolve(process.cwd(), 'public/uploads')));

// Panggil semua rute dari hub utama
app.use('/api', routes);

io.on('connection', (socket) => {
  console.log('User terhubung ke socket', socket.id);

  socket.on('join_chat', (roomName) => {
    socket.join(roomName);
    console.log('tes koneksi user group chat');
  });

  socket.on('send_message', (messageData) => {
    socket.to(messageData.roomName).emit('receive_message', messageData);
  });

  socket.on('disconnect', () => {
    console.log('user terputus');
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});