import { Request, Response } from "express";
import prisma from '../lib/prisma';
import { AuthRequest } from "../middleware/requireAuth";

export const viewUserAllProjects = async (req: AuthRequest, res:Response): Promise<any> => {
  try{
    // const myUserId = req.user.userId;
    const currentUserId = req.params.userId;

    const viewProjects = await prisma.project.findMany({
      where: {
        authorId: currentUserId
      },
      include: {
        author:{
          select:{

            id:true,
            displayName: true,
            username: true,
          }
        }
      }
    })
    res.json(viewProjects);
  }
  catch (error: any){
    res.status(500).json({error: error.message});
  }
}

export const likeProject = async (req: AuthRequest, res:Response): Promise <any> =>{
  try{
    const currentUserId = req.user.userId;
    const {projectId} = req.params;

    const alreadyLike = await prisma.projectLike.findUnique({
      where : {
        userId_projectId:{
          userId: currentUserId,
          projectId: projectId
        }
      }
    })

    if (alreadyLike) {
      await prisma.projectLike.deleteMany({
        where:{
          userId: currentUserId,
          projectId: projectId
        }
      })
      res.json({message: "tes unlike berhasil"})
    }

    else {

      
      await prisma.projectLike.create({
        data:{
          userId: currentUserId,
          projectId: projectId,
        }
      });
      res.json({message: "tes like berhasil"})
    }
  }
  catch (error: any){
    res.status(500).json({error: error.message})
  }
}

export const viewLikeProjects = async (req: AuthRequest, res:Response): Promise <any> =>{
  try{
    const currentUserId = req.user.userId;
    const likeProjects = await prisma.projectLike.findMany({
      where : {
        userId: currentUserId,
      },
      select : {
        projectId: true
      }
    });
    const likeprojectId = likeProjects.map(f => f.projectId);
    
    const projects = await prisma.project.findMany({
      where : {
        id: {in: likeprojectId}
      },
      orderBy: {createdAt: 'desc'},
      include: {
        author: {select : {id:true, username:true, displayName: true}}
      }

    });
    res.json(projects);
  } 
  catch(error: any){
    res.status(500).json({error: error.message})
  } 
}

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

export const saveProject = async (req: AuthRequest, res:Response): Promise<any> =>{
  try{
    const currentUserId = req.user.userId;
    const {projectId} = req.params;

    const alreadySave = await prisma.projectSave.findUnique({
      where: {
        userId_projectId:{
          userId: currentUserId,
          projectId: projectId
        }
      }
    });
    //cek kalo udah disave
    if (alreadySave) {
      await prisma.projectSave.deleteMany({
        where:{
          userId: currentUserId,
          projectId: projectId
        }
      })
     res.json({message: "Tes unsave berhasil"}) 
    }

    else {

      await prisma.projectSave.create({
        data: {
          userId: currentUserId,
          projectId: projectId,
        },
      });
      res.json({message: "tes save berhasil"})
    }
  }
  catch (error: any){
    res.status(500).json({error: error.message});
  }
}

export const viewSaveProjects = async (req: AuthRequest, res:Response): Promise<any> => {
  try{
    const currentUserId = req.user.userId;
    const saveProjects = await prisma.projectSave.findMany({
      where: {
        userId : currentUserId
      },
      select : {
        projectId : true
      },
    });
    const saveProjectId = saveProjects.map(f => f.projectId);

    const projects = await prisma.project.findMany({
      where:{
        id : {in: saveProjectId}
      },
      orderBy : {createdAt: 'desc'},
      include: {
        author: {select : {id:true, username:true, displayName: true}}
      }
    })
    res.json(projects);
  }
  catch (error:any){
    res.status(500).json({error:error.message});
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

export const viewDetailedProject = async (req: AuthRequest, res:Response): Promise<any> =>{
  try{

    const currentUserId = req.user.userId;
    const projectsId = req.params.projectId;
    
    const projects = await prisma.project.findUnique({
      where: {
        id : projectsId
      },
      include: {
        author: {
          select:{
            avatarUrl: true,
            id: true,
            username: true,
            displayName: true,
          }
        },
        _count: {
          select: {
            likes: true,
            saves: true,
            comments: true,
          }
        },
      },
      
    });
    if(!projects){
      return res.status(400).json({message: "couldn't find project"});
    }

    const [liked, saved,commented] = await Promise.all([
      prisma.projectLike.findUnique({
        where: {userId_projectId: {userId: currentUserId, projectId: projectsId}}

      }),
      prisma.projectSave.findUnique({
        where: {userId_projectId: {userId: currentUserId, projectId: projectsId}}
      }),
      prisma.ProjectComment.findFirst({
        where: {authorId: currentUserId, projectId: projectsId}
      })
    ])
    
    const formattedProject = {
      ...projects,
      isLikedByMe: !!liked,
      isSavedByMe: !!saved,
      isCommentedByMe: !!commented,
    };
    // delete (formattedProject as any).likes;
    // delete (formattedProject as any).saves;
    res.json(formattedProject);
  }
  catch (error: any){
    res.status(500).json({error: error.message}); 
  }
}

export const viewCommentProject = async (req:AuthRequest, res:Response): Promise<any> => {
  try{
    const currentUserId = req.user.userId;
    const projectsId = req.params.projectId;

    const comments = await prisma.ProjectComment.findMany({
      where:{
        projectId: projectsId,
      },
      include: {
        author: {
          select:{

            id:true,
            username:true,
            displayName:true,
          }
        },
        // comments: {
        //   id: true, 
        //   author: true,
        //   body: true,
        // }
      },
      orderBy:{
        createdAt:'asc',
      }
    });
    res.json(comments);
  }
  catch(error: any){
    res.status(500).json({error: error.message});
  }
}

export const createComment = async (req:AuthRequest, res:Response): Promise<any> => {
  try{
    const projectsId = req.params.projectId;
    const currentUserId =req.user.userId;
    const {body} = req.body;

    if(!body) {
      return res.status(400).json({message: "Tidak boleh kosong"});
    }

    const comments = await prisma.ProjectComment.create({
     
      data: {
        body,
        projectId: projectsId,
        authorId: currentUserId
      },
      include:{
        author:{
          select:{
            username:true,
            displayName:true,
          }
        }
      }

    })
    res.status(500).json({message:"berhasil dikirim"});
  }
  catch(error: any){
    res.status(500).json({error: error.message});
  }
}

export const deleteProject = async (req:AuthRequest, res:Response): Promise<any> => {
  try{
    const projectsId = req.params.projectId;
    const currentUserId = req.user.userId;

    const projects = await prisma.project.findUnique({
      where:{
        id: projectsId
      },
      select:{
        authorId: true
      }
    });

    if (projects.authorId != currentUserId){
      return res.status(403).json({message: "Tidak punya akses untuk menghapus"});
    }

    await prisma.project.delete({
      where:{
        id: projectsId,
        // authorId: currentUserId
      },
      
    });
    res.json({message: "tes delete project berhasil"});
  }
  catch(error: any){
    res.status(500).json({error: error.message});
  }
}