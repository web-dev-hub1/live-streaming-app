
import { Router } from "express";
import { authMiddleware } from "../../../middleware/authMiddleware";
import { prisma } from "@repo/db/client";
import { verifyRoleMiddleware } from "../../../middleware/verifyRoleMiddleware";
import { rolesEnumSchema } from "@repo/shared-schema/sharedSchema";



export const supRouter : Router = Router();

supRouter.put('/change-role/:userName', authMiddleware,verifyRoleMiddleware(["SUPER_ADMIN"]), async(req, res) => {
    const parsedBody = rolesEnumSchema.safeParse(req.body);
    if(!parsedBody.success) {
        res.status(400).json({"error": "Invalid role format"})
        return
    }
    const targetRole = parsedBody.data.role;
    
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
            res.status(400).json({"error": `User is already ${targetRole}`})
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