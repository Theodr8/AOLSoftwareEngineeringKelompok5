import multer from "multer";
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file,cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const storagePost = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/post/');
    },
    filename: (req, file,cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});


const fileFilter = (req: any, file: any, cb:any) => {
    if (file.mimetype.startsWith('image/')){
        cb(null,true);
    }
    else {
        cb(new Error('Ekstension tidak diperbolehkan'), false);
    }
};
export const upload = multer ({
    storage: storage,
    fileFilter: fileFilter,
    limits: {fileSize: 5 * 1024 * 1024}
});

export const uploadPost = multer ({
    storage: storagePost,
    fileFilter: fileFilter,
    limits: {fileSize: 5 * 1024 * 1024}
})