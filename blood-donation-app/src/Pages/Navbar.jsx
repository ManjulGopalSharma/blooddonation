import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
   const navigateHome=()=>{
    navigate('/')
  }

  const navigateAbout=()=>{
    navigate('/about')
  }

  return (
    <>
      <nav className="z-100 m-0 w-full bg-red-100 p-5 relative flex items-center ubuntu-regular ">
        <div className="flex text-left justify-start items-center font-bold text-3xl w-1/2">
          <h1 className="text-red-800 cursor-pointer">BloodCare</h1>
        </div>

        <div className="hidden md:flex font-medium text-xl space-x-4 ml-auto items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-red-600 font-semibold pb-1 border-b-2 border-red-600"
                : "hover:text-red-500 text-black font-medium"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "text-red-600 font-semibold pb-1 border-b-2 border-red-600"
                : "hover:text-red-500 text-black font-medium"
            }
          >
            About
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive
                ? "text-red-600 font-semibold pb-1 border-b-2 border-red-600"
                : "hover:text-red-500 text-black font-medium"
            }
          >
            Contact
          </NavLink>

          <NavLink
            to="/register"
            className="font-medium bg-red-400 rounded-xl p-2 hover:bg-red-600 shadow"
          >
            Register
          </NavLink>

          <NavLink
            to="/login"
            className="font-medium bg-red-400 rounded-xl p-2 hover:bg-red-600 shadow"
          >
            Login
          </NavLink>
        </div>

        <div className="md:hidden ml-auto">
          <button onClick={() => setOpen(!open)}>
            {open ? (
              <X className="h-6 w-6 text-red-600" />
            ) : (
              <Menu className="h-6 w-6 text-red-600" />
            )}
          </button>
        </div>

        <div
          className={`
          fixed top-0 right-0 rounded  border border-gray-200 h-2/3 w-50 bg-white shadow transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "translate-x-full"}
          md:hidden flex flex-col
        `}
        >
          <div className="flex justify-end p-4">
            <button onClick={() => setOpen(false)}>
              <X className="h-6 w-6 text-red-600" />
            </button>
          </div>

          <div className="flex flex-col flex-1 justify-center items-center space-y-6 font-semibold ubuntu-regular">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-red-600 font-semibold pb-1 border-b-2 border-red-600"
                  : "hover:text-red-500 text-black font-medium"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive
                  ? "text-red-600 font-semibold pb-1 border-b-2 border-red-600"
                  : "hover:text-red-500  text-black font-medium"
              }
              onClick={() => {
               
                setOpen(false);
                
              }}
            >
              About us
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive
                  ? "text-red-600 font-semibold pb-1 border-b-2 border-red-600"
                  : "hover:text-red-500 font-medium text-black"
              }
              onClick={() => {
                setOpen(false);
              }}
            >
              Contact
            </NavLink>

            <NavLink
              to="/register"
              className="font-medium bg-red-400 rounded-xl p-2 hover:bg-red-600 shadow"
              onClick={() => setOpen(false)}
            >
              Register
            </NavLink>

            <NavLink
              to="/login"
              className="font-medium bg-red-400 rounded-xl p-2 hover:bg-red-600 shadow"
              onClick={() => setOpen(false)}
            >
              Login
            </NavLink>
          </div>
        </div>

        {open && (
          <div
            className="fixed inset-0 bg-black opacity-0 z-40  md:hidden"
            onClick={() => setOpen(false)}
          ></div>
        )}
      </nav>
    </>
  );
}
