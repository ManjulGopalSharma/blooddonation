import React from 'react';
import { PlusCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import axios from 'axios';

const campSchema = yup.object({
  campTitle: yup.string().required('Camp title is required'),
  campDescription: yup.string().required('Description is required'),
  province: yup.string().required('Province is required'),
  district: yup.string().required('District is required'),
  city: yup.string().required('City is required'),
  streetAddress: yup.string().required('Street address is required'),
  date: yup.string().required('Date is required'),
  startTime: yup.string().required('Start time is required'),
  endTime: yup.string().required('End time is required'),
  expectedDonors: yup
    .number()
    .typeError('Must be a number')
    .min(1, 'At least 1 donor required')
    .required('Expected donors is required'),
  coordinatorName: yup.string().required('Coordinator name is required'),
  coordinatorContact: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Enter a valid 10-digit contact number')
    .required('Coordinator contact is required'),
});

const nepalData = {
  'Koshi Province': {
    Taplejung: ['Taplejung', 'Phungling', 'Sidingba'],
    Sankhuwasabha: ['Chainpur', 'Khandbari', 'Madi'],
    Solukhumbu: ['Salleri', 'Phaplu', 'Namche'],
    Okhaldhunga: ['Okhaldhunga', 'Siddhicharan'],
    Khotang: ['Diktel', 'Halesi', 'Khotehang'],
    Bhojpur: ['Bhojpur', 'Shadananda'],
    Dhankuta: ['Dhankuta', 'Pakhribas'],
    Terhathum: ['Myanglung', 'Laligurans'],
    Ilam: ['Ilam', 'Mai', 'Suryodaya'],
    Jhapa: ['Birtamod', 'Bhadrapur', 'Mechinagar', 'Damak', 'Kankai'],
    Morang: ['Biratnagar', 'Sundar Haraicha', 'Urlabari', 'Pathari'],
    Sunsari: ['Dharan', 'Itahari', 'Inaruwa', 'Duhabi'],
  },
  'Madhesh Province': {
    Saptari: ['Rajbiraj', 'Kanchanrup', 'Shambhunath'],
    Siraha: ['Lahan', 'Siraha', 'Golbazar'],
    Dhanusha: ['Janakpur', 'Dhalkebar', 'Mithila'],
    Mahottari: ['Jaleshwar', 'Bardibas', 'Gaur'],
    Sarlahi: ['Malangwa', 'Haripur', 'Ishworpur'],
    Rautahat: ['Gaur', 'Chandrapur', 'Brindaban'],
    Bara: ['Kalaiya', 'Simraungadh', 'Nijgadh'],
    Parsa: ['Birgunj', 'Pokhariya', 'Bahudarmai'],
  },
  'Bagmati Province': {
    Kathmandu: ['Kathmandu', 'Kirtipur', 'Kageshwori', 'Tokha', 'Budhanilkantha'],
    Lalitpur: ['Lalitpur', 'Godawari', 'Mahalaxmi', 'Konjyosom'],
    Bhaktapur: ['Bhaktapur', 'Changunarayan', 'Madhyapur Thimi', 'Suryabinayak'],
    Kavrepalanchok: ['Dhulikhel', 'Banepa', 'Panauti', 'Namobuddha'],
    Sindhupalchok: ['Chautara', 'Bahrabise', 'Melamchi'],
    Dolakha: ['Charikot', 'Jiri', 'Bigu'],
    Ramechhap: ['Manthali', 'Ramechhap', 'Umakunda'],
    Sindhuli: ['Sindhuli', 'Kamalamai', 'Dudhauli'],
    Makwanpur: ['Hetauda', 'Thaha', 'Raksirang'],
    Rasuwa: ['Rasuwa', 'Kalika', 'Gosaikunda'],
    Nuwakot: ['Bidur', 'Belkotgadhi', 'Suryagadhi'],
    Dhading: ['Nilkantha', 'Dhading', 'Jwalamukhi'],
    Chitwan: ['Bharatpur', 'Ratnanagar', 'Madi', 'Rapti'],
  },
  'Gandaki Province': {
    Kaski: ['Pokhara', 'Annapurna', 'Machhapuchchhre', 'Rupa'],
    Tanahun: ['Damauli', 'Bhanu', 'Shuklagandaki'],
    Syangja: ['Syangja', 'Galyang', 'Waling'],
    Lamjung: ['Besishahar', 'Sundarbazar', 'Rainas'],
    Gorkha: ['Gorkha', 'Palungtar', 'Barpak Sulikot'],
    Manang: ['Chame', 'Narphu', 'Narpabhumisame'],
    Mustang: ['Jomsom', 'Lomanthang', 'Thasang'],
    Myagdi: ['Baglung', 'Beni', 'Mangala'],
    Baglung: ['Baglung', 'Dhorpatan', 'Jaimini'],
    Parbat: ['Kushma', 'Phalewas', 'Modi'],
    Nawalpur: ['Kawasoti', 'Bulingtar', 'Madhyabindu'],
  },
  'Lumbini Province': {
    Rupandehi: ['Butwal', 'Siddharthanagar', 'Tilottama', 'Sainamaina'],
    Kapilvastu: ['Kapilvastu', 'Banganga', 'Buddhabhumi'],
    Arghakhanchi: ['Sandhikharka', 'Shitganga', 'Bhumikasthan'],
    Gulmi: ['Tamghas', 'Musikot', 'Resunga'],
    Palpa: ['Tansen', 'Rampur', 'Rambha'],
    'Nawalparasi West': ['Sunwal', 'Palhinandan', 'Pratappur'],
    Dang: ['Tulsipur', 'Ghorahi', 'Lamahi'],
    Banke: ['Nepalgunj', 'Narainapur', 'Rapti Sonari'],
    Bardiya: ['Gulariya', 'Thakurbaba', 'Rajapur'],
    Pyuthan: ['Pyuthan', 'Sworgadwary', 'Mallarani'],
    Rolpa: ['Rolpa', 'Runtigadhi', 'Lungri'],
  },
  'Karnali Province': {
    Surkhet: ['Birendranagar', 'Bheriganga', 'Lekbesi'],
    Dailekh: ['Narayan', 'Dullu', 'Chamunda Bindrasaini'],
    Jajarkot: ['Bheri', 'Chhedagad', 'Barekot'],
    Dolpa: ['Thulibheri', 'Tripurasundari', 'Dolpo Buddha'],
    Humla: ['Simkot', 'Chankheli', 'Sarkegad'],
    Jumla: ['Chandannath', 'Tatopani', 'Sinja'],
    Kalikot: ['Khandachakra', 'Pachaljaharakot', 'Tilagufa'],
    Mugu: ['Khatyad', 'Mugum Karmarong', 'Chhayanath Rara'],
    Salyan: ['Bangad Kupinde', 'Sharada', 'Kapurkot'],
    'Rukum West': ['Musikot', 'Aathbiskot', 'Sanibhumi'],
  },
  'Sudurpashchim Province': {
    Kailali: ['Dhangadhi', 'Tikapur', 'Godawari', 'Bhajani'],
    Kanchanpur: ['Bhimdatta', 'Shuklaphanta', 'Belauri'],
    Dadeldhura: ['Amargadhi', 'Aalital', 'Navadurga'],
    Doti: ['Dipayal Silgadhi', 'Shikhar', 'Purbichauki'],
    Achham: ['Mangalsen', 'Chaurpati', 'Ramaroshan'],
    Bajura: ['Budhinanda', 'Tribeni', 'Himali'],
    Bajhang: ['Jayaprithvi', 'Bungal', 'Thalara'],
    Baitadi: ['Dasharathchand', 'Patan', 'Sigas'],
    Darchula: ['Darchula', 'Shailyashikhar', 'Lekam'],
  },
};



export default function OrganizeCampForm() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(campSchema) });

  const watchProvince = watch('province');
  const watchDistrict = watch('district');

  const onSubmit = async (data) => {
    try{
       const res=await axios.post('http://localhost:8000/dashboard-hospital/blood-camp',data,
         {
    withCredentials: true,
  }
       )

    console.log(data);
    toast.success('Camp scheduled successfully!');
    reset();

    }
    catch(error){
      console.error(error);
    }
   
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <PlusCircle className="text-blue-600" />
        <h2 className="text-xl font-bold">Organize Donation Camp</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

        {/* Camp Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Camp Title*</label>
          <input
            type="text"
            placeholder="Enter title of camp"
            {...register('campTitle')}
            className={`w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.campTitle ? 'border-red-400 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.campTitle && <p className="text-red-500 text-xs mt-1">{errors.campTitle.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
          <input
            type="text"
            placeholder="Enter description about camp"
            {...register('campDescription')}
            className={`w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.campDescription ? 'border-red-400 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.campDescription && <p className="text-red-500 text-xs mt-1">{errors.campDescription.message}</p>}
        </div>

        {/* Address */}
        <label className="block text-md font-medium text-blue-900">Address*</label>

        {/* Province */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Province*</label>
          <select
            {...register('province')}
            onChange={(e) => {
              setValue('province', e.target.value);
              setValue('district', '');
              setValue('city', '');
            }}
            className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <option value="">Select Province</option>
            {Object.keys(nepalData).map((prov) => (
              <option key={prov} value={prov}>{prov}</option>
            ))}
          </select>
          <p className="text-red-500 text-xs mt-1">{errors.province?.message}</p>
        </div>

        {/* District */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">District*</label>
          <select
            {...register('district')}
            onChange={(e) => {
              setValue('district', e.target.value);
              setValue('city', '');
            }}
            disabled={!watchProvince}
            className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select District</option>
            {(nepalData[watchProvince] ? Object.keys(nepalData[watchProvince]) : []).map((dist) => (
              <option key={dist} value={dist}>{dist}</option>
            ))}
          </select>
          <p className="text-red-500 text-xs mt-1">{errors.district?.message}</p>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City / Municipality*</label>
          <select
            {...register('city')}
            disabled={!watchDistrict}
            className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select City</option>
            {(nepalData[watchProvince]?.[watchDistrict] || []).map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          <p className="text-red-500 text-xs mt-1">{errors.city?.message}</p>
        </div>

        {/* Street Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Street Address*</label>
          <input
            type="text"
            placeholder="e.g. Mahadevstan, Koteshwor"
            {...register('streetAddress')}
            className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
          />
          <p className="text-red-500 text-xs mt-1">{errors.streetAddress?.message}</p>
        </div>

        {/* Date & Expected Donors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Camp Date</label>
            <input
              type="date"
              {...register('date')}
              className={`w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.date ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expected Donors</label>
            <input
              type="number"
              placeholder="50"
              min="1"
              {...register('expectedDonors')}
              className={`w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.expectedDonors ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.expectedDonors && <p className="text-red-500 text-xs mt-1">{errors.expectedDonors.message}</p>}
          </div>
        </div>

        {/* Start & End Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
            <input
              type="time"
              {...register('startTime')}
              className={`w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.startTime ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.startTime && <p className="text-red-500 text-xs mt-1">{errors.startTime.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
            <input
              type="time"
              {...register('endTime')}
              className={`w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.endTime ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.endTime && <p className="text-red-500 text-xs mt-1">{errors.endTime.message}</p>}
          </div>
        </div>

        {/* Coordinator */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Coordinator Name</label>
            <input
              type="text"
              placeholder="Enter coordinator name"
              {...register('coordinatorName')}
              className={`w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.coordinatorName ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.coordinatorName && <p className="text-red-500 text-xs mt-1">{errors.coordinatorName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Coordinator Contact</label>
            <input
              type="tel"
              placeholder="10-digit number"
              maxLength={10}
              {...register('coordinatorContact')}
              className={`w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.coordinatorContact ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.coordinatorContact && <p className="text-red-500 text-xs mt-1">{errors.coordinatorContact.message}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Scheduling...' : 'Schedule Camp'}
        </button>
      </form>
    </div>
  );
}