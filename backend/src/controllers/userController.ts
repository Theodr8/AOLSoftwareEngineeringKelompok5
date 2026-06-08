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
                id: { not: currentUserId },
                
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
                skills: {
                    select: {
                        skill:true
                    }
                }
                
            }
        });
        const ProfileDetail = {
            ...data,
            followerCount : data._count.followers,
            followingCount : data._count.following,

            followers: undefined,
            _count : undefined,

            skills: data.skills.map((item:any) => item.skill)
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
        const currentUserId = req.params.userId;
        const userId = req.user.userId;
        const followinglist = await prisma.Follow.findMany({
            where :{
                followerId: currentUserId,
            },
            
            select:{
                following:{
                    select:{
                        id:true,
                        username: true,
                        displayName:true,
                        avatarUrl: true,
                    }
                },
                
            }

        })
        const followingIds = followinglist.map((item: any) => item.following.id);
        const viewerFollowing = await prisma.follow.findMany({
            where: {
                followerId: userId,
                followingId: { in: followingIds }
            },
            select: {
                followingId: true,
            }
        });
        
        const followedSet = new Set(viewerFollowing.map((item: any) => item.followingId));

        const followingCount = await prisma.follow.count({
            where:{
                followerId:currentUserId
            }
        })

        const formattedFollowing = followinglist.map((follow: any) => ({
            ...follow,
            isFollowedByMe: followedSet.has(follow.following.id)
        }));
        res.json({following: formattedFollowing, count:followingCount});
    }
    catch (error:any){
        res.status(500).json({error:error.message});
    }
}
export const viewFollowerList = async (req: AuthRequest, res:Response): Promise<any> => {
    try{
        const currentUserId = req.params.userId;
        const userId = req.user.userId;
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
            }
        });
        const followingIds = followerlist.map((item: any) => item.follower.id);
        const viewerFollowing = await prisma.follow.findMany({
            where: {
                followerId: userId,
                followingId: { in: followingIds }
            },
            select: {
                followingId: true,
            }
        });
        const followedSet = new Set(viewerFollowing.map((item:any) => item.followingId));
        
        const followerCount = await prisma.Follow.count({
            where:{
                followingId:currentUserId
            }
        });
        const formattedFollowing = followerlist.map((follow: any) => ({
            ...follow,
            isFollowedByMe: followedSet.has(follow.follower.id)
        }));
        res.json({follower: formattedFollowing,count: followerCount});
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
                skills: {
                    select: {
                        skill:true
                    }
                }
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
            _count : undefined,
            skills: userDetail.skills.map((item:any) => item.skill)
        }
        res.json({formattedProfile});
    }
    catch(error:any){
        res.status(500).json({error: error.message});
    }
}