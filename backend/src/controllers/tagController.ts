import { Request, Response } from "express";
import { AuthRequest } from "../middleware/requireAuth";
import prisma from '../lib/prisma';

export const getAllTags = async (req: AuthRequest, res:Response): Promise<any> => {
    try{
        const tag = await prisma.tag.findMany({
            orderBy: {name: 'asc'},
        })
        res.json(tag);
    }
    catch (error: any){
        res.status(500).json({error: error.message});
    }
}

export const addTagtoPost = async (req: AuthRequest, res: Response): Promise<any> =>{
    try{
        const postId = req.params.postId;
        const { tagId } = req.body;

        if(!tagId){
            return res.status(400).json({message: "Tag tidak boleh kosong"});
        }

        const existTag = await prisma.postTag.findUnique({
            where : {
                postId_tagId: {
                    postId: postId,
                    tagId: tagId,
                }
            }
        });

        if(existTag){
            await prisma.postTag.deleteMany({
                where:{
                    postId: postId,
                    tagId: tagId
                }
            })
            return res.json({message: "berhasil mencabut tag"});
        }

        const newTag = await prisma.postTag.create({
            data:{
                postId: postId,
                tagId: tagId
            },
            include : {
                tag: true
            }
        });

        res.json(newTag);

    }
    catch (error:any){
        res.status(500).json({error: error.message})
    }
}

