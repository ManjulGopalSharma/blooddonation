import { User,Dot} from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

export default function EditProfile() {
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);
  const[available,setAvailable]=useState(false);
  const[personalInfo,setPersonalInfo]=useState({
    name:'',
    age:'',
    phone:'',
    address:'',
    gender:'',
    email:''

  })

  const handleAvailability=()=>{
    setAvailable(!available);
  }

  const getImage = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image files allowed");
      return;
    }

    setImage(URL.createObjectURL(file));
  };

  return (
    <div className="flex flex-col justify-center items-center ubuntu-regular">
      <h1 className="text-xl font-semibold mb-4">Edit Profile</h1>

      <form className=" flex flex-col gap-2">
        <div className="flex flex-col gap-2 items-center">

          {/* Profile Image */}
          <div className="flex items-center justify-center h-24 w-24 bg-red-200 rounded-full border-4 border-green-400 overflow-hidden">
            {image ? (
              <img
                src={image}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={50} className="text-red-600" />
            )}
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          {/* Button */}
          <button
            type="button"
            onClick={getImage}
            className="pt-2 border cursor-pointer  border-gray-200 bg-gray-100 shadow rounded-lg px-3 text-center"
          >
            Change Photo
          </button>
        </div>

        <div>
          <input type="hidden" name="available" value={available} />

          {available? (
  <div className="flex flex-row justify-center items-center cursor-pointer bg-green-200  hover:bg-green-300 gap-0  rounded-xl" onClick={handleAvailability}>
                        <Dot size={50} className="text-green-600 " />
                        <div className=" text-green-900  w-40 font-bold">
                          Available to Donate
                        </div>
                      </div>
) : (
  <div className="flex flex-row justify-center items-center cursor-pointer bg-red-200  hover:bg-red-300 gap-0  rounded-xl" onClick={handleAvailability}>
                        <Dot size={50} className="text-red-600 " />
                        <div className=" text-red-900  w-40 font-bold">
                          Not Available to Donate
                        </div>
                      </div>
)}

          
           
          
        </div>
      </form>
    </div>
  );
}
