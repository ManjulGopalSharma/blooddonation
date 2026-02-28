import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function LayoutWithNavbar() {
  return (
    <>
    
      <Navbar />
      <main >
        <Outlet /> 
      </main>

     
    </>
  );
}
