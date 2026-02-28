import React, { useState } from 'react';

export default function Certificate() {
  
  const [certificateData, setCertificateData] = useState({
    name: "",
    date: "",
    location: "",
    medicalOfficer:"",
    authorized:""
  });

  return (
    <div className=' p-4 flex flex-col items-center justify-center  bg-gray-100'>
      <div>
        <button className='  p-2  cursor-pointer hover:bg-sky-50 ubuntu-regular rounded-lg bg-white shadow'>Download Pdf</button>
      </div>

   
    <div className="flex justify-center items-center p-8 bg-gray-100 h-auto font-sans">
      {/* Main Certificate Container */}
      <div className="relative w-250 bg-white shadow-2xl overflow-hidden border-8 border-white">
        
        {/* Background Wave Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.35.298.831.446 1.284.446 1.39 0 2.518-1.128 2.518-2.518 0-.539-.194-1.033-.512-1.416C23.146 15.01 21.5 12.14 21.5 9c0-3.14 1.646-6.01 2.972-7.512.318-.383.512-.877.512-1.416 0-1.39-1.128-2.518-2.518-2.518-.453 0-.934.148-1.284.446C19.854 1.21 18.5 4.93 18.5 9c0 4.07 1.354 7.79 2.684 11z' fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")` }}>
        </div>

        {/* --- Decorative Side Elements --- */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-red-700 rotate-45 z-10 border-r-8 border-white"></div>
        
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-yellow-400 rounded-3xl rotate-12 z-10 shadow-lg border-8 border-white">
            <div className="flex items-center justify-center h-full -rotate-12">
                 <div className="bg-red-700 p-4 rounded-xl">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                 </div>
            </div>
        </div>

        <div className="absolute top-6 right-6 flex flex-col items-center bg-red-700 text-white p-2 rounded-b-lg shadow-md z-20">
            <div className="border border-white p-1 rounded-sm mb-1">
                <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
            </div>
            <span className="text-[8px] font-bold text-center  left-100 leading-tight">BLOOD CARE<br/>BLOOD  CENTER</span>
        </div>

        {/* --- Main Content --- */}
        <div className="relative z-20 flex flex-col items-center pt-7 px-20 text-center">
          
          <h1 className="text-4xl font-black text-black tracking-tighter uppercase mb-1 px-30 z-1">
            Blood Care Blood  Donation Center
          </h1>
          <p className="text-xs font-bold text-gray-700 mb-1">
            Koteshwor,Kathmandu Nepal
          </p>
          <div className="text-sm font-bold text-gray-800">
            Mobile: <span className="text-black">984800000, 9777776876</span>
          </div>
          <p className="text-sm font-bold text-gray-800 mb-8">
            Email: <span className="text-black">bloodcarecenter@gmail.com</span>
          </p>

          <h2 className="text-6xl font-normal mb-8 text-black" style={{ fontFamily: "'UnifrakturMaguntia', serif" }}>
            Certificate of Excellence
          </h2>

          <div className="w-full text-lg space-y-6 text-gray-800 italic">
            <p>This is to certify that</p>
            
            {/* 2. Access state data: name */}
            <div className="border-b-2 border-dotted border-gray-400 w-3/4 mx-auto pb-1 mt-4">
              <span className="text-2xl font-bold not-italic font-serif text-gray-900 uppercase">
                {certificateData.name}
              </span>
            </div>

            <p>for the noble gesture of rendering humanitarian service by donating</p>
            
            {/* 3. Access state data: date and location */}
            <div className="flex justify-center items-baseline gap-2">
              <span>a unit of blood on</span>
              <span className="border-b-2 border-dotted border-gray-400 min-w-37.5 font-bold not-italic px-2">
                {certificateData.date}
              </span>
              <span>at</span>
              <span className="border-b-2 border-dotted border-gray-400 min-w-50 font-bold not-italic px-2">
                {certificateData.location}
              </span>
            </div>
          </div>

          <div className="w-full mt-5 flex flex-col items-center">
            <p className="text-3xl text-gray-700 mb-9" style={{ fontFamily: "'Dancing Script', cursive" }}>
              Blood Care Deeply Appreciates
            </p>

            <div className="w-full flex justify-between px-10 items-end">
                <div className="flex flex-col items-center">
                    <div className="w-48  pt-1">
                       <div className="border-b-2 border-dotted border-gray-400 w-3/4 mx-auto pb-1 mt-4">
              <span className="text-2xl font-bold not-italic font-serif text-gray-900 uppercase">
                {certificateData.medicalOfficer}
              </span>
            </div>
                      
                        <p className="text-sm ubuntu-regular font-bolc">Medical Officer</p>
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <div className="w-48   pt-1">
                      <div className="border-b-2 border-dotted border-gray-400 w-3/4 mx-auto pb-1 mt-4">
              <span className="text-2xl font-bold not-italic font-serif text-gray-900 uppercase">
                {certificateData.medicalOfficer}
              </span>
            </div>
                      
                        <p className="text-sm  ubuntu-regular font-bold">Authorized Signature</p>
                    </div>
                </div>
            </div>
          </div>
        </div>

        <div className="absolute top-1/4 -left-12 w-32 h-32 border-10 border-red-700 rounded-full opacity-20"></div>
      </div>
    </div>

     </div>
  );
}