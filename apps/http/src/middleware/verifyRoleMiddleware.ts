import { Request, Response } from "express";
import dotenv from "dotenv";
import { prisma, Role } from "@repo/db/client";
import { NextFunction } from "express";
dotenv.config();
export const verifyRoleMiddleware = (roles:Role[]) => {
  return async (req:Request, res: Response, next: NextFunction) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: req.user?.email as string,
        },
      });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      if (roles.includes(user.role)) {
        req.userDetails = user;
        next();
        return;
      }
      res.status(403).json({ message: "Forbidden" });
      return;
    } catch (error) {
      res.status(401).json({ message: "Token is not valid" });
      return;
    }
  };
};
