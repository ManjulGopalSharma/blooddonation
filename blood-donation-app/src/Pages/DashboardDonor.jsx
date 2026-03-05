import Logo from "../assets/bloodDrop.png";
import { User, Bell,Droplets, CircleUserRound, Menu, Calendar, MapPin, ChevronRight, Clock } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import MapComponent from "../Components/MapComponent";
import GetLocation from'../Pages/GetLocation';
import axios from 'axios';


export default function DashboardDonor() {
  GetLocation();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const navigate = useNavigate();
useEffect(() => {
  const getCamps = async () => {
    try {
      const res = await axios.get('http://localhost:8000/dashboard-hospital/blood-camp');
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  getCamps();
}, []);

  const notificationClicked = () => setNotificationOpen(prev => !prev);
  const navigateProfile = () => navigate('/profile');

  return (
    <div className="min-h-screen bg-gray-50 ubuntu-regular relative">
      
      
      <nav className="z-50 w-full bg-red-100 p-3 sticky top-0 flex items-center shadow-sm border-b border-red-200">
        <div className="flex items-center gap-2 w-1/2">
        <Droplets size={30} className="text-red-700"/>
          <span className="font-bold text-black ubuntu-regular  text-xl  hidden md:inline ">Blood Care</span>
        </div>

        <div className='ml-auto flex items-center gap-2 md:gap-4'>
          <div className="cursor-pointer relative hover:bg-red-200 p-2 rounded-full transition" onClick={notificationClicked}>
            <Bell size={24} className="text-red-800" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-red-100"></span>
          </div>

          <div className="cursor-pointer hover:bg-red-200 p-2 rounded-full transition" onClick={navigateProfile}>
            <CircleUserRound size={24} className="text-red-800" />
          </div>

          
        </div>
      </nav>

     
      <main>
       
        <div className="w-full  border-b relative">
          <MapComponent />
          <div className="absolute bottom-4 left-4 md:left-100 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg border border-red-200 shadow-sm">
            <p className="text-xs font-bold text-red-600">LIVE: 12 Hospitals looking for donors nearby</p>
          </div>
        </div> 

        {/*Blood Donation Camps Section */}
        <section className="max-w-6xl mx-auto p-5 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                <Calendar className="text-red-600" /> Upcoming Donation Camps
              </h2>
              <p className="text-gray-500 mt-1">Register for a camp near you and save lives.</p>
            </div>
            <button className="text-red-600 font-bold hover:underline flex items-center gap-1">
              View All Camps <ChevronRight size={18}/>
            </button>
          </div>

          {/* Camps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {camps.map(camp => (
              <div key={camp.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="bg-red-600 p-4 text-white">
                  <h3 className="font-bold text-lg truncate">{camp.name}</h3>
                  <p className="text-xs opacity-90 uppercase tracking-wider">{camp.hospital}</p>
                </div>
                
                <div className="p-5 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Calendar size={16} className="text-red-500" />
                      <span className="text-sm font-medium">{camp.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Clock size={16} className="text-red-500" />
                      <span className="text-sm">{camp.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <MapPin size={16} className="text-red-500" />
                      <span className="text-sm truncate">{camp.location}</span>
                    </div>
                  </div>

                  <button className="w-full bg-red-50 text-red-600 py-2.5 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-colors">
                    Register Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Notification Dropdown (Positioned Fixed/Absolute) */}
      {notificationOpen && (
        <div className="fixed md:absolute right-4 top-16 z-100 w-[320px] bg-white border border-gray-200 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="p-4 bg-red-50 border-b border-red-100 flex justify-between items-center">
            <h3 className="font-medium text-red-800  text-xl ubuntu-regular">Notifications</h3>
            <button onClick={() => setNotificationOpen(false)} className="text-red-400 hover:text-red-800 cursor-pointer">✕</button>
          </div>
          <div className="max-h-100 overflow-y-auto">
            {/* Notification Item */}
            <div className="p-4 flex gap-3 hover:bg-gray-50 border-b cursor-pointer transition">
              <div className="bg-red-100 p-2 rounded-full h-fit">
                <User size={18} className="text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-800 ubuntu-regular">
                  <span className="font-bold">Teaching Hospital</span> requested an emergency blood supply.
                </p>
                <p className="text-xs text-gray-400 mt-1 ">2 min ago</p>
              </div>
            </div>
            {/* Repeat items as needed */}
          </div>
          <div className="p-3 bg-gray-50 text-center">
            <button className="text-xs font-bold text-gray-500 hover:text-red-600 cursor-pointer">Mark all as read</button>
          </div>
        </div>
      )}
    </div>
  );
}