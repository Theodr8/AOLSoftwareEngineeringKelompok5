import { Request, Response } from "express";
import prisma from '../lib/prisma';
import { AuthRequest } from "../middleware/requireAuth";

export const createProject = async(req: AuthRequest, res: Response): Promise<any> =>{
    try{
        const currentUserId = req.user.userId;
        const {description,title} = req.body;

        if (!title) {
            return res.status(500).json({message: "tidak boleh kosong"});
        }
        const newProject = await prisma.project.create({
            data : {
                title,
                description,
                authorId: currentUserId,
            },
            include : {
                author: {
                    select: {
                        username: true,
                        displayName: true,

                    }
                }
            }
        });
        res.status(201).json(newProject);
    }
    catch(error: any){
        res.status(500).json({error: error.message});
    }
}

export const viewProject = async(req: Request, res: Response): Promise<any> => {
    try{
        const projects = await prisma.project.findMany({
            include : {
                author : {
                    select : {
                        username: true,
                        displayName: true,
                    }
                },
            },
            orderBy: {createdAt : 'desc'}
        });
        res.json(projects);
    }
    catch(error: any){
        res.status(500).json({error: error.message});
    }
}

export const getFollowingProjects = async (req: AuthRequest, res:Response): Promise<any> =>{
    try{
        const userId = req.user.userId;
        const following = await prisma.follow.findMany({
            where : {followerId : userId},
            select : {followingId : true}
        });

        
        const followingId = following.map(f=> f.followingId);
        
        if (!followingId){
            res.json({message: "belum follow siapapun"});
        }

        const projects = await prisma.project.findMany({
            where : {
                authorId : {in: followingId}
            },
            orderBy : {createdAt: 'desc'},
            include : {
                author:{
                    select : {
                        username: true,
                        displayName: true
                    }
                }
            }

        });
        res.json(projects);
    }
    catch(error: any){
        res.status(500).json({error: error.message});
    }
}