import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/requireAuth';
import prisma from '../lib/prisma';

export const globalSearch = async (req: AuthRequest, res:Response): Promise<any> =>{
    try{
        const searchQuery = req.query.q as string;
        if (!searchQuery){
            return res.json({users: [],posts:[]});
        }
        const users = await prisma.user.findMany({
            where:{
                OR:[
                    {username: {contains: searchQuery, mode: 'insensitive'}},
                    {displayName: {contains: searchQuery, mode: 'insensitive'}}
                ]
            },
            select:{
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true
            }
        })
        const posts = await prisma.post.findMany({
            where:{
                title: {contains: searchQuery,mode: 'insensitive'}
            },
            include: {
                author:{
                    select:{
                        username: true,
                        displayName: true,
                    }
                }
            }
        })
        res.json({users, posts});
    }

    catch(error: any){
        res.status(500).json({error: error.message});
    }
}