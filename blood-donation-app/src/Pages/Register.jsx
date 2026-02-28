import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("donor");
  const [cshow, csetShow] = useState(true);
  const [show, setShow] = useState(true);

  const onSubmit = async(data) => {
    try{
      let payload={};
      if(userType==='donor'){
        payload={ 
        role: "donor",
        userName: data.fullName,
        email: data.email,
        password: data.password,
        phoneNumber: data.phone,
        dateOfBirth: data.dateofbirth,
        gender: data.gender,
        bloodGroup: data.blood,
      };
      } else if (userType === "hospital") {
      payload = {
        role: "hospital",
        hospitalName: data.hospitalName,
        email: data.hemail,
        password: data.hpassword,
        phoneNumber: data.hphone,
        registrationNumber: data.hregistration,
        contactPersonName: data.hcontactName,
        contactPersonNumber: data.hcontactNumber,
        address: data.hlocation,
      };
    } else if (userType === "organization") {
      payload = {
        role: "organization",
        organizationName: data.organizationName,
        email: data.oemail,
        password: data.opassword,
        phoneNumber: data.ophone,
        registrationNumber: data.oregistration,
        contactPersonName: data.ocontactName,
        contactPersonNumber: data.ocontactNumber,
        address: data.olocation,
      };
    }
      
        const response = await axios.post(
        "http://localhost:8000/register",
        payload, // send the entire form data
        { withCredentials: true } // for the cookies
      );
      console.log("Backend response:", response.data);
      toast.success(response.data.message||'Signup successful');


      reset();
    }
  catch(err){
    console.error(err.response?.data?.message || err.message);
      alert(err.response?.data?.message || "Something went wrong");

  }

   
  };




  const donorSchema = Yup.object().shape({
    fullName: Yup.string().required("Enter full name"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Enter email addresss"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Enter password"),
    confirmPassword: Yup.string()
      .required("Enter confirm password")
      .oneOf([Yup.ref("password")], "password and confirm password must match"),
    phone: Yup.string()
      .required("Enter phone number")
      .matches(/^[0-9]{10}$/,"Phone number should be number ", "Phone number must be 10 digits"),
    dateofbirth: Yup.date("Enter valid date").required("Enter date of birth"),
    gender: Yup.string().required("Choose your gender"),
    blood:Yup.string().required("Choose your blood group"),
    agreed: Yup.boolean()
      .oneOf([true], "You must agree that the information is correct")
      .required("Agreement is required"),
  });

  const hospitalSchema = Yup.object().shape({
    hospitalName: Yup.string().required("Enter hospital name"),
    hemail: Yup.string()
      .email("Invalid email format")
      .required("Enter email address"),
    hpassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Enter password"),
    hconfirmPassword: Yup.string()
      .required("Enter confirm password")
      .oneOf([Yup.ref("hpassword")], "password and confirm password must match"),
    hphone: Yup.string()
      .required("Enter phone number")
      .matches(/^[0-9]{10}$/,"Phone number should be number ", "Phone number must be 10 digits"),
    hregistration: Yup.string().required("Enter hospital registration number"),
    hcontactName: Yup.string().required("Enter contact person name"),
    hcontactNumber: Yup.string()
      .required("Enter phone number")
      .matches(/^[0-9]{10}$/, "Phone number should be number ","Phone number must be 10 digits"),
    hlocation: Yup.string().required("Enter location of hospital"),
    agreeh: Yup.boolean()
      .oneOf([true], "You must agree that the information is correct")
      .required("Agreement is required"),
  });

  const organizationSchema = Yup.object().shape({
    organizationName: Yup.string().required("Enter organization name"),
    oemail: Yup.string()
      .email("Invalid email format")
      .required("Enter email address"),
    opassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Enter password"),
    oconfirmPassword: Yup.string()
      .required("Enter confirm password")
      .oneOf([Yup.ref("opassword")], "password and confirm password must match"),
    ophone: Yup.string('')
      .required("Enter phone number")
      .matches(/^[0-9]{10}$/, "Phone number should be number ","Phone number must be 10 digits"),
    oregistration: Yup.string().required(
      "Enter organization registration number"
    ),
    ocontactName: Yup.string().required("Enter contact person name"),
    ocontactNumber: Yup.string()
      .required("Enter phone number")
      .matches(/^[0-9]{10}$/,"Phone number should be number ", "Phone number must be 10 digits"),
    olocation: Yup.string().required("Enter location of organization"),
    agreeo: Yup.boolean()
      .oneOf([true], "You must agree that the information is correct")
      .required("Agreement is required"),
  });

  const chooseSchema = (userType) => {
    switch (userType) {
      case "donor":
        return donorSchema;
      case "hospital":
        return hospitalSchema;
      case "organization":
        return organizationSchema;
      default:
        return Yup.object({});
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(chooseSchema(userType)),
  });
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="m-3 flex items-center justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="shadow max-w-90 p-4 gap-4  space-y-3 ubuntu-regular  rounded-3xl  border border-blue-100 inline  flex-col"
        >
          <ArrowLeft
            className="cursor-pointer hover:bg-gray-300  bg-gray-100 rounded-xl "
            onClick={() => {
              navigate("/");
            }}
          />
          <h1 className="text-center font-medium text-2xl">Register</h1>
          <label>I am a *</label>
          <div className="flex gap-5">
            <label
              className="
        "
            >
              <input
                type="radio"
                name="userType"
                value="donor"
                role="donor"
                checked={userType === "donor"}
                onChange={(e) => setUserType(e.target.value)}
                className="m-1"
              />
              Donor
            </label>

            <label className=" ">
              <input
                type="radio"
                name="userType"
                value="hospital"
                role="hospital"
                checked={userType === "hospital"}
                onChange={(e) => setUserType(e.target.value)}
                className="m-1"
              />
              Hospital
            </label>

            <label
              className="
        "
            >
              <input
                type="radio"
                name="userType"
                value="organization"
                role="organization"
                checked={userType === "organization"}
                onChange={(e) => {
                  setUserType(e.target.value);
                }}
                className="m-1"
              />
              Organization
            </label>
          </div>

          {userType === "donor" && (
            <div>
              <label>First Name*</label>
              <input
                type="text"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder=" Enter your full name"
                {...register("fullName")}
              />
              <p className="text-red-500 text-sm">{errors.fullName?.message}</p>

              <label>Email*</label>
              <input
                type="text"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder=" Enter your email address"
                {...register("email")}
              />
              <p className="text-red-500 text-sm">{errors.email?.message}</p>

              <label>Password*</label>
              <div className=" flex relative w-full">
                <input
                  className="w-full border p-2   rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  type={show ? "password" : "text"}
                  placeholder="Enter your Password"
                  {...register("password")}
                />
                <button
                  className="absolute  right-2 p-3 cursor-pointer"
                  type="button"
                  onClick={() => setShow(!show)}
                >
                  {show ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <p className="text-red-500 text-sm">{errors.password?.message}</p>

              <label>Confirm Passsword*</label>
              <div className=" flex relative w-full">
                <input
                  className="w-full border p-2   rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  type={cshow ? "password" : "text"}
                  placeholder="Enter  Password again"
                  {...register("confirmPassword")}
                />
                <button
                  className="absolute  right-2 p-3 cursor-pointer"
                  type="button"
                  onClick={() => csetShow(!cshow)}
                >
                  {cshow ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <p className="text-red-500 text-sm">
                {errors.confirmPassword?.message}
              </p>

              <label>Phone Number*</label>
              <input
                type="text"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder=" Enter phone number"
                {...register("phone")}
              />
              <p className="text-red-500 text-sm">{errors.phone?.message}</p>

              <label>Date of birth*</label>
              <input
                type="date"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                {...register("dateofbirth")}
              />

              <label>Gender*</label>
              <div className="flex gap-4 flex-wrap">
                <label className="flex gap-1">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    {...register("gender")}
                  />
                  Male
                </label>
                <label className="flex gap-1">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    {...register("gender")}
                  />
                  Female
                </label>
                <label className="flex gap-1">
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    {...register("gender")}
                  />
                  Other
                </label>
                <p className="text-red-500 text-sm">{errors.gender?.message}</p>
              </div>

              <label>Blood Group*</label>
              <div className="flex flex-row flex-wrap gap-4">

              
              <label className="flex gap-1">
                  <input
                    type="radio"
                    name="blood"
                    value="A+"
                    {...register("blood")}
                  />
                  A+
                </label>
               
                <label className="flex gap-1">
                  <input
                    type="radio"
                    name="blood"
                    value="A-"
                    {...register("blood")}
                  />
                  A-
                </label>
                <label className="flex gap-1">
                  <input
                    type="radio"
                    name="blood"
                    value="B+"
                    {...register("blood")}
                  />
                  B+
                </label>
                <label className="flex gap-1">
                  <input
                    type="radio"
                    name="blood"
                    value="B-"
                    {...register("blood")}
                  />
                  B-
                </label>
                <label className="flex gap-1">
                  <input
                    type="radio"
                    name="blood"
                    value="O+"
                    {...register("blood")}
                  />
                  O+
                </label>

                <label className="flex gap-1">
                  <input
                    type="radio"
                    name="blood"
                    value="O-"
                    {...register("blood")}
                  />
                  O-
                </label>
                <label className="flex gap-1">
                  <input
                    type="radio"
                    name="blood"
                    value="AB+"
                    {...register("blood")}
                  />
                  AB+
                </label>
                <label className="flex gap-1">
                  <input
                    type="radio"
                    name="blood"
                    value="AB-"
                    {...register("blood")}
                  />
                  AB-
                </label>
                <p className="text-red-500 text-sm">{errors.blood?.message}</p>
                </div>

              

              
                <input  type="checkbox" {...register("agreed")} />
                <label className="p-1">I agree that
                the information provided is correct</label>
              

              <p className="text-red-500 text-sm">{errors.agreed?.message}</p>

              <button
                type="submit"
                className="cursor-pointer  w-full bg-sky-500 text-white py-2 rounded-xl hover:bg-sky-600 transition"
              >
                Submit
              </button>
            </div>
          )}

          {userType === "hospital" && (
            <div>
              <label>Hospital Name*</label>
              <input
                type="text"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder=" Enter Hospital Name"
                {...register("hospitalName")}
              />
              <p className="text-red-500 text-sm">
                {errors.hospitalName?.message}
              </p>

              <label>Email*</label>
              <input
                type="text"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder=" Enter your email address"
                {...register("hemail")}
              />
              <p className="text-red-500 text-sm">{errors.hemail?.message}</p>

              <label>Password*</label>
              <div className=" flex relative w-full">
                <input
                  className="w-full border p-2   rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  type={show ? "password" : "text"}
                  placeholder="Enter your Password"
                  {...register("hpassword")}
                />
                <button
                  className="absolute  right-2 p-3 cursor-pointer"
                  type="button"
                  onClick={() => setShow(!show)}
                >
                  {show ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <p className="text-red-500 text-sm">
                {errors.hpassword?.message}
              </p>

              <label>Confirm Passsword*</label>
              <div className=" flex relative w-full">
                <input
                  className="w-full border p-2   rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  type={cshow ? "password" : "text"}
                  placeholder="Enter  Password again"
                  {...register("hconfirmPassword")}
                />
                <button
                  className="absolute  right-2 p-3 cursor-pointer"
                  type="button"
                  onClick={() => csetShow(!cshow)}
                >
                  {cshow ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <p className="text-red-500 text-sm">
                {errors.hconfirmPassword?.message}
              </p>

              <label>Phone Number*</label>
              <input
                type="text"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder=" Enter phone number of hospital"
                {...register("hphone")}
              />
              <p className="text-red-500 text-sm">{errors.hphone?.message}</p>

              <label>Hospital Registration Number*</label>
              <input
                type="text"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder=" Enter Hospital Registration Number "
                {...register("hregistration")}
              />
              <p className="text-red-500 text-sm">
                {errors.hregistration?.message}
              </p>

              <label>Contact Person Name*</label>
              <input
                type="text"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder=" Enter contact person name "
                {...register("hcontactName")}
              />
              <p className="text-red-500 text-sm">
                {errors.hcontactName?.message}
              </p>

              <label>Contact Person Number*</label>
              <input
                type="text"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder=" Enter contact person Phone Number "
                {...register("hcontactNumber")}
              />
              <p className="text-red-500 text-sm">
                {errors.hcontactNumber?.message}
              </p>

              <label>Location*</label>
              <input
                type="text"
                placeholder="Enter hospital Location"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                {...register("hlocation")}
              />
              <p className="text-red-500 text-sm">
                {errors.hlocation?.message}
              </p>

              <input type="checkbox" {...register("agreeh")} />
              <label className="p-1">I agree that the information provided is correct</label>

              <p className="text-red-500 text-sm">{errors.agreeh?.message}</p>

              <button
                type="submit"
                className="cursor-pointer  w-full bg-sky-500 text-white m-1 py-2 rounded-xl hover:bg-sky-600 transition"
              >
                Submit
              </button>
            </div>
          )}

          {userType === "organization" && (
            <div>
              <label>Organization Name*</label>
              <input
                type="text"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder=" Enter Organization Name"
                {...register("organizationName")}
              />
              <p className="text-red-500 text-sm">
                {errors.organizationName?.message}
              </p>

              <label>Email*</label>
              <input
                type="text"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder=" Enter your email address"
                {...register("oemail")}
              />
              <p className="text-red-500 text-sm">{errors.oemail?.message}</p>

              <label>Password*</label>
              <div className=" flex relative w-full">
                <input
                  className="w-full border p-2   rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  type={show ? "password" : "text"}
                  placeholder="Enter your Password"
                  {...register("opassword")}
                />
                <button
                  className="absolute  right-2 p-3 cursor-pointer"
                  type="button"
                  onClick={() => setShow(!show)}
                >
                  {show ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <p className="text-red-500 text-sm">
                {errors.opassword?.message}
              </p>

              <label>Confirm Passsword*</label>
              <div className=" flex relative w-full">
                <input
                  className="w-full border p-2   rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  type={cshow ? "password" : "text"}
                  placeholder="Enter  Password again"
                  {...register("oconfirmPassword")}
                />
                <button
                  className="absolute  right-2 p-3 cursor-pointer"
                  type="button"
                  onClick={() => csetShow(!cshow)}
                >
                  {cshow ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <p className="text-red-500 text-sm">
                {errors.oconfirmPassword?.message}
              </p>

              <label>Phone Number*</label>
              <input
                type="text"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder=" Enter phone number of organization"
                {...register("ophone")}
              />
              <p className="text-red-500 text-sm">{errors.ophone?.message}</p>

              <label>Organization Registration Number*</label>
              <input
                type="text"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder=" Enter Organization Registration Number "
                {...register("oregistration")}
              />
              <p className="text-red-500 text-sm">
                {errors.oregistration?.message}
              </p>

              <label>Contact Person Name*</label>
              <input
                type="text"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder=" Enter contact person name "
                {...register("ocontactName")}
              />
              <p className="text-red-500 text-sm">
                {errors.ocontactName?.message}
              </p>

              <label>Contact Person Number*</label>
              <input
                type="text"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder=" Enter contact person Phone Number "
                {...register("ocontactNumber")}
              />
              <p className="text-red-500 text-sm">
                {errors.ocontactNumber?.message}
              </p>

              <label>Location*</label>
              <input
                type="text"
                placeholder="Enter Organization Location"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                {...register("olocation")}
              />
              <p className="text-red-500 text-sm">
                {errors.olocation?.message}
              </p>
              

              
              <input type="checkbox" {...register("agreeo")} />
              <label className="p-1">I agree that the information provided is correct</label>

              <p className="text-red-500 text-sm">{errors.agreeo?.message}</p>
              
              <button
                type="submit"
                className="cursor-pointer  w-full bg-sky-500 text-white m-1 py-2 rounded-xl hover:bg-sky-600 transition"
              >
                Submit
              </button>
            </div>
          )}
        </form>
      </div>
    </>
  );
}
