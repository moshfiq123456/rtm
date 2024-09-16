import mongoose from "mongoose";
import { config } from "dotenv";

config();

const dev = {
  app: {
    port: process.env.PORT  || 4000,
  },
  db: {
    url:  "mongodb+srv://tonyhuda74:Tonyhuda1234567@cluster0.nfqgg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  },
};

export default dev;