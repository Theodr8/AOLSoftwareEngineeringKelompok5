import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/requireAuth';
import prisma from '../lib/prisma';
import { create } from 'node:domain';
import fs from 'fs';
import path from 'path';

export const viewUserAllPost = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const myUserId = req.user.userId; 
    const targetUserId = req.params.userId;

    const viewPosts = await prisma.post.findMany({
      where: {
        authorId: targetUserId 
      },
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
            username: true,
            avatarUrl: true
          }
        },
        _count: {
          select: {
            likes: true,
            saves: true,
            comments: true,
          }
        },
        likes: { where: { userId: myUserId } },
        saves: { where: { userId: myUserId } },
        comments: { where: { authorId: myUserId }, take: 1 } // take: 1 agar tidak perlu menarik semua komentar, cukup cek 1 saja
      }
    });

    const formattedPosts = viewPosts.map((post) => ({
      ...post,
      likeCount: post._count.likes,
      saveCount: post._count.saves,
      commentCount: post._count.comments,
      
      // Jika array likes/saves/comments ada isinya (length > 0), berarti SAYA pernah melakukannya (true)
      isLikedByMe: post.likes.length > 0,
      isSavedByMe: post.saves.length > 0,
      isCommentedByMe: post.comments.length > 0,

      likes: undefined,
      saves: undefined,
      comments: undefined,
      _count: undefined
    }));

    res.json(formattedPosts);

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createPost = async (req: AuthRequest, res:Response): Promise<any> => {
  try{
    let {body, title, imageUrl} = req.body;
    const userId = req.user.userId;

    if(req.file) {
      imageUrl = `/post/${req.file.filename}`;
      console.log("data file:", req.file);
    }

    if (!body) {
      return res.status(400).json({message: "Tidak boleh kosong"});
    }
    const newPost = await prisma.post.create({
      data: {
        title,
        body,
        authorId: userId,
        imageUrl,
      },
      include: {author : {select : {username : true, displayName: true, avatarUrl: true}}}
    });
    res.json({message: "Postingan berhasil terkirim", post: newPost});
  }
  catch (error: any){
  if (req.file){
      fs.unlink(path.join('public/post', req.file.filename), (err) => {
          if (err) console.error('Failed to update profile');
      });
  }
    res.status(500).json({error: error.message});
  }
}

export const getFollowingPosts = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const currentUserId = req.user.userId;
    const following = await prisma.follow.findMany({
      where : {followerId : currentUserId},
      select: {followingId: true},
    });

    
    const followingId = following.map(f => f.followingId);

    if (!followingId){
      res.json({message: "belum follow siapapun"});
    }
    else {

      const posts = await prisma.post.findMany({
        where : {
          authorId: {in: followingId}
        },
        orderBy: {createdAt: 'desc'},
        include: {
          author: {select : {id:true, username:true, displayName: true, avatarUrl: true}},
          _count: {
            select: {
              likes: true,
              saves: true,
              comments: true,
            }
          },
          likes: { where: { userId: currentUserId } },
          saves: { where: { userId: currentUserId } },
          comments: { where: { authorId: currentUserId }, take: 1 }
        }
      });
      const formattedPosts = posts.map((post) => ({
        ...post,
        likeCount: post._count.likes,
        saveCount: post._count.saves,
        commentCount: post._count.comments,
        isLikedByMe: post.likes.length > 0,
        isSavedByMe: post.saves.length > 0,
        isCommentedByMe: post.comments.length > 0,
        likes: undefined,
        saves: undefined,
        comments: undefined,
        _count: undefined
      }));

      res.json(formattedPosts);
    }
  }
  catch (error: any){
    res.status(500).json({error: error.message});
  }
};

export const getAllPosts = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const currentUserId = req.user.userId;

    const posts = await prisma.post.findMany({
      include: {
        author: { 
          select: { id: true, username: true, displayName: true, avatarUrl: true } 
        },
        _count: {
          select: {
            likes: true,
            saves: true,
            comments: true,
          }
        },
        likes: { where: { userId: currentUserId } },
        saves: { where: { userId: currentUserId } },
        comments: { where: { authorId: currentUserId }, take: 1 }
      },
      orderBy: {
        createdAt: 'desc' // Urutkan dari yang paling baru
      }
    });

    const formattedPosts = posts.map((post) => ({
      ...post,
      likeCount: post._count.likes,
      saveCount: post._count.saves,
      commentCount: post._count.comments,
      isLikedByMe: post.likes.length > 0,
      isSavedByMe: post.saves.length > 0,
      isCommentedByMe: post.comments.length > 0,
      likes: undefined,
      saves: undefined,
      comments: undefined,
      _count: undefined
    }));

    res.json(formattedPosts);
  } catch (error: any) {
    console.error("Get Posts Error:", error);
    res.status(500).json({ message: "Gagal mengambil data postingan." });
  }
};

export const likePost = async (req: AuthRequest, res:Response): Promise <any> =>{
  try{
    const currentUserId = req.user.userId;
    const {postId} = req.params;

    const alreadyLike = await prisma.postLike.findUnique({
      where : {
        userId_postId:{
          userId: currentUserId,
          postId: postId
        }
      }
    })

    if (alreadyLike) {
      await prisma.postLike.deleteMany({
        where:{
          userId: currentUserId,
          postId: postId
        }
      })
      res.json({message: "tes unlike berhasil"})
    }

    else {

      
      await prisma.postLike.create({
        data:{
          userId: currentUserId,
          postId,
        }
      });
      res.json({message: "tes like berhasil"})
    }
  }
  catch (error: any){
    res.status(500).json({error: error.message})
  }
}

// export const unlikePost = async (req: AuthRequest, res:Response): Promise <any> =>{
//   try{
//     const currentUserId = req.user.userId;
//     const {postId} = req.params;

//     await prisma.postLike.deleteMany({
//       where: {
//         userId: currentUserId,
//         postId: postId,
//       },
//       // data:{
//       //   userId: currentUserId,
//       //   postId,
//       // }
//     });
//     res.json({message: "tes unlike berhasil"})
//   }
//   catch (error: any){
//     res.status(500).json({error: error.message})
//   }
// }

export const viewLikePost = async (req: AuthRequest, res:Response): Promise <any> =>{
  try{
    const currentUserId = req.params.userId;
    const likePost = await prisma.postLike.findMany({
      where : {
        userId: currentUserId,
      },
      select : {
        postId: true
      },

    });
    
    const likepostId = likePost.map(f => f.postId);
    
    const posts = await prisma.post.findMany({
      where : {
        id: {in: likepostId}
      },
      orderBy: {createdAt: 'desc'},
      // include: {
      //   author: {select : {id:true, username:true, displayName: true, avatarUrl: true}}
      // }
      include: {
        author: { 
          select: { id: true, username: true, displayName: true, avatarUrl: true } 
        },
        _count: {
          select: {
            likes: true,
            saves: true,
            comments: true,
          }
        },
        likes: { where: { userId: currentUserId } },
        saves: { where: { userId: currentUserId } },
        comments: { where: { authorId: currentUserId }, take: 1 }
      },

    });
    const formattedPosts = posts.map((post) => ({
      ...post,
      likeCount: post._count.likes,
      saveCount: post._count.saves,
      commentCount: post._count.comments,
      isLikedByMe: post.likes.length > 0,
      isSavedByMe: post.saves.length > 0,
      isCommentedByMe: post.comments.length > 0,
      likes: undefined,
      saves: undefined,
      comments: undefined,
      _count: undefined
    }));

    res.json(formattedPosts);
  } 
  catch(error: any){
    res.status(500).json({error: error.message})
  } 
}
export const savePost = async (req: AuthRequest, res:Response): Promise<any> =>{
  try{
    const currentUserId = req.user.userId;
    const {postId} = req.params;

    const alreadySave = await prisma.postSave.findUnique({
      where: {
        userId_postId:{
          userId: currentUserId,
          postId: postId
        }
      }
    });
    //cek kalo udah disave
    if (alreadySave) {
      await prisma.postSave.deleteMany({
        where:{
          userId: currentUserId,
          postId: postId
        }
      })
     res.json({message: "Tes unsave berhasil"}) 
    }

    else {

      await prisma.postSave.create({
        data: {
          userId: currentUserId,
          postId: postId,
        },
      });
      res.json({message: "tes save berhasil"})
    }
  }
  catch (error: any){
    res.status(500).json({error: error.message});
  }
}

// export const unsavePost = async (req: AuthRequest, res:Response): Promise<any> => {
//   try{
//     const currentUserId = req.user.userId;
//     const {postId} = req.params;

//     await prisma.postSave.deleteMany({
//       where: {
//         userId: currentUserId,
//         postId: postId,
//       },
//     });
//     res.json({message: "tes unsave berhasil"})
//   }
//   catch(error: any){
//     res.status(500).json({error:error.message});
//   }
// }

export const viewSavePost = async (req: AuthRequest, res:Response): Promise<any> => {
  try{
    const currentUserId = req.params.userId;
    const savePost = await prisma.postSave.findMany({
      where: {
        userId : currentUserId
      },
      select : {
        postId : true
      },
    });
    const savePostId = savePost.map(f => f.postId);

    const posts = await prisma.post.findMany({
      where:{
        id : {in: savePostId}
      },
      orderBy : {createdAt: 'desc'},
      include: {
        author: { 
          select: { id: true, username: true, displayName: true, avatarUrl: true } 
        },
        _count: {
          select: {
            likes: true,
            saves: true,
            comments: true,
          }
        },
        likes: { where: { userId: currentUserId } },
        saves: { where: { userId: currentUserId } },
        comments: { where: { authorId: currentUserId }, take: 1 }
      },
    })
    const formattedPosts = posts.map((post) => ({
      ...post,
      likeCount: post._count.likes,
      saveCount: post._count.saves,
      commentCount: post._count.comments,
      isLikedByMe: post.likes.length > 0,
      isSavedByMe: post.saves.length > 0,
      isCommentedByMe: post.comments.length > 0,
      likes: undefined,
      saves: undefined,
      comments: undefined,
      _count: undefined
    }));

    res.json(formattedPosts);
  }
  catch (error:any){
    res.status(500).json({error:error.message});
  }

}

export const viewDetailedPost = async (req: AuthRequest, res:Response): Promise<any> =>{
  try{

    const currentUserId = req.user.userId;
    const postsId = req.params.postId;
    
    const posts = await prisma.post.findUnique({
      where: {
        id : postsId
      },
      include: {
        // title:true,
        // imageUrl:true,
        author: {
          select:{
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
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
    if(!posts){
      return res.status(400).json({message: "couldn't find post"});
    }

    const [liked, saved,commented] = await Promise.all([
      prisma.postLike.findUnique({
        where: {userId_postId: {userId: currentUserId, postId: postsId}}

      }),
      prisma.postSave.findUnique({
        where: {userId_postId: {userId: currentUserId, postId: postsId}}
      }),
      prisma.PostComment.findFirst({
        where: {authorId: currentUserId, postId: postsId}
      })
    ])
    
    const formattedPost = {
      ...posts,
      imageUrl: posts.imageUrl,
      isLikedByMe: !!liked,
      isSavedByMe: !!saved,
      isCommentedByMe: !!commented,
    };
    res.json(formattedPost);
  }
  catch (error: any){
    res.status(500).json({error: error.message}); 
  }

}

export const viewCommentPost = async (req:AuthRequest, res:Response): Promise<any> => {
  try{
    const currentUserId = req.user.userId;
    const postsId = req.params.postId;

    const comments = await prisma.PostComment.findMany({
      where:{
        postId: postsId,
      },
      include: {
        author: {
          select:{

            id:true,
            avatarUrl:true,
            
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
    const postsId = req.params.postId;
    const currentUserId =req.user.userId;
    const {body} = req.body;

    if(!body) {
      return res.status(400).json({message: "Tidak boleh kosong"});
    }

    const comments = await prisma.PostComment.create({
     
      data: {
        body,
        postId: postsId,
        authorId: currentUserId
      },
      include:{
        author:{
          select:{
            id:true,
            avatarUrl:true,
            username:true,
            displayName:true,
          }
        }
      }

    });
    res.status(201).json(comments);
  }
  catch(error: any){
    res.status(500).json({error: error.message});
  }
}

export const deletePost = async (req:AuthRequest, res:Response): Promise<any> => {
  try{
    const postsId = req.params.postId;
    const currentUserId = req.user.userId;

    const posts = await prisma.post.findUnique({
      where:{
        id: postsId
      },
      select:{
        authorId: true
      }
    });

    if (posts.authorId != currentUserId){
      return res.status(403).json({message: "Tidak punya akses untuk menghapus"});
    }

    await prisma.post.delete({
      where:{
        id: postsId,
        // authorId: currentUserId
      },
      
    });
    res.json({message: "tes delete post berhasil"});
  }
  catch(error: any){
    res.status(500).json({error: error.message});
  }
}