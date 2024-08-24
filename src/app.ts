import express, {NextFunction, Application, Request, Response} from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";


const app: Application = express()
app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.get('/', (req: Request, res: Response) => {
  res.send('Hello Wrold')
})

export default app;