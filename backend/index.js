import express from'express';
const app=express();
import cookieParser from'cookie-parser';
import dotenv from'dotenv';
import cors from 'cors';
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin:true,
  credentials:true              
}));
import CONNECT_DB from './Models/db.js';
import userRoutes from'./Routes/userRoutes.js'; 

const PORT=process.env.PORT||8000; 

//connecting database  
CONNECT_DB();

//routes
app.use('/',userRoutes);


app.get('/',(req,res)=>{
  res.send('Blood Donation App API is running!')
});
app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,        // false for localhost
    sameSite: "lax",
    path: "/",
  });

  res.status(200).json({ message: "Logout successful" });
});
//start server
app.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`)
});