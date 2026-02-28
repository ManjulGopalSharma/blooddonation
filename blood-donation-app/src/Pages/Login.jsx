import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";





export default function Login() {
  const navigate = useNavigate();
  const [show, setShow] = useState(true);
    

  const schema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid Email Format")
      .required("Enter Email Address"),
    password: Yup.string().required("Enter Password"),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async(data) => {
    
    try{
      const res=await axios.post('http://localhost:8000/login',{
        email:data.email,
        password:data.password
      },
      {withCredentials:true} //sends/receives cookies
    
    );
    const user = res.data.user;
     toast.success(res.data.message);
     if (user.role === "donor") {
      navigate("/dashboard-donor");
    } else if (user.role === "hospital") {
      navigate("/dashboard-hospital");
    }
    else if(user.role==="organization"){
      navigate('/dashboard-hospital');
    }
    else toast.error("Login failed");
    

    }
    catch(err){
       console.error(err);
    toast.error(err.response?.data?.message || "Something went wrong");

    }
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className=" min-h-screen mx-5 flex justify-center items-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className=" shadow  lg:w-2/5 lg:p-5  p-5 gap-4  space-y-3 ubuntu-regular  rounded-3xl  border border-blue-100"
        >
          <ArrowLeft
            className="cursor-pointer hover:bg-gray-300  bg-gray-100 rounded-xl"
            onClick={() => {
              navigate('/');
            }}
          />

          <h1 className="text-center font-medium text-2xl ">Login</h1>
          <label>Email*</label>
          <input
            className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
            type="email"
            placeholder="Enter your Email"
            {...register("email")}
          />
          <p className="text-red-500 text-sm">{errors.email?.message}</p>

          <label>Password*</label>
          <div className=" flex relative w-full">
            <input
              className="w-full border p-2   rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
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

          <button
            type="submit"
            className=" cursor-pointer  w-full bg-sky-500 text-white py-2 rounded-xl hover:bg-sky-600 transition"
          
          >
            Login
          </button>
          <div className="flex justify-center">
            <p>Don't have an account? {"  "}</p>
            <Link
              to="/register"
              className="text-red-500 font-semibold hover:underline hover:text-red-700 cursor-pointer"
            >
              {" "}
              Signup
            </Link>
          </div>
        </form>
      </div>
    </>
  );
 }
