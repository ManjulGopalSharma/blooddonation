import React, { useState } from 'react';
import { 
  AlertCircle, Calendar, Droplets, LayoutDashboard, 
  PlusCircle, Settings, Users, Menu, X 
} from 'lucide-react';

export default function DashboardHospital() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const bloodStock = [
    { type: 'A+', units: 12, status: 'Stable' },
    { type: 'B+', units: 20, status: 'Stable' },
    { type: 'A-', units: 2, status: 'Low' },
    { type: 'B-', units: 19, status: 'Stable' },
    { type: 'O+', units: 3, status: 'Low' },
    { type: 'O-', units: 1, status: 'Critical' },
    { type: 'AB+', units: 5, status: 'Low' },
    { type: 'AB-', units: 8, status: 'Stable' },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets className="text-red-600" size={32} />
            <span className="text-xl font-bold text-gray-800">Blood Care</span>
          </div>
          <button className="md:hidden" onClick={toggleSidebar}>
            <X size={24} className="text-gray-500" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <NavItem 
            icon={<LayoutDashboard size={20}/>} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} 
          />
          <NavItem 
            icon={<AlertCircle size={20}/>} 
            label="Emergency Request" 
            active={activeTab === 'request'} 
            onClick={() => { setActiveTab('request'); setIsSidebarOpen(false); }} 
          />
          <NavItem 
            icon={<Calendar size={20}/>} 
            label="Blood Camps" 
            active={activeTab === 'camps'} 
            onClick={() => { setActiveTab('camps'); setIsSidebarOpen(false); }} 
          />
          <NavItem 
            icon={<Users size={20}/>} 
            label="Donors List" 
            active={activeTab === 'donors'} 
            onClick={() => { setActiveTab('donors'); setIsSidebarOpen(false); }} 
          />
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full">
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-4 md:px-8">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <button onClick={toggleSidebar} className="p-2 -ml-2 md:hidden">
                <Menu size={24} className="text-gray-600" />
              </button>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800 capitalize">
                {activeTab.replace('-', ' ')}
              </h1>
            </div>
            
            <button className="bg-red-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-sm md:text-base font-medium hover:bg-red-700 transition">
              Emergency SOS
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {activeTab === 'dashboard' && <DashboardView stock={bloodStock} />}
          {activeTab === 'request' && <RequestBloodForm />}
          {activeTab === 'camps' && <OrganizeCampForm />}
        </div>
      </main>
    </div>
  );
}

// --- Sub-Components (With Responsive Tweaks) ---

const NavItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      active ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

const DashboardView = ({ stock }) => (
  <div className="space-y-6">
    {/* Stats Cards: 1 col on mobile, 2 on tablet, 4 on desktop */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stock.map((item) => (
        <div key={item.type} className="bg-white p-5 md:p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-xl md:text-2xl font-bold">{item.type}</span>
            <span className={`px-2 py-1 rounded text-[10px] md:text-xs font-bold ${
              item.status === 'Critical' ? 'bg-red-100 text-red-600' : 
              item.status === 'Low' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
            }`}>
              {item.status}
            </span>
          </div>
          <p className="text-gray-500 mt-1 text-sm md:text-base">{item.units} Units available</p>
        </div>
      ))}
    </div>

    {/* Recent Activity: Table with horizontal scroll on mobile */}
    <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <h3 className="text-lg font-semibold mb-4">Pending Emergency Requests</h3>
      <div className="overflow-x-auto -mx-4 px-4">
        <table className="w-full text-left min-w-125">
          <thead>
            <tr className="text-gray-400 border-b">
              <th className="pb-3 text-sm font-medium">Patient ID</th>
              <th className="pb-3 text-sm font-medium">Blood Type</th>
              <th className="pb-3 text-sm font-medium">Urgency</th>
              <th className="pb-3 text-sm font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr className="hover:bg-gray-50 transition">
              <td className="py-4 text-sm">#PT-8821</td>
              <td className="py-4 font-bold text-red-600">O-</td>
              <td className="py-4 text-sm"><span className="text-red-500 font-semibold">Immediate</span></td>
              <td className="py-4 text-sm"><button className="text-blue-600 hover:underline">Dispatch</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const RequestBloodForm = () => (
  <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
    <h2 className="text-xl font-bold mb-6">Emergency Blood Request</h2>
    <form className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
          <input type="text" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type Required</label>
          <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none">
            <option>Select Type</option>
            <option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Request</label>
        <textarea className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" rows="3"></textarea>
      </div>
      <button className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition">
        Submit Urgent Request
      </button>
    </form>
  </div>
);

const OrganizeCampForm = () => (
  <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
    <div className="flex items-center gap-3 mb-6">
      <PlusCircle className="text-blue-600" />
      <h2 className="text-xl font-bold">Organize Donation Camp</h2>
    </div>
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Camp Title</label>
        <input type="text" placeholder="Enter title of camp" className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
        <input type="text" placeholder="Enter location of camp" className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1"> Date</label>
          <input type="date" className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expected Donors</label>
          <input type="number" placeholder="50" className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
        Schedule Camp
      </button>
    </form>
  </div>
);