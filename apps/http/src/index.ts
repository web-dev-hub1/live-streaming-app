import express, { Request, Response } from 'express';
import { prisma } from '@repo/db'
const app = express();
const port = process.env.PORT || 3000;

app.get('/', async (req: Request, res: Response) => {
    res.status(200).send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});