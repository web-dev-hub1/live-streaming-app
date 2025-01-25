
import { Router } from "express";
import { authMiddleware } from "../../../middleware/authMiddleware";
import { prisma } from "@repo/db/client";



export const supRouter : Router = Router();

supRouter.put('/change-role/:userName', authMiddleware, async(req, res) => {
    const targetRole = req.body.role;
    const userName = req.params.userName;
    try {
        const targetUser = await prisma.user.findUnique({
            where:
            {userName}
        })
        if(!targetUser){
            res.status(404).json({"error": "User not found"})
            return
        }
        if(targetRole === targetUser.role){
            res.status(400).json({"error": "User already has this role"})
            return
        }
        try {
            const newUser = await prisma.user.update({
                where:
                {userName},
                data: {role: targetRole}
            })
            res.status(200).json({"message": "Role changed successfully", 'oldRole': targetUser.role, 'updatedRole':newUser.role})
            
        } catch (error) {
            res.status(500).json({"Internal error: unable to update user in DB": error})
        }
    } catch (error) {
        res.status(500).json({"Internal error": error})
    }


})