import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useState ,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const nepalData = {
  "Koshi Province": {
    "Taplejung": ["Taplejung", "Phungling", "Sidingba"],
    "Sankhuwasabha": ["Chainpur", "Khandbari", "Madi"],
    "Solukhumbu": ["Salleri", "Phaplu", "Namche"],
    "Okhaldhunga": ["Okhaldhunga", "Siddhicharan"],
    "Khotang": ["Diktel", "Halesi", "Khotehang"],
    "Bhojpur": ["Bhojpur", "Shadananda"],
    "Dhankuta": ["Dhankuta", "Pakhribas"],
    "Terhathum": ["Myanglung", "Laligurans"],
    "Ilam": ["Ilam", "Mai", "Suryodaya"],
    "Jhapa": ["Birtamod", "Bhadrapur", "Mechinagar", "Damak", "Kankai"],
    "Morang": ["Biratnagar", "Sundar Haraicha", "Urlabari", "Pathari"],
    "Sunsari": ["Dharan", "Itahari", "Inaruwa", "Duhabi"],
  },
  "Madhesh Province": {
    "Saptari": ["Rajbiraj", "Kanchanrup", "Shambhunath"],
    "Siraha": ["Lahan", "Siraha", "Golbazar"],
    "Dhanusha": ["Janakpur", "Dhalkebar", "Mithila"],
    "Mahottari": ["Jaleshwar", "Bardibas", "Gaur"],
    "Sarlahi": ["Malangwa", "Haripur", "Ishworpur"],
    "Rautahat": ["Gaur", "Chandrapur", "Brindaban"],
    "Bara": ["Kalaiya", "Simraungadh", "Nijgadh"],
    "Parsa": ["Birgunj", "Pokhariya", "Bahudarmai"],
  },
  "Bagmati Province": {
    "Kathmandu": ["Kathmandu", "Kirtipur", "Kageshwori", "Tokha", "Budhanilkantha"],
    "Lalitpur": ["Lalitpur", "Godawari", "Mahalaxmi", "Konjyosom"],
    "Bhaktapur": ["Bhaktapur", "Changunarayan", "Madhyapur Thimi", "Suryabinayak"],
    "Kavrepalanchok": ["Dhulikhel", "Banepa", "Panauti", "Namobuddha"],
    "Sindhupalchok": ["Chautara", "Bahrabise", "Melamchi"],
    "Dolakha": ["Charikot", "Jiri", "Bigu"],
    "Ramechhap": ["Manthali", "Ramechhap", "Umakunda"],
    "Sindhuli": ["Sindhuli", "Kamalamai", "Dudhauli"],
    "Makwanpur": ["Hetauda", "Thaha", "Raksirang"],
    "Rasuwa": ["Rasuwa", "Kalika", "Gosaikunda"],
    "Nuwakot": ["Bidur", "Belkotgadhi", "Suryagadhi"],
    "Dhading": ["Nilkantha", "Dhading", "Jwalamukhi"],
    "Chitwan": ["Bharatpur", "Ratnanagar", "Madi", "Rapti"],
  },
  "Gandaki Province": {
    "Kaski": ["Pokhara", "Annapurna", "Machhapuchchhre", "Rupa"],
    "Tanahun": ["Damauli", "Bhanu", "Shuklagandaki"],
    "Syangja": ["Syangja", "Galyang", "Waling"],
    "Lamjung": ["Besishahar", "Sundarbazar", "Rainas"],
    "Gorkha": ["Gorkha", "Palungtar", "Barpak Sulikot"],
    "Manang": ["Chame", "Narphu", "Narpabhumisame"],
    "Mustang": ["Jomsom", "Lomanthang", "Thasang"],
    "Myagdi": ["Baglung", "Beni", "Mangala"],
    "Baglung": ["Baglung", "Dhorpatan", "Jaimini"],
    "Parbat": ["Kushma", "Phalewas", "Modi"],
    "Nawalpur": ["Kawasoti", "Bulingtar", "Madhyabindu"],
  },
  "Lumbini Province": {
    "Rupandehi": ["Butwal", "Siddharthanagar", "Tilottama", "Sainamaina"],
    "Kapilvastu": ["Kapilvastu", "Banganga", "Buddhabhumi"],
    "Arghakhanchi": ["Sandhikharka", "Shitganga", "Bhumikasthan"],
    "Gulmi": ["Tamghas", "Musikot", "Resunga"],
    "Palpa": ["Tansen", "Rampur", "Rambha"],
    "Nawalparasi West": ["Sunwal", "Palhinandan", "Pratappur"],
    "Dang": ["Tulsipur", "Ghorahi", "Lamahi"],
    "Banke": ["Nepalgunj", "Narainapur", "Rapti Sonari"],
    "Bardiya": ["Gulariya", "Thakurbaba", "Rajapur"],
    "Pyuthan": ["Pyuthan", "Sworgadwary", "Mallarani"],
    "Rolpa": ["Rolpa", "Runtigadhi", "Lungri"],
  },
  "Karnali Province": {
    "Surkhet": ["Birendranagar", "Bheriganga", "Lekbesi"],
    "Dailekh": ["Narayan", "Dullu", "Chamunda Bindrasaini"],
    "Jajarkot": ["Bheri", "Chhedagad", "Barekot"],
    "Dolpa": ["Thulibheri", "Tripurasundari", "Dolpo Buddha"],
    "Humla": ["Simkot", "Chankheli", "Sarkegad"],
    "Jumla": ["Chandannath", "Tatopani", "Sinja"],
    "Kalikot": ["Khandachakra", "Pachaljaharakot", "Tilagufa"],
    "Mugu": ["Khatyad", "Mugum Karmarong", "Chhayanath Rara"],
    "Salyan": ["Bangad Kupinde", "Sharada", "Kapurkot"],
    "Rukum West": ["Musikot", "Aathbiskot", "Sanibhumi"],
  },
  "Sudurpashchim Province": {
    "Kailali": ["Dhangadhi", "Tikapur", "Godawari", "Bhajani"],
    "Kanchanpur": ["Bhimdatta", "Shuklaphanta", "Belauri"],
    "Dadeldhura": ["Amargadhi", "Aalital", "Navadurga"],
    "Doti": ["Dipayal Silgadhi", "Shikhar", "Purbichauki"],
    "Achham": ["Mangalsen", "Chaurpati", "Ramaroshan"],
    "Bajura": ["Budhinanda", "Tribeni", "Himali"],
    "Bajhang": ["Jayaprithvi", "Bungal", "Thalara"],
    "Baitadi": ["Dasharathchand", "Patan", "Sigas"],
    "Darchula": ["Darchula", "Shailyashikhar", "Lekam"],
  },
};

export default function Register() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("donor");
  const [cshow, csetShow] = useState(true);
  const [show, setShow] = useState(true);

const onSubmit = async (data) => {
  try {
    let payload = {};

    if (userType === "donor") {
      payload = {
        role: "donor",
        userName: data.fullName,
        email: data.email,
        password: data.password,
        phoneNumber: data.phone,
        dateOfBirth: data.dateofbirth,
        gender: data.gender,
        bloodGroup: data.blood,
        province: data.province,    // ← replaced address
        district: data.district,    // ←
        city: data.city,            // ←
      };

    } else if (userType === "hospital") {
      payload = {
        role: "hospital",
        hospitalName: data.hospitalName,
        email: data.hemail,
        password: data.hpassword,
        phoneNumber: data.hphone,
        registrationNumber: data.hregistration,
        contactPersonName: data.hcontactName,
        contactPersonNumber: data.hcontactNumber,
        province: data.province,       // ← replaced address
        district: data.district,       // ←
        city: data.city,               // ←
        streetAddress: data.streetAddress, // ← hospital needs this extra
      };

    } else if (userType === "organization") {
      payload = {
        role: "organization",
        organizationName: data.organizationName,
        email: data.oemail,
        password: data.opassword,
        phoneNumber: data.ophone,
        registrationNumber: data.oregistration,
        contactPersonName: data.ocontactName,
        contactPersonNumber: data.ocontactNumber,
        province: data.province,       // ← replaced address
        district: data.district,       // ←
        city: data.city,               // ←
        streetAddress: data.streetAddress, // ← organization needs this too
      };
    }

    const response = await axios.post(
      "http://localhost:8000/register",
      payload,
      { withCredentials: true }
    );

    console.log("Backend response:", response.data);
    toast.success(response.data.message || "Signup successful");
    reset();

  } catch (err) {
    console.error(err.response?.data?.message || err.message);
    alert(err.response?.data?.message || "Something went wrong");
  }
};


 const donorSchema = Yup.object().shape({
  fullName: Yup.string().required("Enter full name"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Enter email address"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Enter password"),
  confirmPassword: Yup.string()
    .required("Enter confirm password")
    .oneOf([Yup.ref("password")], "Password and confirm password must match"),
  phone: Yup.string()
    .required("Enter phone number")
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  dateofbirth: Yup.date().required("Enter date of birth"),
  gender: Yup.string().required("Choose your gender"),
  blood: Yup.string().required("Choose your blood group"),
  province: Yup.string().required("Province is required"),      // ← new
  district: Yup.string().required("District is required"),      // ← new
  city: Yup.string().required("City is required"),              // ← new
  agreed: Yup.boolean()
    .oneOf([true], "You must agree that the information is correct")
    .required("Agreement is required"),
});

const hospitalSchema = Yup.object().shape({
  hospitalName: Yup.string().required("Enter hospital name"),
  hemail: Yup.string()
    .email("Invalid email format")
    .required("Enter email address"),
  hpassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Enter password"),
  hconfirmPassword: Yup.string()
    .required("Enter confirm password")
    .oneOf([Yup.ref("hpassword")], "Password and confirm password must match"),
  hphone: Yup.string()
    .required("Enter phone number")
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  hregistration: Yup.string().required("Enter hospital registration number"),
  hcontactName: Yup.string().required("Enter contact person name"),
  hcontactNumber: Yup.string()
    .required("Enter contact number")
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  province: Yup.string().required("Province is required"),          // ← replaced hlocation
  district: Yup.string().required("District is required"),          // ← new
  city: Yup.string().required("City is required"),                  // ← new
  streetAddress: Yup.string().required("Enter street address"),     // ← new
  agreeh: Yup.boolean()
    .oneOf([true], "You must agree that the information is correct")
    .required("Agreement is required"),
});

const organizationSchema = Yup.object().shape({
  organizationName: Yup.string().required("Enter organization name"),
  oemail: Yup.string()
    .email("Invalid email format")
    .required("Enter email address"),
  opassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Enter password"),
  oconfirmPassword: Yup.string()
    .required("Enter confirm password")
    .oneOf([Yup.ref("opassword")], "Password and confirm password must match"),
  ophone: Yup.string()
    .required("Enter phone number")
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  oregistration: Yup.string().required("Enter organization registration number"),
  ocontactName: Yup.string().required("Enter contact person name"),
  ocontactNumber: Yup.string()
    .required("Enter contact number")
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  province: Yup.string().required("Province is required"),          // ← replaced olocation
  district: Yup.string().required("District is required"),          // ← new
  city: Yup.string().required("City is required"),                  // ← new
  streetAddress: Yup.string().required("Enter street address"),     // ← new
  agreeo: Yup.boolean()
    .oneOf([true], "You must agree that the information is correct")
    .required("Agreement is required"),
});

const chooseSchema = (userType) => {
  switch (userType) {
    case "donor":       return donorSchema;
    case "hospital":    return hospitalSchema;
    case "organization": return organizationSchema;
    default:            return Yup.object({});
  }
};

  
  const {
    register,
    handleSubmit,watch, setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(chooseSchema(userType)),
  });
  useEffect(() => {
  reset();
}, [userType]);
 const watchProvince = watch("province");
const watchDistrict = watch("district");
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="m-3 flex items-center justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="shadow max-w-90 p-4 gap-4  space-y-3 ubuntu-regular  rounded-3xl  border border-blue-100 inline  flex-col"
        >
          <ArrowLeft
            className="cursor-pointer hover:bg-gray-300  bg-gray-100 rounded-xl "
            onClick={() => {
              navigate("/");
            }}
          />
          <h1 className="text-center font-medium text-2xl">Register</h1>
          <label className="text-md font-medium text-blue-900">I am a *</label>
          <div className="flex gap-5">
            <label
              className="
        "
            >
              <input
                type="radio"
                name="userType"
                value="donor"
                role="donor"
                checked={userType === "donor"}
                onChange={(e) => setUserType(e.target.value)}
                className="m-1"
              />
              Donor
            </label>

            <label className=" ">
              <input
                type="radio"
                name="userType"
                value="hospital"
                role="hospital"
                checked={userType === "hospital"}
                onChange={(e) => setUserType(e.target.value)}
                className="m-1"
              />
              Hospital
            </label>

            <label
              className="
        "
            >
              <input
                type="radio"
                name="userType"
                value="organization"
                role="organization"
                checked={userType === "organization"}
                onChange={(e) => {
                  setUserType(e.target.value);
                }}
                className="m-1"
              />
              Organization
            </label>
          </div>

          {userType === "donor" && (
            <div>
              <label className="text-md font-medium text-blue-900">Full Name*</label>
              <input
                type="text"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder=" Enter your full name"
                {...register("fullName")}
              />
              <p className="text-red-500 text-sm">{errors.fullName?.message}</p>

              <label className="text-md font-medium text-blue-900">Email*</label>
              <input
                type="text"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder=" Enter your email address"
                {...register("email")}
              />
              <p className="text-red-500 text-sm">{errors.email?.message}</p>

              <label className="text-md font-medium text-blue-900">Password*</label>
              <div className=" flex relative w-full">
                <input
                  className="w-full border p-2   rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  type={show ? "password" : "text"}
                  placeholder="Enter your Password"
                  {...register("password")}
                />
                <button
                  className="absolute  right-2 p-3 cursor-pointer"
                  type="button"
                  onClick={() => setShow(!show)}
                >
                  {show ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <p className="text-red-500 text-sm">{errors.password?.message}</p>

              <label className="text-md font-medium text-blue-900">Confirm Passsword*</label>
              <div className=" flex relative w-full">
                <input
                  className="w-full border p-2   rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  type={cshow ? "password" : "text"}
                  placeholder="Enter  Password again"
                  {...register("confirmPassword")}
                />
                <button
                  className="absolute  right-2 p-3 cursor-pointer"
                  type="button"
                  onClick={() => csetShow(!cshow)}
                >
                  {cshow ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <p className="text-red-500 text-sm">
                {errors.confirmPassword?.message}
              </p>

              <label className="text-md font-medium text-blue-900">Phone Number*</label>
              <input
                type="text"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder=" Enter phone number"
                {...register("phone")}
              />
              <p className="text-red-500 text-sm">{errors.phone?.message}</p>

              <label className="text-md font-medium text-blue-900">Date of birth*</label>
              <input
                type="date"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                {...register("dateofbirth")}
              />

              <label className="text-md font-medium text-blue-900">Gender*</label>
              <div className="flex gap-4 flex-wrap">
                <label className="flex gap-1">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    {...register("gender")}
                  />
                  Male
                </label>
                <label className="flex gap-1">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    {...register("gender")}
                  />
                  Female
                </label>
                <label className="flex gap-1">
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    {...register("gender")}
                  />
                  Other
                </label>
                <p className="text-red-500 text-sm">{errors.gender?.message}</p>
              </div>

              <label className="text-md font-medium text-blue-900">Blood Group*</label>
              <div className="flex flex-row flex-wrap gap-4">

              
              <label className="flex gap-1">
                  <input
                    type="radio"
                    name="blood"
                    value="A+"
                    {...register("blood")}
                  />
                  A+
                </label>
               
                <label className="flex gap-1">
                  <input
                    type="radio"
                    name="blood"
                    value="A-"
                    {...register("blood")}
                  />
                  A-
                </label>
                <label className="flex gap-1">
                  <input
                    type="radio"
                    name="blood"
                    value="B+"
                    {...register("blood")}
                  />
                  B+
                </label>
                <label className="flex gap-1">
                  <input
                    type="radio"
                    name="blood"
                    value="B-"
                    {...register("blood")}
                  />
                  B-
                </label>
                <label className="flex gap-1">
                  <input
                    type="radio"
                    name="blood"
                    value="O+"
                    {...register("blood")}
                  />
                  O+
                </label>

                <label className="flex gap-1">
                  <input
                    type="radio"
                    name="blood"
                    value="O-"
                    {...register("blood")}
                  />
                  O-
                </label>
                <label className="flex gap-1">
                  <input
                    type="radio"
                    name="blood"
                    value="AB+"
                    {...register("blood")}
                  />
                  AB+
                </label>
                <label className="flex gap-1">
                  <input
                    type="radio"
                    name="blood"
                    value="AB-"
                    {...register("blood")}
                  />
                  AB-
                </label>
                <p className="text-red-500 text-sm">{errors.blood?.message}</p>
                </div>
                 <label className="text-md font-medium text-blue-900">Address*</label>
             {/* Province */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Province*</label>
  <select
    {...register("province")}
    onChange={(e) => {
      setValue("province", e.target.value);
      setValue("district", "");  // reset district
      setValue("city", "");      // reset city
    }}
    className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
  >
    <option value="">Select Province</option>
    {Object.keys(nepalData).map((prov) => (
      <option key={prov} value={prov}>{prov}</option>
    ))}
  </select>
  <p className="text-red-500 text-sm">{errors.province?.message}</p>
</div>

{/* District */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">District*</label>
  <select
    {...register("district")}
    onChange={(e) => {
      setValue("district", e.target.value);
      setValue("city", "");  // reset city
    }}
    disabled={!watchProvince}
    className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
  >
    <option value="">Select District</option>
    {(nepalData[watchProvince]
      ? Object.keys(nepalData[watchProvince])
      : []
    ).map((dist) => (
      <option key={dist} value={dist}>{dist}</option>
    ))}
  </select>
  <p className="text-red-500 text-sm">{errors.district?.message}</p>
</div>

{/* City */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">City / Municipality*</label>
  <select
    {...register("city")}
    disabled={!watchDistrict}
    className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
  >
    <option value="">Select City</option>
    {(nepalData[watchProvince]?.[watchDistrict] || []).map((city) => (
      <option key={city} value={city}>{city}</option>
    ))}
  </select>
  <p className="text-red-500 text-sm">{errors.city?.message}</p>
</div>

              

              
                <input  type="checkbox" {...register("agreed")} />
                <label className="p-1">I agree that
                the information provided is correct</label>
              

              <p className="text-red-500 text-sm">{errors.agreed?.message}</p>

              <button
                type="submit"
                className="cursor-pointer  w-full bg-sky-500 text-white py-2 rounded-xl hover:bg-sky-600 transition"
              >
                Submit
              </button>
            </div>
          )}

          {userType === "hospital" && (
            <div>
              <label  className="text-md font-medium text-blue-900">Hospital Name*</label>
              <input
                type="text"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder=" Enter Hospital Name"
                {...register("hospitalName")}
              />
              <p className="text-red-500 text-sm">
                {errors.hospitalName?.message}
              </p>

              <label  className="text-md font-medium text-blue-900">Email*</label>
              <input
                type="text"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder=" Enter your email address"
                {...register("hemail")}
              />
              <p className="text-red-500 text-sm">{errors.hemail?.message}</p>

              <label  className="text-md font-medium text-blue-900">Password*</label>
              <div className=" flex relative w-full">
                <input
                  className="w-full border p-2   rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  type={show ? "password" : "text"}
                  placeholder="Enter your Password"
                  {...register("hpassword")}
                />
                <button
                  className="absolute  right-2 p-3 cursor-pointer"
                  type="button"
                  onClick={() => setShow(!show)}
                >
                  {show ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <p className="text-red-500 text-sm">
                {errors.hpassword?.message}
              </p>

              <label  className="text-md font-medium text-blue-900">Confirm Passsword*</label>
              <div className=" flex relative w-full">
                <input
                  className="w-full border p-2   rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  type={cshow ? "password" : "text"}
                  placeholder="Enter  Password again"
                  {...register("hconfirmPassword")}
                />
                <button
                  className="absolute  right-2 p-3 cursor-pointer"
                  type="button"
                  onClick={() => csetShow(!cshow)}
                >
                  {cshow ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <p className="text-red-500 text-sm">
                {errors.hconfirmPassword?.message}
              </p>

              <label  className="text-md font-medium text-blue-900">Phone Number*</label>
              <input
                type="text"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder=" Enter phone number of hospital"
                {...register("hphone")}
              />
              <p className="text-red-500 text-sm">{errors.hphone?.message}</p>

              <label  className="text-md font-medium text-blue-900">Hospital Registration Number*</label>
              <input
                type="text"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder=" Enter Hospital Registration Number "
                {...register("hregistration")}
              />
              <p className="text-red-500 text-sm">
                {errors.hregistration?.message}
              </p>

              <label  className="text-md font-medium text-blue-900">Contact Person Name*</label>
              <input
                type="text"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder=" Enter contact person name "
                {...register("hcontactName")}
              />
              <p className="text-red-500 text-sm">
                {errors.hcontactName?.message}
              </p>

              <label  className="text-md font-medium text-blue-900">Contact Person Number*</label>
              <input
                type="text"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder=" Enter contact person Phone Number "
                {...register("hcontactNumber")}
              />
              <p className="text-red-500 text-sm">
                {errors.hcontactNumber?.message}
              </p>

              <label  className="text-md font-medium text-blue-900">Location*</label>
              <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Province*</label>
      <select
        {...register("province")}
        onChange={(e) => {
          setValue("province", e.target.value);
          setValue("district", "");
          setValue("city", "");
        }}
        className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
      >
        <option value="">Select Province</option>
        {Object.keys(nepalData).map((prov) => (
          <option key={prov} value={prov}>{prov}</option>
        ))}
      </select>
      <p className="text-red-500 text-sm">{errors.province?.message}</p>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">District*</label>
      <select
        {...register("district")}
        onChange={(e) => {
          setValue("district", e.target.value);
          setValue("city", "");
        }}
        disabled={!watchProvince}
        className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <option value="">Select District</option>
        {(nepalData[watchProvince] ? Object.keys(nepalData[watchProvince]) : []).map((dist) => (
          <option key={dist} value={dist}>{dist}</option>
        ))}
      </select>
      <p className="text-red-500 text-sm">{errors.district?.message}</p>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">City / Municipality*</label>
      <select
        {...register("city")}
        disabled={!watchDistrict}
        className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <option value="">Select City</option>
        {(nepalData[watchProvince]?.[watchDistrict] || []).map((city) => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>
<p className="text-red-500 text-sm">{errors.city?.message}</p>

      
    </div>
    <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address*</label>
  <input
    type="text"
    placeholder="e.g. Maharajgunj Road, Kathmandu"
    {...register("streetAddress")}
    className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
  />
  <p className="text-red-500 text-sm">{errors.streetAddress?.message}</p>
</div>

              <input type="checkbox" {...register("agreeh")} />
              <label className="p-1">I agree that the information provided is correct</label>

              <p className="text-red-500 text-sm">{errors.agreeh?.message}</p>

              <button
                type="submit"
                className="cursor-pointer  w-full bg-sky-500 text-white m-1 py-2 rounded-xl hover:bg-sky-600 transition"
              >
                Submit
              </button>
            </div>
          )}

          {userType === "organization" && (
            <div>
              <label className="text-md font-medium text-blue-900">Organization Name*</label>
              <input
                type="text"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder=" Enter Organization Name"
                {...register("organizationName")}
              />
              <p className="text-red-500 text-sm">
                {errors.organizationName?.message}
              </p>

              <label className="text-md font-medium text-blue-900">Email*</label>
              <input
                type="text"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder=" Enter your email address"
                {...register("oemail")}
              />
              <p className="text-red-500 text-sm">{errors.oemail?.message}</p>

              <label className="text-md font-medium text-blue-900">Password*</label>
              <div className=" flex relative w-full">
                <input
                  className="w-full border p-2   rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  type={show ? "password" : "text"}
                  placeholder="Enter your Password"
                  {...register("opassword")}
                />
                <button
                  className="absolute  right-2 p-3 cursor-pointer"
                  type="button"
                  onClick={() => setShow(!show)}
                >
                  {show ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <p className="text-red-500 text-sm">
                {errors.opassword?.message}
              </p>

              <label className="text-md font-medium text-blue-900">Confirm Passsword*</label>
              <div className=" flex relative w-full">
                <input
                  className="w-full border p-2   rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  type={cshow ? "password" : "text"}
                  placeholder="Enter  Password again"
                  {...register("oconfirmPassword")}
                />
                <button
                  className="absolute  right-2 p-3 cursor-pointer"
                  type="button"
                  onClick={() => csetShow(!cshow)}
                >
                  {cshow ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <p className="text-red-500 text-sm">
                {errors.oconfirmPassword?.message}
              </p>

              <label className="text-md font-medium text-blue-900">Phone Number*</label>
              <input
                type="text"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder=" Enter phone number of organization"
                {...register("ophone")}
              />
              <p className="text-red-500 text-sm">{errors.ophone?.message}</p>

              <label className="text-md font-medium text-blue-900">Organization Registration Number*</label>
              <input
                type="text"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder=" Enter Organization Registration Number "
                {...register("oregistration")}
              />
              <p className="text-red-500 text-sm">
                {errors.oregistration?.message}
              </p>

              <label className="text-md font-medium text-blue-900">Contact Person Name*</label>
              <input
                type="text"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder=" Enter contact person name "
                {...register("ocontactName")}
              />
              <p className="text-red-500 text-sm">
                {errors.ocontactName?.message}
              </p>

              <label className="text-md font-medium text-blue-900">Contact Person Number*</label>
              <input
                type="text"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder=" Enter contact person Phone Number "
                {...register("ocontactNumber")}
              />
              <p className="text-red-500 text-sm">
                {errors.ocontactNumber?.message}
              </p>

              <label className="text-md font-medium text-blue-900">Location*</label>
                      <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Province*</label>
      <select
        {...register("province")}
        onChange={(e) => {
          setValue("province", e.target.value);
          setValue("district", "");
          setValue("city", "");
        }}
        className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
      >
        <option value="">Select Province</option>
        {Object.keys(nepalData).map((prov) => (
          <option key={prov} value={prov}>{prov}</option>
        ))}
      </select>
      <p className="text-red-500 text-sm">{errors.province?.message}</p>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">District*</label>
      <select
        {...register("district")}
        onChange={(e) => {
          setValue("district", e.target.value);
          setValue("city", "");
        }}
        disabled={!watchProvince}
        className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <option value="">Select District</option>
        {(nepalData[watchProvince] ? Object.keys(nepalData[watchProvince]) : []).map((dist) => (
          <option key={dist} value={dist}>{dist}</option>
        ))}
      </select>
      <p className="text-red-500 text-sm">{errors.district?.message}</p>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">City / Municipality*</label>
      <select
        {...register("city")}
        disabled={!watchDistrict}
        className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <option value="">Select City</option>
        {(nepalData[watchProvince]?.[watchDistrict] || []).map((city) => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>
<p className="text-red-500 text-sm">{errors.city?.message}</p>
      
    </div>
              <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address*</label>
  <input
    type="text"
    placeholder="e.g. Maharajgunj Road, Kathmandu"
    {...register("streetAddress")}
    className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
  />
  <p className="text-red-500 text-sm">{errors.streetAddress?.message}</p>
</div>

              
              <input type="checkbox" {...register("agreeo")} />
              <label className="p-1">I agree that the information provided is correct</label>
      
              <p className="text-red-500 text-sm">{errors.agreeo?.message}</p>
              
              <button
                type="submit"
                className="cursor-pointer  w-full bg-sky-500 text-white m-1 py-2 rounded-xl hover:bg-sky-600 transition"
              >
                Submit
              </button>
            </div>
          )}
        </form>
      </div>
    </>
  );
}
