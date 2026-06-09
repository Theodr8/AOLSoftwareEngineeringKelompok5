import { Request, Response } from "express";
import { AuthRequest } from "../middleware/requireAuth";
import prisma  from "../lib/prisma"
import { useImperativeHandle } from "react";

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
        res.status(500).json({error: error.message});
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

        const targetUserExists = await prisma.user.findUnique({
            where: { id: targetUserId }
        });

        if (!targetUserExists) {
            return res.status(404).json({ message: "Gagal mengirim pesan: User tujuan tidak ditemukan." });
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

        const io = req.app.get("io");
        if (io) {
                console.log(`[SOCKET] Memancarkan pesan ke ruangan (ID): ${targetUserId}`);
                io.to(targetUserId).emit("pesanBaru", newMessage);
            } else {
                console.error("PERINGATAN: Socket.io tidak ditemukan");
            }
            io.to(receiverId).emit("pesanBaru",newMessage);

            res.status(201).json(newMessage);
        }
        catch(error: any){
            res.status(500).json({error: error.message})
        }
}

export const getChatContacts = async (req: AuthRequest, res:Response): Promise<any> =>{
    try{
        const myId = req.user.userId;

        const conversations = await prisma.conversation.findMany({
            where : {participants : {some : {userId: myId}}},
            include : {
                participants : {
                    where : {userId: {not: myId}},
                    include: {
                        user: {
                            select: {
                                id:true,
                                displayName: true,
                                username: true,
                                avatarUrl: true
                            }
                        }
                    }
                },
                    messages:{
                        orderBy: {createdAt: "desc"},
                        take: 1
                    }
            }
        });

        const following = await prisma.follow.findMany({
            where : {followerId: myId},
            include: {
                following:{
                    select:{
                        id:true,
                        displayName: true,
                        username: true,
                        avatarUrl: true
                    }
                }
            }
        });

        const contactMaps = new Map();

        following.forEach(f => {
            contactMaps.set(f.following.id, {
                userId: f.following.id,
                displayName: f.following.displayName,
                username: f.following.username,
                avatarUrl: f.following.avatarUrl,
                lastMessage: null,
                updatedAt: new Date(0)
            });
        });

        conversations.forEach(conv => {
            const friend = conv.participants[0]?.user;
            const lastMsg = conv.messages[0];
            if (friend) {
                contactMaps.set(friend.id, {
                    userId: friend.id,
                    displayName: friend.displayName,
                    username: friend.username,
                    avatarUrl: friend.avatarUrl,
                    lastMessage: lastMsg ? lastMsg.body : null,
                    updatedAt: conv.updatedAt
                });
            }
        });
        const contactList = Array.from(contactMaps.values()).sort((a,b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    
        res.json(contactList);
    }
    catch(error: any){
        res.status(500).json({error: error.message})
    }
}