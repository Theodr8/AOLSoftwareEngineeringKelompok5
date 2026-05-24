import { Request, Response, NextFunction } from "express";
import jwt  from "jsonwebtoken";

export interface AuthRequest extends Request{
    user?: any;
}

export const requireAuth = (req: AuthRequest,res: Response, next: NextFunction): any => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({message: "Akses ditolak, token tidak diketahui"});
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({message: "Akses ditolak, token tidak diketahui"});
    }

    try{
        const secret = process.env.JWT_SECRET || 'tes101';
        const decodedPayload = jwt.verify(token,secret); 

        req.user = decodedPayload;

        next();
    } catch (error){
        return res.status(401).json({message : "Token invalid"});
    }
};
