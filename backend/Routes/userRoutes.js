import express from'express';
import{registerUser,loginUser} from'../Controllers/userController.js';
import {  getDataController}from'../Controllers/getDataController.js';
import authMiddleware from '../Middlewares/authMiddleware.js';
import { scheduleCamp,getCamp } from '../Controllers/campController.js';

const router=express.Router();


router.post("/register", registerUser); 
router.post("/login", loginUser);       
router.get('/profile',authMiddleware,getDataController);
router.get('/dashboard-donor',authMiddleware,getCamp)
// router.get('/dasboard-hospital')
// router.post('/dasboard-hospital/emergency-request')
router.post('/dashboard-hospital/blood-camp',authMiddleware,scheduleCamp)
router.get('/dashboard-hospital/donor-list', getCamp)


export default router;