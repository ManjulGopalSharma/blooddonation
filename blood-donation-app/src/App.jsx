import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import LayoutWithNavbar from "./Pages/LayoutWithNavbar";
import DashboardDonor from "./Pages/DashboardDonor";
import DashboardHospital from "./Pages/DashboardHospital";

import DonorProfile from "./Pages/Profile";


const Home = lazy(() => import("./Pages/Home"));
const About = lazy(() => import("./Pages/About"));
const Contact = lazy(() => import("./Pages/Contact"));
const Login = lazy(() => import("./Pages/Login"));
const Register = lazy(() => import("./Pages/Register"));
const Certificate=lazy(()=>import('./Pages/Certificate'));
const EditProfile=lazy(()=>import('./Pages/EditProfile'));

export default function App() {
  return (
    <Router>
      <Suspense fallback={<div> </div>}>
        <Routes>
          
          
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard-donor" element={<DashboardDonor/>}/>
            <Route path="/dashboard-hospital" element={<DashboardHospital/>}/>

            <Route path="/profile" element={<DonorProfile/>}/>
            <Route path="/profile/edit-profile" element={<EditProfile/>}/>

            <Route path="/certificate" element={<Certificate/>}/>

           

          

          
          <Route element={<LayoutWithNavbar />}>
            <Route path="/" index element={<Home/>} /> 
            <Route path="/about" element={<About/>} />
            <Route path="/contact" element={<Contact/>} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}
