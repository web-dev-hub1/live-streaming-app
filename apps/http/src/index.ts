import express, { Request, Response } from 'express';
import { prisma } from '@repo/db/client'
import { router } from './routes/v1';
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/v1", router);


app.get('/', async (req: Request, res: Response) => {
    res.status(200).send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});