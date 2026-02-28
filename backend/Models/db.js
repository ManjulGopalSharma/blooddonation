import mongoose from'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const MONGO_URL=process.env.MONGO_URL;

const CONNECT_DB=async()=>{
  try{
   await mongoose.connect(MONGO_URL);
   console.log('mongo db connected sucessfully')

  }
  catch(error){
    console.error('mongo connection error',error);
    process.exit(1);

  }
};

export default CONNECT_DB;
