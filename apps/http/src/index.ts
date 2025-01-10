import express, { Request, Response } from 'express';
import { prisma } from '@repo/db'
const app = express();
const port = process.env.PORT || 3000;

app.get('/', async (req: Request, res: Response) => {
    //testing prisma here
    const response = await prisma.user.create({
        data:{
            email:"abc@gmail.com",
            userName:"abc",
            password:"pass123",
        }
    })
    res.status(200).send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});