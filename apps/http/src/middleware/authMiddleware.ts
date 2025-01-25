import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers["authorization"];

    if (!token) {
      res
        .status(401)
        .json({ message: "No authentication token, access denied" });
      return;
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET || "") as JwtPayload
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
