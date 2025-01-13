import { signinSchema } from '@repo/shared-schema';
import { prismaClient } from '@repo/db';
import { Router } from "express"
import bcrypt  from "bcrypt";


import jwt from "jsonwebtoken"

export const router: Router = Router();

router.post('/signin', async (req,res) =>{
    const signinData = signinSchema.safeParse(req.body);
    if(!signinData.success){
        res.status(400).json({"error": "Invalid input data"});
        return
    }
    try {
        const user = await prismaClient.user.findUnique({
            where: {
                email: signinData.data.email
            }
        })
        if(!user){
            res.status(404).json({"error": "User not found"});
            return
        }
        const isMatch = await bcrypt.compare(signinData.data.password, user.password);
        if(!isMatch){
            res.status(401).json({"error": "Invalid credentials"});
            return;
        }
        const jwtToken = jwt.sign(user.id, process.env.JWT_SECRET as string || 'default_secret');
        res.status(200).json({"token":jwtToken, "userId": user.userName});
    } catch (error) {
        res.status(500).json({"error": error})
        return
    }

})


