import express from'express';
import{registerUser,loginUser} from'../Controllers/userController.js';
import {  getDataController}from'../Controllers/getDataController.js';
import authMiddleware from '../Middlewares/authMiddleware.js';

const router=express.Router();


router.post("/register", registerUser); 
router.post("/login", loginUser);       
router.get('/profile',authMiddleware,getDataController);

export default router;