import express from 'express';
import { DeleteUser, GetAccessToken, GetUser, Login, Logout, SignUp, UpdatePassword, UserList } from '../controller/loginSytem.controller';
import auth from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/users',auth,UserList);
router.get('/users/:id',auth, GetUser);
router.post('/login',Login);
router.post('/signup',SignUp);
router.delete('/delete/:id',DeleteUser);
router.patch('/update-password',UpdatePassword);

router.post('/refreshtoken',GetAccessToken);
router.delete('/logout',Logout);



export default router;