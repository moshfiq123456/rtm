import { Router } from "express";
import users from "./users.route";

const router = Router();

router.use("/", users);


export default router;