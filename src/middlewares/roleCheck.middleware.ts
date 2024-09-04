import { NextFunction, Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user: { roles: string[] }; // Define the shape of the user object
}

const roleCheck = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    roles.push("user");
    if (roles.some(role => req.user.roles.includes(role))) {
      next();
    } else {
      res.status(403).json({ error: true, message: "You are not authorized" });
    }
  };
};

export default roleCheck;