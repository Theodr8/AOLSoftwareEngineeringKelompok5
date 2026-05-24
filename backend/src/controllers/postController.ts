import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/requireAuth';
import prisma from '../lib/prisma';

export const createPost = async (req: AuthRequest, res:Response): Promise<any> => {
  try{
    const {content} = req.body;
    const userId = req.user.userId;

    if (!content) {
      return res.status(400).json({message: "Tidak boleh kosong"});
    }
    const newPost = await prisma.post.create({
      data: {
        content,
        authorId: userId,
      },
      include: {author : {select : {username : true, displayname: true}}}
    });
    res.status(201).json({message: "Postingan berhasil terkirim", post: newPost});
  }
  catch (error: any){
    res.status(500).json({error: error.message});
  }
}

export const getFollowingPosts = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const currentUserId = req.user.userId;
    const following = await prisma.follows.findMany({
      where : {followerId : currentUserId},
      select: {followingId: true},
    });

    const followingId = following.map(f => f.followingId);

    const posts = await prisma.post.findMany({
      where : {
        authorId: {in: followingId}
      },
      orderBy: {createdAt: 'desc'},
      include: {
        author: {select : {id:true, username:true, displayName: true}}
      }
    });
    res.json(posts);
  }
  catch (error: any){
    res.status(500).json({error: error.message});
  }
};

export const getAllPosts = async (req: Request, res: Response): Promise<any> => {
  try {
    // Mengambil semua postingan dari database
    // include: digunakan untuk melakukan "Join" agar nama pembuatnya (User) ikut terbawa
    const posts = await prisma.post.findMany({
      include: {
        author: { // Asumsi di skema kamu relasinya bernama 'author' atau 'user'
          select: { username: true, displayName: true } 
        }
      },
      orderBy: {
        createdAt: 'desc' // Urutkan dari yang paling baru
      }
    });

    res.json(posts);
  } catch (error: any) {
    console.error("Get Posts Error:", error);
    res.status(500).json({ message: "Gagal mengambil data postingan." });
  }
};