import ContactImage from'../assets/ContactImage.jpg';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import toast, { Toaster } from 'react-hot-toast';




export default function Contact(){


  const onSubmit = () => {
    reset();
    toast.success('Form Submitted Sucessfully!')
  };


  const schema=Yup.object().shape({
    fullName:Yup.string().required("Full Name is required"),
    email:Yup.string().email("Invalid Email Format").required("Email Address is required"),
    subject:Yup.string(),
    phoneNumber:Yup.number().required("Phone Number is required"),
    message:Yup.string().required("Message is required").min(10,'Message must be atleast 10 characters').max(500,'Message cannot exceed 500 characters')
  })

  const{register,handleSubmit,reset,formState:{errors}}=useForm({
    resolver: yupResolver(schema),
   });

  return(
  <div className=''>

 

    <Toaster position="top-center"reverseOrder={false}/>
    <section className="flex flex-col-reverse md:flex-row gap-4 bg-white   ">
      <div className="shadow w-full lg:w-1/2 md:p-10  rounded-3xl border border-blue-100 cursor-pointer flex flex-col justify-start items-center ">
        <h1 className='alfa-slab-one-bold text-red-900  text-center  md:text-2xl'>A single message can start a journey</h1>
        <h1 className='alfa-slab-one-bold text-red-700  md:text-2xl font-extrabold p-2 underline text-center '>A single donation can save a life.</h1>
        <img src={ContactImage} alt='blood-donation-image' className="w-100  object-contain cursor-pointer transition-transform duration-500 hover:scale-120  "/>

        


      </div>

      <form  onSubmit={handleSubmit(onSubmit)} className="shadow w-full lg:w-1/2  p-5 gap-4  space-y-3 ubuntu-regular  rounded-3xl  border border-blue-100">
        <h1 className='text-2xl  text-center font-extrabold text-sky-600 '>Contact Us</h1>

        <label>Full Name*</label>
        <input type='text'  className='w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600' placeholder=' Enter your full name' {...register("fullName")}/>
        <p className="text-red-500 text-sm">
          {errors.fullName?.message}
        </p>

        <label>Email*</label>
        <input type='email'  className='w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600' placeholder=' Enter your Email Address' {...register("email")}/>
        <p className="text-red-500 text-sm">
          {errors.email?.message}
        </p>
        <label>Phone Number*</label>
        <input type='number'  className='w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600' placeholder='Enter your phone number' {...register("phoneNumber")}/>
        <p className="text-red-500 text-sm">
          {errors.phoneNumber?.message}
        </p>
        <label>Subject</label>
        <input type='text'  className='w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600' placeholder='Enter Subject' {...register("subject")}/>
        <p className="text-red-500 text-sm">
          {errors.subject?.message}
        </p>

        <label>Message*</label>
        <textarea placeholder='Enter your Message'className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
        rows={5} {...register("message")} >


        </textarea>
        <p className="text-red-500 text-sm">
          {errors.message?.message}
        </p>

        <button
            type="submit"
            className=" cursor-pointer  w-full bg-sky-500 text-white py-2 rounded-md hover:bg-sky-600 transition"
          >
            Send Message
          </button>
        



      </form>



    </section>
    
    
   </div>
  )
}