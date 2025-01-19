import { signinSchema,signupSchema  } from '@repo/shared-schema/sharedSchema';
import { prisma } from '@repo/db/client';
import { Router } from "express"
import bcrypt  from "bcrypt";
import dotenv from 'dotenv';
import jwt from "jsonwebtoken"

dotenv.config();


export const router: Router = Router();

router.post('/signin', async (req,res) =>{
    const signinData = signinSchema.safeParse(req.body);
    if(!signinData.success){
        res.status(400).json({"error": "Invalid input data"});
        return
    }
    try {
        const user = await prisma.user.findUnique({
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
        const jwtToken = jwt.sign({ email: user.email, userName: user.userName }, process.env.JWT_SECRET as string || 'default_secret');
        res.cookie('jwt', jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000,
            sameSite: 'strict',
          });
          res.status(200).json({ message: 'Signin successful' });
    } catch (error) {
        res.status(500).json({"error": error})
        return
    }

})

router.post('/signup', async (req,res) =>{
    const signupData = signupSchema.safeParse(req.body);
    if(!signupData.success){
        res.status(400).json({"error": "Invalid input data"});
        return
    }
    try {
        const userWithEmail = await prisma.user.findUnique(
            {
                where:{
                    email: signupData.data.email
                }
            }
        )
        if(userWithEmail){
            res.status(409).json({"error": "Email already exists"});
            return
        }
        const userWithId = await prisma.user.findUnique({
            where:{
                userName: signupData.data.userName
            }
        })
        if(userWithId){
            res.status(409).json({"error": "User ID already exists"});
            return
        }
        const hashedPassword = await bcrypt.hash(signupData.data.password, 10);
        const newUser = await prisma.user.create({
            data:{
                email: signupData.data.email,
                userName: signupData.data.userName,
                password: hashedPassword,
                role:"USER"

            }
        })
        res.status(201).json({
            "message": "User created successfully",
            "userName": newUser.userName,
            "email": newUser.email,
            "role": newUser.role
        })
        console.log(newUser);
    } catch (error) {
        res.status(500).json({"internal error": error})
    }

})




