import { Request, Response } from "express";
import { AuthRequest } from "../middleware/requireAuth";
import prisma  from "../lib/prisma"

export const getChatHistory = async (req: AuthRequest, res: Response): Promise <any> => {
    try {
        const currentUserId = req.user.userId; 
        const targetUserId = req.params.userId;

        const messages = await prisma.message.findMany({
            where:{
                OR:[
                    {senderId: currentUserId, receiverId: targetUserId},
                    {senderId: targetUserId, receiverId: currentUserId}
                ]
            },
            orderBy: {
                createdAt : 'asc'
            }
        });
        res.json(messages)
    }
    catch(error: any){
        error.status(500).json({error: error.message});
    }
}

export const sendMessage = async (req: AuthRequest, res: Response): Promise<any> =>{
    try{
        const currentUserId = req.user.userId;
        const targetUserId = req.params.userId;
        const {body, receiverId, senderId, conversationId} =req.body;

        // const conversationId = [currentUserId, targetUserId].sort().join('-');
        
        if (!body){
            return res.status(400).json({message: "Pesan tidak boleh kosong"});
        }

        let conversation = await prisma.conversation.findFirst({
            where :{
                AND: [
                    { participants: { some: { userId: currentUserId } } },
                    { participants: { some: { userId: targetUserId } } }
                    ]
            }
        })

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data:{
                    participants:{
                        create : [
                            {userId: currentUserId},
                            {userId: targetUserId},
                        ]
                    }
                }
            })
        }


        const newMessage = await prisma.message.create({
            data: {
                conversationId: conversation.id,
                body,
                senderId: currentUserId,
                receiverId: targetUserId,
            }
        });
        res.status(201).json(newMessage);
    }
    catch(error: any){
        res.status(500).json({error: error.message})
    }
}