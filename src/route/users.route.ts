import express from 'express';
import { acceptFriendRequest, DeleteUser, GetAccessToken, getFriendList, GetUser, Login, Logout, sendFriendRequest, SignUp, UpdatePassword, UserList } from '../controller/loginSytem.controller';
import auth from '../middlewares/auth.middleware';


const router = express.Router();

router.get('/users',auth,UserList);
router.get('/users/:id',auth, GetUser);
router.post('/login',Login);
router.post('/signup',SignUp);
router.delete('/delete/:id',DeleteUser);
router.patch('/update-password',UpdatePassword);
router.post('/accept-friendrequest',auth,acceptFriendRequest);
router.post('/send-friendrequest',auth,sendFriendRequest);
router.get('/friend-list',auth,getFriendList)
router.post('/refreshtoken',GetAccessToken);
router.delete('/logout',Logout);



export default router;