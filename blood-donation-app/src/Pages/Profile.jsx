import { User, Pen, Dot,CircleCheckBig,ShieldCheck,Droplets,Calendar,Mail,MapPin,Phone,Activity,History,ScanHeart,BookText,LogOut} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react"


export default function Profile() {
  const navigate=useNavigate();
  const[user,setUser]=useState(null);

 
  const logOut = async () => {
  await axios.post(
    "http://localhost:8000/logout",
    {},
    { withCredentials: true }
  );

  // Clear client state
  localStorage.clear();
  sessionStorage.clear();

  navigate("/", { replace: true });

};
useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:8000/profile", {
          withCredentials: true, // sends JWT cookie automatically
        });
        setUser(res.data); // user object from DB
        console.log("Logged-in user:", res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
     fetchUser();
  }, []);
  
if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-700 text-lg">Loading profile...</p>
      </div>
    );
  }


  const HistoryRow = ({ date, loc, type }) => (
  <tr className="hover:bg-gray-50">
    <td className="px-6 py-4 text-gray-900 font-medium">{date}</td>
    <td className="px-6 py-4 text-gray-600">{loc}</td>
    <td className="px-6 py-4">
      <span className={`px-2 py-1 rounded text-xs font-bold ${type === 'Emergency' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
        {type}
      </span>
    </td>
  </tr>
);
  return (
    <div className="min-h-screen bg-gray-50  ubuntu-regular gap-5  flex flex-col justify-start items-center  md:justify-start ">
      <div className="min-h-screen bg-gray-50 pb-12 ubuntu-regular gap-5  flex flex-col justify-start items-center  md:justify-start ">

      
      {/* 1. Profile Header */}
      <div className="flex justify-center items-center py-5 flex-col  border-b-2 border-b-gray-400 w-full">
        
        <div className="flex flex-col items-center  justify-center h-24 w-24 bg-red-200 rounded-full border-5 border-green-400 cursor-pointer ">
          <User size={50} className="text-red-600" />
        </div>
        <div>
          <h1 className="font-extrabold text-xl">Welcome, {user.userName||'......'}</h1>
        </div>
        <div className="flex flex-col justify-center">
          <button className="bg-red-500 text-white rounded-xl w-85 cursor-pointer hover:bg-red-700">
            {user.bloodGroup||'......'} ve
          </button>
          <h1> Last Donated Date :{user.lastDonatedDate||'.............'}</h1>
          <div className="flex flex-row gap-3 ">
            <div className="flex flex-row justify-center items-center cursor-pointer bg-green-200  hover:bg-green-300 gap-0  rounded-xl">
              <Dot size={50} className="text-green-600 " />
              <div className=" text-green-900  w-40 font-bold">
                Available to Donate
              </div>
            </div>
            <div className="border border-gray-400 rounded-xl  hover:bg-gray-200 flex flex-row items-center justify-center p-2">
              <Pen size={20} />
              <button className="pl-1 cursor-pointer ">Edit Profile</button>
            </div>
          </div>
        </div>
      </div>
      {/* 2.Eligiblity */}
        <div className="bg-green-200 rounded-xl p-4 w-80 border border-green-500">
          <div className="flex flex-row gap-1">
            <CircleCheckBig/>
            <h1>Eligible to Donate</h1>
          </div>
          
          <p >You are healthy and within the time window to save a life today!</p>
        </div>
        {/* 3. Trust */}
        <div className="flex flex-col gap-2 rounded-xl border border-gray-400 w-90 p-3">
          <h1 className="font-bold ">Trust Indicators</h1>
          <div className="flex flex-row gap-1">
            <ShieldCheck className="text-blue-400"/>
            <p className="text-blue-400 font-bold">Phone  Verified</p>
          </div>
         <div className="flex flex-row gap-1" >
            <ShieldCheck className="text-blue-400"/>

          <p className="text-blue-400 font-bold">Email Verified</p>

         </div>
          
          <div className="flex flex-row gap-1">
            <Droplets className="text-red-400" />

            <p className="text-red-400 font-bold">Active Donor(Gold)</p>
          </div>
        </div>

      {/* 4. Personal information */}
      <div className="flex flex-col gap-2 rounded-xl border border-gray-400 w-90 ">
        <div className="font-bold border-b border-gray-400 w-full p-3 flex flex-row gap-1">
          <BookText/>
          <h1>Personal Information</h1>

        </div>
        <div className="p-3">
          <div className="flex flex-row gap-1">
            <Calendar className="text-black"/>
            <h1 className="font-bold text-black">AGE/DOB</h1>
          </div>
          <div>
          <p className="px-7 text-gray-500 font-medium">{user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '................'}</p>
          </div>

          <div className="flex flex-row gap-1">
            <Phone className="text-black"/>
            <h1 className="font-bold text-black">PHONE</h1>
          </div>
          <div>
          <p className="px-7 text-gray-500 font-medium">{user.phoneNumber||'Loading...'}</p>
          </div>

          <div className="flex flex-row gap-1">
            <MapPin className="text-black"/>
            <h1 className="font-bold text-black">ADDRESS</h1>
          </div>
          <div>
          <p className="px-7 text-gray-500 font-medium">{user.address||'...............'}</p>
          </div>
          <div className="flex flex-row gap-1">
            <Activity className="text-black"/>
            <h1 className="font-bold text-black">GENDER</h1>
          </div>
          <div>
          <p className="px-7 text-gray-500 font-medium">{user.gender||'.............'}</p>
          </div>
          <div className="flex flex-row gap-1">
            <Mail className="text-black"/>
            <h1 className="font-bold text-black">EMAIL</h1>
          </div>
          <div>
          <p className="px-7 text-gray-500 font-medium">{user.email||'................'}</p>
          </div>
          

        </div>

      </div>

      {/* 4. Personal information */}
      <div className="flex flex-col gap-2 rounded-xl border border-gray-400 w-90 ">
        <div className="font-bold border-b border-gray-400 w-full p-3 flex flex-row gap-1">
          <ScanHeart/>
          <h1>Health and Medical Info</h1>

        </div>
        <div className="">

       
        <div className="px-3">
          <h1 className="px-3 font-bold text-black">WEIGHT</h1>
          <p className="px-3 text-gray-500 font-medium">{user.weight||'..................'}</p>

        </div>
        <div className="px-3 flex flex-col">
          <h1 className="px-3 font-bold text-black">SMOKE/ALCOHOL</h1>
          <p className="px-3 text-gray-500 font-medium">{user.smokeAlcohol||'...................'}</p>

        </div>
        <div className="px-3">
          <h1 className="px-3 font-bold text-black">ON MEDICATION</h1>
          <p className="px-3 text-gray-500 font-medium">{user.onMedication||'...................'}</p>

        </div>
        <div className="px-3">
          <h1 className="px-3 font-bold text-black">RECENT ILLNESS</h1>
          <p className="px-3 text-gray-500 font-medium">{user.recentIllness||'...................'}</p>

        </div>
         </div>
        
      </div>

       {/* 4. Personal information */}
      <div className="flex flex-col gap-2 rounded-xl border border-gray-400 w-90 ">
        <div className="font-bold border-b border-gray-400 w-full p-3 flex flex-row gap-1">

          <History/>
          <h1>Donation History</h1>
          </div> 
          <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Date</th>
                    <th className="px-6 py-3 font-semibold">Location</th>
                    <th className="px-6 py-3 font-semibold">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <HistoryRow date="2024-08-12" loc="Teaching Hospital" type="Emergency" />
                  <HistoryRow date="2024-03-01" loc="Red Cross Camp" type="Camp" />
                </tbody>
              </table>


          </div>






          </div>

          <div className=" border bg-gray-200 border-gray-400 rounded-xl  hover:bg-gray-400 flex flex-row items-center justify-center px-4 py-2 m-5 cursor-pointer font-bold">
            <LogOut/>
            <button  onClick={logOut}className="cursor-pointer">Logout</button>
          </div>


        


    </div>
  );

}
