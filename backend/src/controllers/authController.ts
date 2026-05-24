import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// @ts-ignore
import prisma from '../lib/prisma';

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, username, password, displayName } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ message: "Email, username, dan password wajib diisi!" });
    }

    // Cek email atau username sudah terdaftar
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email atau Username sudah terdaftar!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash: hashedPassword,
        displayName: displayName || username, 
      }
    });

    res.status(201).json({ 
      message: "Register berhasil! Silakan login.",
      user: { id: newUser.id, username: newUser.username } 
    });

  } catch (error: any) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email dan password wajib diisi!" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Email tidak ditemukan!" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Password salah!" });
    }

    // (JWT)
    const secret = process.env.JWT_SECRET || 'rahasia_negara_123';
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1d' });

    res.json({ 
      message: "Login berhasil!", 
      token, 
      user: { id: user.id, username: user.username, email: user.email } 
    });

  } catch (error: any) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};