
import React, { useState } from 'react';
import { NavLink, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import {
  AlertCircle, Calendar, Droplets, LayoutDashboard,
  Menu, Users, X, Activity,
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';


import RequestBloodForm from './EmergencyRequestFrom';
import OrganizeCampForm from './BloodCampForm';
import DonorsListView   from './DonorsList';


const bloodStock = [
  { type: 'A+',  units: 12, status: 'Stable' },
  { type: 'B+',  units: 20, status: 'Stable' },
  { type: 'A-',  units: 2,  status: 'Low' },
  { type: 'B-',  units: 19, status: 'Stable' },
  { type: 'O+',  units: 3,  status: 'Low' },
  { type: 'O-',  units: 1,  status: 'Critical' },
  { type: 'AB+', units: 5,  status: 'Low' },
  { type: 'AB-', units: 8,  status: 'Stable' },
];

const emergencyRequests = [
  { id: '#PT-8821', bloodType: 'O-', urgency: 'Immediate', patient: 'Ramesh Kumar', units: 2 },
  { id: '#PT-8822', bloodType: 'A+', urgency: 'Urgent',    patient: 'Sita Devi',    units: 1 },
  { id: '#PT-8823', bloodType: 'B+', urgency: 'Normal',    patient: 'Arun Patel',   units: 3 },
];

// ── Nav items
const NAV_ITEMS = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard',         to: '/dashboard-hospital' },
  { icon: <AlertCircle size={20} />,     label: 'Emergency Request', to: '/dashboard-hospital/emergency-request' },
  { icon: <Calendar size={20} />,        label: 'Blood Camps',       to: '/dashboard-hospital/blood-camp' },
  { icon: <Users size={20} />,           label: 'Donors List',       to: '/dashboard-hospital/donor-list' },
];

const PAGE_TITLES = {
  '/dashboard-hospital':                   'Dashboard',
  '/dashboard-hospital/emergency-request': 'Emergency Request',
  '/dashboard-hospital/blood-camp':        'Blood Camps',
  '/dashboard-hospital/donor-list':        'Donors List',
};


export default function DashboardHospital() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  return (
    <div className="flex h-screen bg-gray-50  overflow-hidden">
      <Toaster position="top-right" />

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={toggleSidebar} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col
        transition-transform duration-300 transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        <div className="p-6 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Droplets className="text-red-600" size={28} />
            <span className="text-lg font-bold text-gray-800">Blood Care</span>
          </div>
          <button className="md:hidden" onClick={toggleSidebar}>
            <X size={22} className="text-gray-500" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {NAV_ITEMS.map(({ icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard-hospital'}  // prevents Dashboard staying active on sub-routes
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                  isActive
                    ? 'bg-red-50 text-red-600 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              {icon}
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <Activity size={16} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">City Hospital</p>
              <p className="text-xs text-gray-400">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-y-auto w-full">
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-4 md:px-8">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <button onClick={toggleSidebar} className="p-2 -ml-2 md:hidden">
                <Menu size={24} className="text-gray-600" />
              </button>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                {PAGE_TITLES[pathname] ?? 'Dashboard'}
              </h1>
            </div>
            <button className="bg-red-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition flex items-center gap-2">
              <AlertCircle size={16} />
              Emergency SOS
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Routes>
            {/* index → dashboard home */}
            <Route index element={<DashboardHome stock={bloodStock} requests={emergencyRequests} />} />

            {/* relative paths — no leading slash needed here */}
            <Route path="emergency-request" element={<RequestBloodForm />} />
            <Route path="blood-camp"        element={<OrganizeCampForm />} />
            <Route path="donor-list"        element={<DonorsListView />} />

            <Route path="*" element={<Navigate to="/dashboard-hospital" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}



function DashboardHome({ stock, requests }) {
  return (
    <div className="space-y-6">

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard label="Total Donors"     value="124"             color="blue"   icon={<Users size={20} />} />
        <SummaryCard label="Camps This Month" value="3"               color="green"  icon={<Calendar size={20} />} />
        <SummaryCard label="Pending Requests" value={requests.length} color="orange" icon={<AlertCircle size={20} />} />
        <SummaryCard
          label="Critical Stock"
          value={stock.filter(s => s.status === 'Critical').length}
          color="red"
          icon={<Droplets size={20} />}
        />
      </div>

      <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-base font-semibold mb-4 text-gray-800">Blood Stock Overview</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {stock.map((item) => (
            <div key={item.type} className={`p-3 rounded-lg border text-center ${
              item.status === 'Critical' ? 'border-red-200 bg-red-50' :
              item.status === 'Low'      ? 'border-orange-200 bg-orange-50' :
                                           'border-green-200 bg-green-50'
            }`}>
              <p className="text-lg font-bold text-gray-800">{item.type}</p>
              <p className="text-xl font-extrabold mt-1 text-gray-900">{item.units}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">units</p>
              <span className={`mt-1 inline-block px-1.5 py-0.5 rounded text-[9px] font-bold ${
                item.status === 'Critical' ? 'bg-red-100 text-red-600' :
                item.status === 'Low'      ? 'bg-orange-100 text-orange-600' :
                                             'bg-green-100 text-green-600'
              }`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-base font-semibold mb-4 text-gray-800">Pending Emergency Requests</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 border-b text-sm">
                <th className="pb-3 font-medium">Patient ID</th>
                <th className="pb-3 font-medium">Patient Name</th>
                <th className="pb-3 font-medium">Blood Type</th>
                <th className="pb-3 font-medium">Units</th>
                <th className="pb-3 font-medium">Urgency</th>
                <th className="pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50 transition text-sm">
                  <td className="py-3 text-gray-500">{req.id}</td>
                  <td className="py-3 font-medium text-gray-800">{req.patient}</td>
                  <td className="py-3 font-bold text-red-600">{req.bloodType}</td>
                  <td className="py-3 text-gray-700">{req.units}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      req.urgency === 'Immediate' ? 'bg-red-100 text-red-600' :
                      req.urgency === 'Urgent'    ? 'bg-orange-100 text-orange-600' :
                                                    'bg-blue-100 text-blue-600'
                    }`}>
                      {req.urgency}
                    </span>
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => toast.success(`Dispatched blood for ${req.patient}`)}
                      className="text-sm text-blue-600 font-semibold hover:underline"
                    >
                      Dispatch
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, color, icon }) {
  const colors = {
    blue:   'bg-blue-50 text-blue-600 border-blue-100',
    green:  'bg-green-50 text-green-600 border-green-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    red:    'bg-red-50 text-red-600 border-red-100',
  };
  return (
    <div className={`rounded-xl border p-4 flex items-center gap-3 ${colors[color]}`}>
      <div className="opacity-80">{icon}</div>
      <div>
        <p className="text-2xl font-extrabold leading-none">{value}</p>
        <p className="text-xs mt-1 opacity-70 font-medium">{label}</p>
      </div>
    </div>
  );
}