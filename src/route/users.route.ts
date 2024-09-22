import express from 'express';
import { acceptFriendRequest, DeleteUser, GetAccessToken, getFriendList, GetUser, Login, Logout, sendFriendRequest, SignUp, UpdatePassword, UserList } from '../controller/loginSytem.controller';
import auth from '../middlewares/auth.middleware';
import { CreateGroup, GetUserGroups } from '../controller/group.controller';


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
router.post('/create-group',auth,CreateGroup)
router.get('/groups',auth,GetUserGroups)


export default router;