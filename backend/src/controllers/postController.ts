import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/requireAuth';
import prisma from '../lib/prisma';

export const createPost = async (req: AuthRequest, res:Response): Promise<any> => {
  try{
    const {body, title} = req.body;
    const userId = req.user.userId;

    if (!body) {
      return res.status(400).json({message: "Tidak boleh kosong"});
    }
    const newPost = await prisma.post.create({
      data: {
        title,
        body,
        authorId: userId,
      },
      include: {author : {select : {username : true, displayName: true}}}
    });
    res.status(201).json({message: "Postingan berhasil terkirim", post: newPost});
  }
  catch (error: any){
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
          author: {select : {id:true, username:true, displayName: true}}
        }
      });
      res.json(posts);
    }
  }
  catch (error: any){
    res.status(500).json({error: error.message});
  }
};

export const getAllPosts = async (req: Request, res: Response): Promise<any> => {
  try {
    // Mengambil semua postingan dari database
    // include: digunakan untuk melakukan "Join" agar nama pembuatnya (User) ikut terbawa
    const posts = await prisma.post.findMany({
      include: {
        author: { // Asumsi di skema kamu relasinya bernama 'author' atau 'user'
          select: { username: true, displayName: true } 
        }
      },
      orderBy: {
        createdAt: 'desc' // Urutkan dari yang paling baru
      }
    });

    res.json(posts);
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
    const currentUserId = req.user.userId;
    const likePost = await prisma.postLike.findMany({
      where : {
        userId: currentUserId,
      },
      select : {
        postId: true
      }
    });
    const likepostId = likePost.map(f => f.postId);
    
    const posts = await prisma.post.findMany({
      where : {
        id: {in: likepostId}
      },
      orderBy: {createdAt: 'desc'},
      include: {
        author: {select : {id:true, username:true, displayName: true}}
      }

    });
    res.json(posts);
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
    const currentUserId = req.user.userId;
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
        author: {select : {id:true, username:true, displayName: true}}
      }
    })
    res.json(posts);
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
          }
        },
      },
      
    });
    if(!posts){
      return res.status(400).json({message: "couldn't find post"});
    }

    const [liked, saved] = await Promise.all([
      prisma.postLike.findUnique({
        where: {userId_postId: {userId: currentUserId, postId: postsId}}

      }),
      prisma.postSave.findUnique({
        where: {userId_postId: {userId: currentUserId, postId: postsId}}
      })
    ])
    const formattedPost = {
      ...posts,
      isLikedByMe: !!liked,
      isSavedByMe: !!saved,
    };
    // delete (formattedPost as any).likes;
    // delete (formattedPost as any).saves;
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