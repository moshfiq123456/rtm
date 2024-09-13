import cors from 'cors';
import express, {NextFunction, Request,Response} from "express";
import { config } from "dotenv";
import routes from './route/routes';
import dbConnect from './config/db';
const app = express();
config();
dbConnect();



app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors()); 

app.use("/api/v1/private",routes);

app.get("/",(req:Request,res:Response)=>{
  
  try{
    res.status(200).json({
      message:"welcome"
    })
  }catch(err:any){
    res.status(500).json({
      message:"server error"
    })
  }
})
app.use((req:Request, res:Response, next:NextFunction) => {
    res.status(404).json({
      message: "route not found",
    });
  });
  
app.use((err:Error, req:Request, res:Response) => {
    res.status(500).json({
      message: err.message,
    });
  });

export default app;