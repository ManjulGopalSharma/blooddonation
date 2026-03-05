import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';

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

export default function RequestBloodForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(requestSchema) });

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 800));
    console.log(data);
    toast.success('Emergency request submitted!');
    reset();
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <AlertCircle className="text-red-600" />
        <h2 className="text-xl font-bold">Emergency Blood Request</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

        {/* Patient Name & Blood Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type Required</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Units Required</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Request</label>
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Urgent Request'}
        </button>
      </form>
    </div>
  );
}