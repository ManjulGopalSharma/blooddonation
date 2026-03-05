import React, { useState } from 'react';
import { Phone, CheckCircle, XCircle, Search } from 'lucide-react';

const donorsList = [
  { id: 'D-001', name: 'Aarav Sharma',  bloodType: 'A+',  contact: '9876543210', lastDonated: '2024-11-10', status: 'Eligible' },
  { id: 'D-002', name: 'Priya Mehta',   bloodType: 'B+',  contact: '9812345678', lastDonated: '2025-01-05', status: 'Eligible' },
  { id: 'D-003', name: 'Rahul Verma',   bloodType: 'O-',  contact: '9898989898', lastDonated: '2025-02-20', status: 'Not Eligible' },
  { id: 'D-004', name: 'Sneha Patil',   bloodType: 'AB+', contact: '9765432109', lastDonated: '2024-10-15', status: 'Eligible' },
  { id: 'D-005', name: 'Karan Singh',   bloodType: 'O+',  contact: '9654321098', lastDonated: '2025-01-28', status: 'Not Eligible' },
  { id: 'D-006', name: 'Meera Joshi',   bloodType: 'A-',  contact: '9543210987', lastDonated: '2024-09-12', status: 'Eligible' },
  { id: 'D-007', name: 'Vikram Nair',   bloodType: 'B-',  contact: '9432109876', lastDonated: '2024-12-01', status: 'Eligible' },
  { id: 'D-008', name: 'Anjali Gupta',  bloodType: 'AB-', contact: '9321098765', lastDonated: '2025-02-14', status: 'Not Eligible' },
];

export default function DonorsListView() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = donorsList.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.bloodType.toLowerCase().includes(search.toLowerCase()) ||
      d.id.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || d.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-4">

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, ID or blood type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-400 text-sm"
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Eligible', 'Not Eligible'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition border ${
                filter === f
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-gray-500 text-sm">
                <th className="px-4 py-3 font-medium">Donor ID</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Blood Type</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Last Donated</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400 text-sm">
                    No donors found.
                  </td>
                </tr>
              ) : (
                filtered.map((donor) => (
                  <tr key={donor.id} className="hover:bg-gray-50 transition text-sm">
                    <td className="px-4 py-3 text-gray-500 font-mono">{donor.id}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">{donor.name}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded text-xs">
                        {donor.bloodType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <span className="flex items-center gap-1">
                        <Phone size={12} className="text-gray-400" />
                        {donor.contact}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{donor.lastDonated}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                        donor.status === 'Eligible'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-500'
                      }`}>
                        {donor.status === 'Eligible' ? <CheckCircle size={11} /> : <XCircle size={11} />}
                        {donor.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
          Showing {filtered.length} of {donorsList.length} donors
        </div>
      </div>
    </div>
  );
}