import { Request, Response } from "express";
import { AuthRequest } from "../middleware/requireAuth";
import prisma from "../lib/prisma"
import { connect } from "node:http2";

export const allJobs = async (req: AuthRequest, res: Response): Promise<any> => {
    try{
        const jobs = await prisma.job.findMany({
            orderBy : {
                createdAt: 'desc'
            },
        });
        res.json(jobs);
    }
    catch (error: any){
        res.status(500).json({message : error.message + "Gagal mengambil jobs"});

    }
} 

export const saveJob = async (req: AuthRequest, res: Response): Promise<any> =>{
    try{
        const currentUserId = req.user.userId;
        const {jobId} = req.params;

        await prisma.user.update({
            where: {id:currentUserId},
            data: {
                jobs:{
                    connect : {id:jobId}
                }
            }
        });
        res.json({message: "Berhasil disimpan"})
    }
    catch(error: any){
        res.status(500).json({error: error.message});
    }
}

export const unsaveJob = async (req: AuthRequest, res: Response): Promise<any> =>{
    try{
        const currentUserId = req.user.userId;
        const {jobId} = req.params;

        await prisma.user.udpate({
            where: {id:currentUserId},
            data: {
                jobs:{
                    disconnect : {id:jobId}
                }
            }
        });
        res.json({message: "Berhasil dihapus"})
    }
    catch(error: any){
        res.status(500).json({error: error.message});
    }
}

export const viewSaveJob = async (req: AuthRequest, res: Response): Promise <any> => {
    try{
        const currentUserId = req.user.userId;
        const savedJobs = await prisma.job.findMany({

            where : {
                id: currentUserId
            },
            select : {
                jobs: true
            },

            orderBy : {
                createdAt:'desc'
            },
        })
        res.json(savedJobs.jobs)
    }
    catch (error: any){
        res.status(500).json({message: error.message})
    }
}