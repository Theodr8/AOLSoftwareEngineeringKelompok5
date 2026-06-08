import { Request, Response } from "express";
import { AuthRequest } from "../middleware/requireAuth";
import prisma from '../lib/prisma';

export const getAllSkills = async (req: AuthRequest, res:Response): Promise<any> => {
    try{
        const skill = await prisma.skill.findMany({
            orderBy: {name: 'asc'},
        })
        res.json(skill);
    }
    catch (error: any){
        res.status(500).json({error: error.message});
    }
}

export const addUserSkill = async (req: AuthRequest, res: Response): Promise<any> =>{
    try{
        const userId = req.user.userId;
        const { skillId } = req.body;

        if(!skillId){
            return res.status(400).json({message: "Skill tidak boleh kosong"});
        }

        const existSkill = await prisma.userSkill.findUnique({
            where : {
                userId_skillId: {
                    userId: userId,
                    skillId: skillId,
                }
            }
        });

        if(existSkill){
            await prisma.userSkill.deleteMany({
                where:{
                    userId: userId,
                    skillId: skillId
                }
            })
            return res.json({message: "berhasil mencabut skill"});
        }

        const newSkill = await prisma.userSkill.create({
            data:{
                userId: userId,
                skillId: skillId
            },
            include : {
                skill: true
            }
        });

        res.json(newSkill);

    }
    catch (error:any){
        res.status(500).json({error: error.message})
    }
}