import React, { useState } from 'react';
import { AlertCircle, Users, Phone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import axios from 'axios';

// =============================================================================
// Validation schema — unchanged from original
// =============================================================================

const requestSchema = yup.object({
  patientName: yup.string().required('Patient name is required'),
  bloodType: yup
    .string()
    .notOneOf([''], 'Please select a blood type')
    .required('Blood type is required'),
  units: yup
    .number()
    .typeError('Must be a number')
    .min(1, 'At least 1 unit required')
    .required('Units required is required'),
  reason: yup.string().required('Reason is required'),
});

// =============================================================================
// Priority badge colors
// =============================================================================

const priorityStyles = {
  HIGH:   'bg-red-100 text-red-600',
  MEDIUM: 'bg-orange-100 text-orange-600',
  LOW:    'bg-gray-100 text-gray-500',
};

// =============================================================================
// Main Component
// =============================================================================

export default function RequestBloodForm() {
  const [rankedDonors, setRankedDonors] = useState([]);
  const [submitted,    setSubmitted]    = useState(false);
  const [mlFallback,   setMlFallback]   = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(requestSchema) });

  // ── Submit handler ──────────────────────────────────────────────────────
  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        'http://localhost:8000/dashboard-hospital/emergency-request',
        data,
        { withCredentials: true }
      );

      // Store ranked donors from ML server response
      setRankedDonors(res.data.ranked_donors || []);
      setMlFallback(res.data.ml_fallback     || false);
      setSubmitted(true);

      toast.success('Emergency request submitted!');
      reset();

    } catch (err) {
      console.error(err);
      toast.error('Failed to submit request. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* ── Form Card ───────────────────────────────────────────────────── */}
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <AlertCircle className="text-red-600" />
          <h2 className="text-xl font-bold">Emergency Blood Request</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

          {/* Patient Name + Blood Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient Name
              </label>
              <input
                type="text"
                placeholder="Enter patient name"
                {...register('patientName')}
                className={`w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.patientName ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.patientName && (
                <p className="text-red-500 text-xs mt-1">{errors.patientName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blood Type Required
              </label>
              <select
                {...register('bloodType')}
                className={`w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.bloodType ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Select Type</option>
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              {errors.bloodType && (
                <p className="text-red-500 text-xs mt-1">{errors.bloodType.message}</p>
              )}
            </div>
          </div>

          {/* Units */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Units Required
            </label>
            <input
              type="number"
              min="1"
              placeholder="e.g. 2"
              {...register('units')}
              className={`w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-500 ${
                errors.units ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.units && (
              <p className="text-red-500 text-xs mt-1">{errors.units.message}</p>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Request
            </label>
            <textarea
              rows="3"
              placeholder="Briefly describe the reason..."
              {...register('reason')}
              className={`w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-500 resize-none ${
                errors.reason ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.reason && (
              <p className="text-red-500 text-xs mt-1">{errors.reason.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Urgent Request'}
          </button>

        </form>
      </div>

      {/* ── Ranked Donors Results Panel ─────────────────────────────────── */}
      {/* Only shown after a successful submission */}

      {submitted && rankedDonors.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

          {/* Header */}
          <div className="p-4 md:p-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-red-600" />
              <h3 className="font-bold text-gray-800">
                Eligible Donors in Your City
              </h3>
            </div>
            <span className="text-xs text-gray-400 font-medium">
              {rankedDonors.length} donor{rankedDonors.length !== 1 ? 's' : ''} found
            </span>
          </div>

          {/* ML fallback warning */}
          {mlFallback && (
            <div className="px-4 py-2 bg-orange-50 border-b border-orange-100">
              <p className="text-xs text-orange-600 font-medium">
                ⚠ ML server unavailable — donors shown unranked
              </p>
            </div>
          )}

          {/* Priority legend */}
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex gap-3">
            <span className="text-xs text-gray-500 font-medium">Priority:</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-semibold">HIGH</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 font-semibold">MEDIUM</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-semibold">LOW</span>
          </div>

          {/* Donor list */}
          <div className="divide-y divide-gray-100">
            {rankedDonors.map((donor) => (
              <div
                key={donor.rank}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition"
              >
                {/* Left — rank + name + email */}
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                    {donor.rank}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {donor.username}
                    </p>
                    <p className="text-xs text-gray-400">{donor.email}</p>
                  </div>
                </div>

                {/* Right — blood group + probability + priority */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-bold text-red-600">
                    {donor.blood_group}
                  </span>
                  <span className="text-xs text-gray-400">
                    {(donor.probability * 100).toFixed(0)}%
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    priorityStyles[donor.priority] || priorityStyles.LOW
                  }`}>
                    {donor.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="p-3 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">
              Donors are ranked by likelihood of responding based on donation history.
              HIGH priority donors are notified first.
            </p>
          </div>

        </div>
      )}

      {/* ── No donors found message ──────────────────────────────────────── */}
      {submitted && rankedDonors.length === 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 text-center">
          <AlertCircle className="mx-auto mb-2 text-orange-500" size={24} />
          <p className="text-orange-700 font-semibold text-sm">
            No eligible donors found in your city right now.
          </p>
          <p className="text-orange-500 text-xs mt-1">
            This may be because all nearby donors have donated recently
            or no donors with compatible blood groups are registered in your city.
          </p>
        </div>
      )}

    </div>
  );
}
