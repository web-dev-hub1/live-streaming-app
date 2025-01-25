
import { Router } from "express";
import { authMiddleware } from "../../../middleware/authMiddleware";
import { prisma } from "@repo/db/client";
import { verifyRoleMiddleware } from "../../../middleware/verifyRoleMiddleware";
import { rolesEnumSchema } from "@repo/shared-schema/sharedSchema";



export const supRouter : Router = Router();

supRouter.put('/change-role/:userName', authMiddleware,verifyRoleMiddleware(["SUPER_ADMIN"]), async(req, res) => {
    const targetRole = req.body.role;
    if(!targetRole){
        res.status(400).json({"error": "Role is required"})
        return
    }
    const zodRole = rolesEnumSchema.safeParse(targetRole)
    if(!zodRole.success){
        res.status(400).json({"error": "role type is not correct"})
        return
    }
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