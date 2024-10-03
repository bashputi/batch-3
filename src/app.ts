import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import globalErrorHandler from './app/middleware/globalErrorHandler';
import NotFound from './app/middleware/notFound';
import router from './app/route';


const app: Application = express()
const corsOptions = {
  origin: 'http://localhost:5173', 
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use("/api", router);


app.get('/', (req: Request, res: Response) => {
  res.send('Hello Wrold')
})

app.use(globalErrorHandler);
app.use(NotFound);

export default app;