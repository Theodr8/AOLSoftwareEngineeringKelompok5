import { Request,Response } from "express";
import { Jwt } from "jsonwebtoken";
import { AuthRequest } from "../middleware/requireAuth";
import prisma from '../lib/prisma';
import fs from 'fs';
import path from 'path';
import { viewUserAllProjects } from "./projectController";

export const GetRecommendedUsers = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const currentUserId = req.user.userId;

        const suggestion = await prisma.user.findMany({
            where: {
                // 1. Jangan tampilkan diri sendiri
                id: { not: currentUserId },
                
                // 2. MAGIC: Jangan tampilkan user yang SUDAH di-follow oleh saya
                followers: {
                    none: {
                        followerId: currentUserId
                    }
                }
            },
            take: 3,
            select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true,
            }
        });

        // 3. Tambahkan status isFollowedByMe: false secara manual 
        // (Karena kita sudah memfilter di atas, otomatis semua yang muncul di sini PASTI belum di-follow)
        const formattedSuggestions = suggestion.map(user => ({
            ...user,
            isFollowedByMe: false 
        }));

        res.json(formattedSuggestions);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const ViewProfile = async (req: AuthRequest, res: Response): Promise<any> => {
    try{
        const UserId = req.user.userId;

        const data = await prisma.user.findUnique({
            where :{
                id: UserId
            },
            select: {
                id:true,
                username : true,
                displayName : true,
                email : true,
                // passwords : true,
                bio: true,
                avatarUrl : true,
                websiteUrl : true,
                githubUrl : true,
                linkedinUrl: true,
                location : true,
                _count : {
                    select: {
                        followers:true,
                        following: true
                    }
                },
            }
        });
        const ProfileDetail = {
            ...data,
            followerCount : data._count.followers,
            followingCount : data._count.following,

            followers: undefined,
            _count : undefined
        }
        res.json(ProfileDetail);
    }
    catch (error:any){
        res.status(500).json({error : error.message})
    }
}

export const UpdateProfile = async (req: AuthRequest, res: Response): Promise<any> => {
    try{
        const UserId = req.user.userId;
        let {displayName, username, bio, avatarUrl,email, websiteUrl, githubUrl, location,linkedinUrl} = req.body;

        if (req.file) {
            avatarUrl = `/uploads/${req.file.filename}`;
            console.log("Data File:", req.file);
        }

        
        const updateUser = await prisma.user.update({
            where :{
                id : UserId
            },
            data: {
                displayName,
                username,
                bio,
                avatarUrl,
                email,
                websiteUrl,
                githubUrl,
                linkedinUrl,
                location
            },
            select: {
                id:true,
                username : true,
                displayName : true,
                email : true,
                passwordHash : false,
                bio: true,
                avatarUrl : true,
                websiteUrl : true,
                githubUrl : true,
                linkedinUrl: true,
                location : true,
            }
        });
        // if (!updateUser){
        //     return res.status(404).json({error: Error});
        // }
        res.json({
            message : "Profile berhasil diupdate",
            user: updateUser
        });
    }
    catch (error: any){
        if (req.file){
            fs.unlink(path.join('public/uploads', req.file.filename), (err) => {
                if (err) console.error('Failed to update profile');
            });
        }
        // console.error("Update profile error: ", error);
        res.status(500).json({error: error.message});
    }
};

export const following = async (req: AuthRequest, res:Response): Promise<any> => {
    try {
        const UserId = req.user.userId;
        const {targetUserId} = req.params;
        if (UserId === targetUserId){
            return res.status(400).json({message: "Tidak bisa follow diri sendiri"});
        }
        // const targetUser = await prisma.user.findUnique({
        //     where: {id: targetUserId}
        // })

        // if (!targetUser){
        //     return res.status(400).json({message: "User tidak ditemukan"});
        // }

        const alreadyFollow = await prisma.follow.findUnique({
            where :  {
                followerId_followingId: {
                    followerId: UserId,
                    followingId: targetUserId
                }
            }
        })
        if (alreadyFollow){
            await prisma.follow.deleteMany({
                where : {
                    followerId: UserId,
                    followingId: targetUserId
                }
            });
            res.json({message: "Tes berhasil Unfollow"})
        }
        else {

            await prisma.follow.create({
                data: {
                    followerId : UserId,
                    followingId : targetUserId
                }
            });
            
            res.json({message : "Tes berhasil follow"});
        }

    }
    catch (error: any){
        res.status(500).json({error: error.message})
    }
}

export const viewFollowingList = async (req: AuthRequest, res:Response): Promise<any> => {
    try{
        const currentUserId = req.user.userId;
        const followinglist = await prisma.Follow.findMany({
            where :{
                followerId: currentUserId,
            },
            
            select:{
                // _count:{
                    // select:{

                        following:{
                            select:{
                                id:true,
                                username: true,
                                displayName:true,
                                avatarUrl: true
                            }
                        },
                    // }
                        
                // },
            }

        })
        const followingCount = await prisma.follow.count({
            where:{
                followerId:currentUserId
            }
        })
        res.json({following: followinglist, count:followingCount});
    }
    catch (error:any){
        res.status(500).json({error:error.message});
    }
}
export const viewFollowerList = async (req: AuthRequest, res:Response): Promise<any> => {
    try{
        const currentUserId = req.user.userId;
        const followerlist = await prisma.Follow.findMany({
            where :{
                followingId: currentUserId,
            },
            
            select:{
                follower:{
                    select:{
                        id:true,
                        username: true,
                        displayName:true,
                        avatarUrl: true
                    }
                },
                // users:{
                    
                //     username: true,
                //     displayName: true,
                // }
            }
        });
        const followerCount = await prisma.Follow.count({
            where:{
                followingId:currentUserId
            }
        });
        res.json({followerlist, followerCount});
    }
    catch (error:any){
        res.status(500).json({error:error.message});
    }
}

// export const unfollowing = async (req: AuthRequest, res:Response): Promise<any> => {
//     try {
//         const UserId = req.user.userId;
//         const targetUserId = req.params.id;
//         if (UserId === targetUserId){
//             return res.status(400).json({message: "Tidak bisa follow diri sendiri"});
//         }
//         const targetUser = await prisma.user.findUnique({
//             where: {id: targetUserId}
//         })
//         if (!targetUser){
//             return res.status(400).json({message: "User tidak ditemukan"});
//         }

//         await prisma.follow.deleteMany({
//             where: {
//                 followerId : UserId,
//                 followingId : targetUserId
//             }
//         });

//         res.json({message : "Tes berhasil follow"});

//     }
//     catch (error: any){
//         res.status(500).json({error: error.message})
//     }
// }

export const viewSkill = async (req: AuthRequest, res:Response): Promise<any> =>{
    try{
        // const currentUserId = req.user.userId;
        // const skillId = req.body;

        const skillUser = await prisma.skill.findMany({
            select:{
                id:true,
                name:true,
            }
        })
        res.json(skillUser);
    }
    catch (error:any){
        res.status(500).json({error: error.message});
    }
}

export const viewUser = async (req: AuthRequest, res:Response): Promise<any> =>{
    try{
        const userId = req.params.userId;
        const myUserId = req.user.userId;

        const userDetail = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select:{
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true,
                bio: true,
                location: true,
                githubUrl: true,
                linkedinUrl : true,
                websiteUrl: true,

                _count : {
                    select: {
                        followers:true,
                        following: true
                    }
                },
            },
            // include: {
            // }
            
        })
        if (!userDetail) return res.status(404).json({ message: "User tidak ditemukan" });

        const alreadyFollow = await prisma.follow.findUnique({
            where :  {
                followerId_followingId: {
                    followerId: myUserId,
                    followingId: userId
                }
            }
        })

        const formattedProfile = {
            ...userDetail,
            followerCount : userDetail._count.followers,
            followingCount : userDetail._count.following,

            isFollowedByMe: alreadyFollow !== null,

            followers: undefined,
            _count : undefined
        }
        res.json({formattedProfile});
    }
    catch(error:any){
        res.status(500).json({error: error.message});
    }
}