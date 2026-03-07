import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Clock,MapPin,Phone,Building ,X } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const config = {
    Upcoming: { bg: "bg-blue-50", color: "text-blue-600", dot: "bg-blue-400" },
    Ongoing:  { bg: "bg-green-50", color: "text-green-600", dot: "bg-green-400" },
    
  };
  const c = config[status] || config.Completed;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${c.bg} ${c.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  );
};



const CampCard = ({ camp }) => {
  const [expanded, setExpanded] = useState(false);
  const [attended, setAttended] =useState(false);
  const [checkedDonors, setCheckedDonors] = useState([]);
  const [donors, setDonors] = useState([]);
  const dateObj = new Date(camp.date);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString("default", { month: "short" }).toUpperCase();
  const year = dateObj.getFullYear();
  const pct = Math.min(100, Math.round((camp.registeredCount / camp.expectedDonors) * 100));
  const handleCheck = (id) => {
  if (checkedDonors.includes(id)) {
    setCheckedDonors(checkedDonors.filter((d) => d !== id));
  } else {
    setCheckedDonors([...checkedDonors, id]);
  }
};

const fetchDonors = async () => {
  try {
    const { data } = await axios.post(
      "http://localhost:8000/dashboard-hospital/blood-camp/camp-donors",
      { campId: camp._id },
      { withCredentials: true }
    );

    setDonors(data.donors || []);

  } catch (error) {
    console.log(error);
    toast.error("Failed to load donors");
  }
};

const markAttendance = async () => {

  try {

   const response= await axios.post(
      "http://localhost:8000/dashboard-hospital/blood-camp/mark-attendance",
      { registrationIds: checkedDonors },
      { withCredentials: true },
     
    );

  toast.success(response.data.message || "Attendance marked");

    setAttended(false);
    setCheckedDonors([]);

  } catch (error) {
    console.log(error);
        const msg = error.response?.data?.message || "Failed to mark attendance";
  
    toast.error(msg);
  }

};
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 ">

      {/* Top red bar */}
      <div className="h-1 bg-red-500 rounded-t-xl" />

      <div className="p-4">

        {/* Title row */}
        <div className="mb-1">
          <h2 className="text-xl font-bold text-gray-900 leading-snug capitalize">
            {camp.campTitle}
          </h2>
          <p className="text-md text-gray-400 mt-0.5">{camp.hospitalName}</p>
        </div>

       
        <div className="mb-3">
          <StatusBadge status={camp.status} />
        </div>

        <hr className="border-gray-100 mb-3" />

        
        <div className="flex items-start gap-3 mb-3">
          <div className="shrink-0 bg-red-50 border border-red-100 rounded-lg px-2.5 py-1.5 text-center w-12">
            <p className="text-base font-bold text-red-600 leading-none">{day}</p>
            <p className="text-xs text-red-400 font-medium">{month}</p>
            <p className="text-xs text-gray-400">{year}</p>
          </div>
          <div className="text-xs text-gray-500 space-y-1">
            <p className="flex flex-row items-center "> 
             <Clock  size={12}/>
              {camp.startTime} – {camp.endTime}</p>
            <p className="flex flex-row items-center ">
              <MapPin size={12}  />
               {camp.streetAddress}, {camp.city}</p>
            <p className="text-gray-400">{camp.district}, {camp.province}</p>
          </div>
        </div>

        {/* Description */}
        <p className="min-h-25 text-sm text-gray-500 italic bg-gray-50 rounded-lg px-3 py-2 mb-3  leading-relaxed">
          "{camp.campDescription}"
        </p>

        {/* Donor progress */}
        <div className="mb-3">
          <div className="flex justify-between text-md text-gray-500 mb-1">
            <span className="text-black">Donors Registered</span>
            <span className="font-semibold text-gray-700">{camp.registeredCount} / {camp.expectedDonors}</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-400 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{pct}% filled</p>
        </div>


        <button className="flex text-md font-medium text-white px-1 m-2 border border-red-900 rounded-xl bg-red-700 cursor-pointer hover:bg-red-500" onClick={() => {
  setAttended(true);
  fetchDonors();
}}>
          View Donor List & Mark Attendance
        </button>
        {attended && (
  <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
    <div className="bg-white w-full md:w-150 rounded border border-gray-500 p-4 ">
     <div className="flex flex-row w-full">
      <div>
        <h1 className="text-md font-bold">{camp.campTitle}</h1>
        <h2 className="text-sm text-gray-500">{day} {month} {year} : {camp.startTime} – {camp.endTime}</h2>
        </div>
        <button onClick={() => setAttended(!attended)} className="ml-auto cursor-pointer  hover:text-red-600 hover:font-extrabold  flex items-center justify-center">
          <X />
        </button>

      </div>


      <div className="w-full bg-gray-200 p-1 text-sm text-blue-600 py-3 flex flex-row items-center rounded-md mt-3">
        <h1>Mark donors who actually donated</h1>

        <h2 className="ml-auto font-bold">{checkedDonors.length}/{donors.length} marked</h2>


        </div>

        {donors.map((donor) => (

<div
key={donor._id}
className={`flex flex-row items-center gap-2 my-3 p-2 rounded-xl border cursor-pointer
${
checkedDonors.includes(donor._id)
? "bg-green-100 border-green-400"
: "bg-gray-100 border-gray-400"
}`}
>

<input
type="checkbox"
checked={checkedDonors.includes(donor._id)}
onChange={() => handleCheck(donor._id)}
className="w-4 h-4 accent-red-500 cursor-pointer shrink-0"
/>

<div className="flex flex-col">
<h1 className="text-md font-bold">{donor.name}</h1>

<div className="flex gap-3">
<p className="text-sm">{donor.phoneNumber}</p>
<p className="text-red-600 font-bold text-sm">{donor.bloodGroup}</p>
</div>

</div>

{checkedDonors.includes(donor._id) && (
<div className="ml-auto text-green-700 font-semibold">
✓ Donated
</div>
)}

</div>

))}







          <div className="flex flex-row items-center justify-end gap-5 m-5">
            <button className="rounded-xl bg-gray-600 hover:bg-gray-400 p-2 cursor-pointer text-white font-bold" onClick={() => setAttended(!attended)}>Cancel</button>


            <button className="rounded-xl bg-red-600 hover:bg-red-400 p-2 cursor-pointer text-white font-bold " onClick={markAttendance}
>Mark Attendance</button>


            </div>



      </div>


    </div>
        )}
    

        {/* Toggle button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-md text-red-500 hover:text-red-600 font-medium py-1.5 rounded-lg hover:bg-red-50 transition-colors border border-dashed border-red-200 cursor-pointer"
        >
          {expanded ? "▲ Less" : "▼ More Details"}
        </button>

        {/* Expanded section */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">

            {/* Coordinator */}
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
              <div className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold shrink-0">
                {camp.coordinatorName[0].toUpperCase()}
              </div>
              <div>
                <p className="text-xm text-black">Coordinator</p>
                <p className="text-xs font-semibold text-gray-700">{camp.coordinatorName}</p>
                <p className="text-xs text-gray-500 flex flex-row items-center"> 
                  <Phone size={12} />
                  
                  
                  {camp.coordinatorContact}</p>
              </div>
            </div>

            {/* Hospital */}
            <div className="bg-gray-50 rounded-lg px-3 py-2">
              <p className="text-xm text-black mb-0.5">Organizing Hospital</p>
              <p className="text-xs font-semibold text-gray-700 flex flex-row items-center">
                <Building size={12}  />
                 {camp.hospitalName}</p>
              <p className="text-xs text-gray-500">{camp.hospitalCity}, {camp.hospitalDistrict}, {camp.hospitalProvince}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function MyCamps() {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCamps = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8000/dashboard-hospital/blood-camp/my-camps",
          { withCredentials: true }
        );
        setCamps(data.camps || []);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to fetch camps");
      } finally {
        setLoading(false);
      }
    };
    fetchCamps();
  }, []);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-2">
        <div className="w-8 h-8 rounded-full border-4 border-red-200 border-t-red-500 animate-spin" />
        <p className="text-sm text-gray-400">Loading camps...</p>
      </div>
    );

  if (camps.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-2">
        <p className="text-4xl">🏕️</p>
        <p className="text-sm text-gray-500 font-medium">No camps found</p>
        <p className="text-xs text-gray-400">Your organized camps will appear here.</p>
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Toaster position="top-right" />

      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">My Blood Camps</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {camps.length} camp{camps.length !== 1 ? "s" : ""} organized
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {camps.map((camp) => (
          <CampCard key={camp._id} camp={camp} />
        ))}
      </div>
    </div>
  );
}