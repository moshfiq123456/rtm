import express from 'express';
import { CreateGroup } from '../controller/group.controller';
import auth from '../middlewares/auth.middleware';
const router = express.Router();

router.post('/create-group',auth,CreateGroup);

export default router;