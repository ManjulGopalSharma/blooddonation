import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Donor, Hospital,Organization } from'../Models/User.js';
import generateToken from "../Utils/generateToken.js";


const registerUser=async(req ,res)=>{
  try{
    const {role}=req.body;
    console.log(role);
    let user;
    if(role==='donor'){
      const{userName,email,password,phoneNumber,dateOfBirth,gender,bloodGroup,province, district, city}=req.body;
      if(!userName||!email||!password||!phoneNumber||!dateOfBirth||!gender||!bloodGroup||!province||!district||!city){
        return res.status(400).json({message:'Missing donor fields'});
      }
      const existingDonor=await Donor.findOne({email});
      if(existingDonor)return res.status(400).json({message:'Donor already exists'});
      const hashedPassword=await bcrypt.hash(password,10);
      user=await Donor.create({role,userName,email,password:hashedPassword,phoneNumber,dateOfBirth,gender,bloodGroup,province, district, city});

    }
    else if(role==='hospital'){
      const {hospitalName,email,password,phoneNumber,registrationNumber,contactPersonName,contactPersonNumber,province, district, city,streetAddress}=req.body;
      if(!hospitalName||!email||!password||!phoneNumber||!registrationNumber||!contactPersonName||!contactPersonNumber||!province||!district||!city||!streetAddress){
         return res.status(403).json({message:'missing hospital field'});
      }
      const existingHospital = await Hospital.findOne({ email });
      if(existingHospital) return res.status(400).json({message:'Hospital already exists'});
      const hashedPassword=await bcrypt.hash(password,10);
      user=await Hospital.create({role,hospitalName,email,password:hashedPassword,phoneNumber,registrationNumber,contactPersonName,contactPersonNumber,province, district, city,streetAddress});

      

    }
    else if(role==='organization'){
      const {organizationName,email,password,phoneNumber,registrationNumber,contactPersonName,contactPersonNumber,province, district, city,streetAddress}=req.body;
      if(!organizationName||!email||!password||!phoneNumber||!registrationNumber||!contactPersonName||!contactPersonNumber||!province||!district||!city||!streetAddress){
         return res.status(403).json({message:'missing organization field'});
      }
      const existingOrganization = await Organization.findOne({ email });
      if(existingOrganization) return res.status(400).json({message:'Organization already exists'});
      const hashedPassword=await bcrypt.hash(password,10);
      user=await Organization.create({role,organizationName,email,password:hashedPassword,phoneNumber,registrationNumber,contactPersonName,contactPersonNumber,province, district, city,streetAddress});

      

    }
    else {
  return res.status(400).json({ message: "Invalid role" });
}
res.status(201).json({message:`${role} registered sucessfully`,user});


  }
  catch(error){
    return res.status(500).json({ message: error.message });


  }
};

const loginUser=async(req,res)=>{
  try{
    const{email,password}=req.body;
    if(!email||!password){
      return res.status(400).json({message:'email and password are required'});
    }
    let user =
      (await Donor.findOne({ email })) ||
      (await Hospital.findOne({ email })) ||
      (await Organization.findOne({ email }));
   
    if(!user){
      return res.status(404).json({ message: "User not found" });

    }
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
      return res.status(400).json({message:"Invalid credentials"});
    }
    const role = user.role;
const token = generateToken(user);
res.cookie("token", token, {
      httpOnly: true,
      secure: false, //true in  https as it is secure
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000 
    });

 res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        role,
        email: user.email,
      },
    });

   

  }
  catch(error){
    res.status(500).json({ message: error.message });

  }
}

export{registerUser,loginUser};