import { Request, Response, NextFunction } from "express";
import  { JwtPayload } from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
interface AuthRequest extends Request {
    user?: JwtPayload;
  }
export const adminMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user;
        if (!user || user.role !== 'admin') {
            res.status(403).json({ error: "Access denied, Admin Only"})
            return;
        }
        next();
    } catch (error) {
        res.status(401).json({ message: "Token is not valid" });
    }
};
