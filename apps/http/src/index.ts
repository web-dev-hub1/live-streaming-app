import express, { Request, Response } from 'express';
import { router } from './routes/v1';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();


const app = express();
const port = process.env.HTTP_PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", router);


app.get('/', async (req: Request, res: Response) => {
    res.status(200).send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});