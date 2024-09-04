import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import {config} from "dotenv";
// Define a custom interface for the Request object
interface AuthenticatedRequest extends Request {
  user?: any; // Define the shape of the user object, it could be any type or an interface representing the actual user object
}

const auth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(403).json({ error: true, message: "Access Denied: No token provided" });
    }

    // Check for "Bearer " prefix and extract the token
    const tokenParts = token.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      return res.status(403).json({ error: true, message: "Access Denied: Invalid token format" });
    }

    const tokenDetails = jwt.verify(tokenParts[1], process.env.ACCESS_TOKEN_PRIVATE_KEY as string);
    req.user = tokenDetails;
    next();
  } catch (err:any) {
    console.error("JWT Verification Error:", err);

    if (err.name === "JsonWebTokenError") {
      return res.status(403).json({ error: true, message: "Access Denied: Invalid token" });
    }

    // Handle other errors
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

export default auth;
