const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

// Pastikan .env sudah dimuat oleh server.ts sebelum file ini dipanggil
const connectionString = process.env.DATABASE_URL;

// 1. Inisialisasi koneksi dasar menggunakan pg Pool
const pool = new Pool({ connectionString });

// 2. Bungkus Pool tersebut dengan Prisma Adapter
const adapter = new PrismaPg(pool);

// 3. Masukkan adapter ke dalam Prisma Client
const prisma = new PrismaClient({ adapter });

module.exports = prisma;