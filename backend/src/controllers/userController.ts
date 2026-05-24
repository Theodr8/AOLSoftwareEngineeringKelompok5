import { Request,Response } from "express";
import { Jwt } from "jsonwebtoken";
import { AuthRequest } from "../middleware/requireAuth";
import prisma from '../lib/prisma';

export const GetRecommendedUsers = async (req: AuthRequest, res: Response): Promise<any> =>{
    try{
        const currentUserId = req.user.userId;

        const suggestion= await prisma.user.findMany({
            where :{
                id : { not:currentUserId}
            },
            take: 3,
            select: {
                id: true,
                username: true,
                displayName: true,
            }
        });
        res.json(suggestion);
    }
    catch (error:any){
        res.status(500).json({error : error.message})
    }
};