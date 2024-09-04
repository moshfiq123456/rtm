import mongoose from "mongoose";
import { config } from "dotenv";

config();

const dev = {
  app: {
    port: process.env.PORT  || 4000,
  },
  db: {
    url: process.env.DB || "mongodb://localhost:27017/rtm",
  },
};

export default dev;