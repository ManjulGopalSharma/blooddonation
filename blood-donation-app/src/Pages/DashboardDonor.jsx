import Logo from "../assets/bloodDrop.png";
import { User, Bell, Droplets, CircleUserRound, X, Users, Calendar, Heart, MapPin, ChevronRight, Dot, Clock, Building, Phone, AlertCircle } from 'lucide-react';

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import MapComponent from "../Components/MapComponent";
import GetLocation from '../Pages/GetLocation';
import axios from 'axios';
import RegisterCamp from "./RegisterCamp";

export default function DashboardDonor() {

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [camps,            setCamps]            = useState([]);
  const [location,         setLocation]         = useState(null);
  const [selectedCamp,     setSelectedCamp]     = useState(null);
  const [donorProfile,     setDonorProfile]     = useState(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  // NEW — real notifications from backend
  const [notifications,    setNotifications]    = useState([]);
  const [notifLoading,     setNotifLoading]     = useState(false);

  const navigate = useNavigate();

  // ── Fetch camps + donor profile ───────────────────────────────────────────
  useEffect(() => {
    const getCamps = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/dashboard-donor",
          { withCredentials: true }
        );
        setCamps(res.data.data || []);
        if (res.data.donorProfile) {
          setDonorProfile(res.data.donorProfile);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load camps");
      }
    };
    getCamps();
  }, []);

  // ── Fetch notifications once donor profile (and city) is loaded ──────────
  useEffect(() => {
    if (!donorProfile?.city) return;

    const getNotifications = async () => {
      setNotifLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:8000/donor/emergency-notifications?city=${donorProfile.city}`,
          { withCredentials: true }
        );
        setNotifications(res.data.data || []);
      } catch (err) {
        console.error('Failed to load notifications', err);
      } finally {
        setNotifLoading(false);
      }
    };

    getNotifications();
  }, [donorProfile?.city]);

  // ── Get location ──────────────────────────────────────────────────────────
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  }, []);

  const notificationClicked = () => setNotificationOpen(prev => !prev);
  const navigateProfile = () => navigate('/profile');

  const statusConfig = {
    Upcoming:  { dotClass: "bg-yellow-400", label: "Upcoming"  },
    Ongoing:   { dotClass: "bg-green-400",  label: "Ongoing"   },
    Completed: { dotClass: "bg-gray-400",   label: "Completed" },
  };

  function getCampStatus(camp) {
    const now = new Date();
    const campDate = new Date(camp.date);
    const [startHours, startMinutes] = camp.startTime.split(":").map(Number);
    const [endHours,   endMinutes]   = camp.endTime.split(":").map(Number);

    const startTime = new Date(campDate);
    startTime.setHours(startHours, startMinutes, 0, 0);

    const endTime = new Date(campDate);
    endTime.setHours(endHours, endMinutes, 0, 0);

    if (now < startTime)                    return "Upcoming";
    if (now >= startTime && now <= endTime) return "Ongoing";
    return "Completed";
  }

  // ── Format time ago ───────────────────────────────────────────────────────
  function timeAgo(dateString) {
    const now  = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60)                return `${diff}s ago`;
    if (diff < 3600)              return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400)             return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  return (
    <div className="min-h-screen bg-gray-50 ubuntu-regular relative">
      <Toaster />

      {/* ── Navbar ────────────────────────────────────────────────────────── */}
      <nav className="z-50 w-full bg-red-100 p-3 sticky top-0 flex items-center shadow-sm border-b border-red-200">
        <div className="flex items-center gap-2 w-1/2">
          <Droplets size={30} className="text-red-700" />
          <span className="font-bold text-black ubuntu-regular text-xl hidden md:inline">Blood Care</span>
        </div>

        <div className="ml-auto flex items-center gap-2 md:gap-4">

          {/* Notification Bell */}
          <div
            className="cursor-pointer relative hover:bg-red-200 p-2 rounded-full transition"
            onClick={notificationClicked}
          >
            <Bell size={24} className="text-red-800" />
            {/* Red dot — only show if there are notifications */}
            {notifications.length > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-red-100" />
            )}
          </div>

          <div
            className="cursor-pointer hover:bg-red-200 p-2 rounded-full transition"
            onClick={navigateProfile}
          >
            <CircleUserRound size={24} className="text-red-800" />
          </div>

        </div>
      </nav>

      {/* ── Map ───────────────────────────────────────────────────────────── */}
      <main>
        <div className="w-full border-b relative">
          <MapComponent />
          <div className="absolute bottom-4 left-4 md:left-100 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg border border-red-200 shadow-sm">
            <p className="text-xs font-bold text-red-600">
              LIVE: {notifications.length} Hospital{notifications.length !== 1 ? 's' : ''} looking for donors nearby
            </p>
          </div>
        </div>

        {/* ── Blood Donation Camps Section ─────────────────────────────── */}
        <section className="max-w-6xl mx-auto p-5 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                <Calendar className="text-red-600" /> Upcoming Donation Camps
              </h2>
              <p className="text-gray-500 mt-1">Register for a camp near you and save lives.</p>
            </div>
          </div>

          {/* Camps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {camps.map(camp => (
              <div key={camp._id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="bg-red-600 p-4 text-white">
                  <h3 className="font-bold text-xl truncate">{camp.campTitle}</h3>
                  <h3 className="text-md text-white/80 truncate">Organized by: {camp.hospitalName}</h3>
                  <p className="text-xs opacity-90 uppercase tracking-wider">{camp.hospital}</p>
                </div>

                <div className="p-5 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Calendar size={16} className="text-red-500" />
                      <span className="text-sm font-medium">{camp.date.split("T")[0]}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Clock size={16} className="text-red-500" />
                      <span className="text-sm">{camp.startTime} to {camp.endTime}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <MapPin size={16} className="text-red-500" />
                      <span className="text-sm truncate">{camp.streetAddress}, {camp.city} ({camp.district})</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-5 items-center justify-center">
                    <button
                      className="w-fit px-5 bg-red-50 text-red-600 py-2.5 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                      onClick={() => setSelectedCamp(camp)}
                    >
                      Details
                    </button>
                    <button
                      className="w-fit px-5 bg-red-50 text-red-600 py-2.5 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                      onClick={() => { setSelectedCamp(camp); setShowRegisterForm(true); }}
                    >
                      Register Now
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Camp Detail Sidebar */}
            {selectedCamp && (
              <>
                <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setSelectedCamp(null)} />
                <div className="fixed right-0 top-0 h-full w-1/2 max-w-150 bg-white shadow-lg z-50 overflow-y-auto">
                  <div className="bg-red-500 p-6 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Dot size={24} className={statusConfig[getCampStatus(selectedCamp)].dotClass} />
                        <h1 className="text-white font-bold text-xl">
                          {statusConfig[getCampStatus(selectedCamp)].label}
                        </h1>
                      </div>
                      <button
                        onClick={() => setSelectedCamp(null)}
                        className="px-3 py-1 bg-red-700 text-white rounded hover:bg-red-800"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <Droplets size={28} className="text-white" />
                      <h2 className="text-white font-bold text-2xl">{selectedCamp.campTitle}</h2>
                    </div>
                    <p className="text-white/80 text-sm">{selectedCamp.campDescription}</p>
                  </div>

                  <div className="p-5 bg-red-100 space-y-4">
                    <div className="border border-red-300 bg-red-50 rounded-xl p-3">
                      <div className="flex items-center gap-2">
                        <Users size={18} className="text-red-600" />
                        <h3 className="font-bold text-red-600">Donor Registration</h3>
                      </div>
                      <p className="text-sm font-medium mt-1">
                        Total Seats: {selectedCamp.expectedDonors} | Registered: {selectedCamp.registeredCount} | Available: {selectedCamp.expectedDonors - selectedCamp.registeredCount}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-bold text-lg">CAMP DETAILS</h3>
                      <div className="flex flex-row gap-2 items-start border border-red-300 bg-red-50 rounded-xl p-3">
                        <Calendar className="text-red-600" />
                        <div><h1 className="font-bold text-md">DATE</h1><p>{selectedCamp.date.split("T")[0]}</p></div>
                      </div>
                      <div className="flex flex-row gap-2 items-start border border-red-300 bg-red-50 rounded-xl p-3">
                        <Clock className="text-red-600" />
                        <div><h1 className="font-bold text-md">TIME</h1><p>{selectedCamp.startTime}-{selectedCamp.endTime}</p></div>
                      </div>
                      <div className="flex flex-row gap-2 items-start border border-red-300 bg-red-50 rounded-xl p-3">
                        <MapPin className="text-red-600" />
                        <div>
                          <h1 className="font-bold text-md">LOCATION</h1>
                          <p>{selectedCamp.streetAddress}-{selectedCamp.city}</p>
                          <p>{selectedCamp.district} District</p>
                        </div>
                      </div>
                      <div className="flex flex-row gap-2 items-start border border-red-300 bg-red-50 rounded-xl p-3">
                        <User className="text-red-600" />
                        <div>
                          <h1 className="font-bold text-md">COORDINATOR</h1>
                          <p>{selectedCamp.coordinatorName}</p>
                          <div className="flex flex-row items-center">
                            <Phone size={16} />
                            <p>{selectedCamp.coordinatorContact}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h1 className="font-extrabold">ASSOCIATED HOSPITAL</h1>
                      <div className="flex flex-row gap-2 items-start border border-blue-300 bg-blue-50 rounded-xl p-3">
                        <Building className="text-red-600" />
                        <div>
                          <h1 className="font-bold text-md">HOSPITAL</h1>
                          <p>{selectedCamp.hospitalName}</p>
                          <p>{selectedCamp.hospitalCity}, {selectedCamp.hospitalDistrict}</p>
                        </div>
                      </div>
                    </div>

                    <button
                      className="w-full py-3 mt-4 bg-red-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-red-700 transition"
                      onClick={() => { setShowRegisterForm(true); setSelectedCamp(null); }}
                    >
                      <Heart size={18} /> Register for this Camp <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      {/* ── Register Camp Modal ───────────────────────────────────────────── */}
      {showRegisterForm && donorProfile && selectedCamp && (
        <RegisterCamp
          campId={selectedCamp._id}
          donorProfile={donorProfile}
          onClose={() => setShowRegisterForm(false)}
        />
      )}

      {/* ── Notification Dropdown ─────────────────────────────────────────── */}
      {notificationOpen && (
        <div className="fixed md:absolute right-4 top-16 z-100 w-[320px] bg-white border border-gray-200 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

          {/* Header */}
          <div className="p-4 bg-red-50 border-b border-red-100 flex justify-between items-center">
            <h3 className="font-medium text-red-800 text-xl ubuntu-regular">Notifications</h3>
            <button
              onClick={() => setNotificationOpen(false)}
              className="text-red-400 hover:text-red-800 cursor-pointer"
            >✕</button>
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto">

            {/* Loading state */}
            {notifLoading && (
              <div className="p-4 text-center text-gray-400 text-sm">
                Loading...
              </div>
            )}

            {/* Empty state */}
            {!notifLoading && notifications.length === 0 && (
              <div className="p-6 text-center">
                <Bell size={24} className="mx-auto text-gray-300 mb-2" />
                <p className="text-gray-400 text-sm">No emergency requests in your city</p>
              </div>
            )}

            {/* Real notifications from backend */}
            {!notifLoading && notifications.map((notif) => (
              <div
                key={notif._id}
                className="p-4 flex gap-3 hover:bg-gray-50 border-b cursor-pointer transition"
              >
                <div className="bg-red-100 p-2 rounded-full h-fit shrink-0">
                  <AlertCircle size={18} className="text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-800 ubuntu-regular">
                    <span className="font-bold">{notif.hospitalName}</span> needs{' '}
                    <span className="font-bold text-red-600">{notif.bloodType}</span> blood urgently.
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Patient: {notif.patientName} · {notif.units} unit{notif.units !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{timeAgo(notif.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Showing emergency requests in {donorProfile?.city || 'your city'}
            </p>
          </div>

        </div>
      )}

    </div>
  );
}
