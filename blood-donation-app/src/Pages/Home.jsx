// import Donation from "../assets/Donating.png";
// import { Link } from "react-router-dom";

// export default function Home() {
//   return (
//     <div className=" w-full m-0 p-0 ">
//       <div className="w-full  bg-linear-to-br from-red-600 via-green-300 to-pink-700 flex flex-col md:flex-row ">
//         <div className="ubuntu-regular text-center text-xl md:w-1/2 md:items-center flex flex-col justify-center items-center">
//           <p className="font-medium md:text-2xl mb-2">
//             A future without blood scarcity starts with you.

//           </p>
//           <p className="font-medium md:text-center md:text-2xl mb-4">
//             Contribute your time,donate blood or support a holistic blood management cycle
//           </p>
//           <h1 className="alfa-slab-one-bold text-3xl font-extrabold text-white md:text-4xl">
//             BE A LIFE SAVER,DONATE BLOOD TODAY!

//           </h1>
//           <div className="flex  flex-col gap-4 pt-5 md:hidden">
//             <p className="text-white alfa-slab-one-bold  font-bold">Be part of a community that saves lives.</p>

//            <div className="flex  pb-3 gap-7 flex-row items-center justify-center">

          
//            <Link
//               to="/register"
//               className="text-red-500 font-semibold underline :underline hover:text-red-700 cursor-pointer"
//             >
//               {" "}
//               Register
//             </Link>
//              <Link
//               to="/login"
//               className="text-red-500 font-semibold underline  hover:underline hover:text-red-700 cursor-pointer"
//             >
//               {" "}
//               Login
//             </Link>
//              </div>
//              </div>

//         </div>

//         <div className="w-full md:w-1/2">
//           <img  className='w-full block rounded-t-xl md:rounded-tl-3xl  md:rounded-tr-none md:rounded-bl-3xl'src={Donation}  alt="Donating"/>
//         </div>

//       </div>

//     </div>
//   );
// }













import React, { useState } from "react";
import Donation from "../assets/Donating.png";
import { Link } from "react-router-dom";

export default function Home() {
  const [activeFaq, setActiveFaq] = useState(null);

  const steps = [
    { title: "Register", description: "Create your donor profile with your personal details." },
    { title: "Check Eligibility", description: "Ensure you meet health requirements for donation." },
    { title: "Book Appointment", description: "Schedule a donation at a nearby center or camp." },
    { title: "Donate Blood", description: "Visit the center and safely donate blood." },
    { title: "Get Certificate", description: "Receive a donor certificate and save lives!" },
  ];

  const features = [
    { title: "Save Lives", description: "Your donation can save multiple lives in need." },
    { title: "Free Health Checkup", description: "Every donor receives a free basic health checkup." },
    { title: "Community Impact", description: "Contribute to your community’s well-being." },
    { title: "Easy & Safe", description: "Modern blood donation is quick, easy, and safe." },
  ];

  const faqs = [
    { question: "Who can donate blood?", answer: "Healthy individuals aged 18-60 with weight over 50kg can donate." },
    { question: "How often can I donate?", answer: "Whole blood donation is allowed every 3-4 months." },
    { question: "Is donating blood safe?", answer: "Yes, all procedures are sterile and safe." },
    { question: "Do I need to fast before donation?", answer: "No, but a light meal is recommended." },
  ];

  return (
    <div className="w-full m-0 p-0 ubuntu-regular ">
      {/* Hero Section */}
      <div className="w-full bg-linear-to-br from-red-600 via-green-300 to-pink-700 flex flex-col md:flex-row">
        <div className="ubuntu-regular text-center text-xl md:w-1/2 md:items-center flex flex-col justify-center items-center p-6">
          <p className="font-medium md:text-2xl mb-2">
            A future without blood scarcity starts with you.
          </p>
          <p className="font-medium md:text-center md:text-2xl mb-4">
            Contribute your time, donate blood or support a holistic blood management cycle
          </p>
          <h1 className="alfa-slab-one-bold text-3xl font-extrabold text-white md:text-4xl mb-4">
            BE A LIFE SAVER, DONATE BLOOD TODAY!
          </h1>
          <div className="flex flex-col gap-4 pt-5 md:hidden">
            <p className="text-white alfa-slab-one-bold font-bold">Be part of a community that saves lives.</p>
            <div className="flex pb-3 gap-7 flex-row items-center justify-center">
              <Link to="/register" className="text-red-500 font-semibold underline hover:text-red-700 cursor-pointer">
                Register
              </Link>
              <Link to="/login" className="text-red-500 font-semibold underline hover:text-red-700 cursor-pointer">
                Login
              </Link>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <img
            className="w-full block rounded-t-xl md:rounded-tl-3xl md:rounded-tr-none md:rounded-bl-3xl"
            src={Donation}
            alt="Donating"
          />
        </div>
      </div>

      {/* Steps Section */}
      <section id="steps" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How to Donate Blood</h2>
          <div className="grid md:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow text-center hover:shadow-lg transition">
                <div className="text-2xl font-bold mb-3"></div>
                <h3 className="text-xl font-semibold mb-2">{index + 1}. {step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Donate Blood?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-red-50 p-6 rounded-lg text-center hover:shadow-lg transition">
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border rounded-lg p-4">
                <button
                  className="w-full text-left font-semibold flex justify-between items-center"
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                >
                  {faq.question}
                  <span>{activeFaq === index ? "-" : "+"}</span>
                </button>
                {activeFaq === index && <p className="mt-2 text-gray-700">{faq.answer}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-red-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
        <p className="mb-6">Sign up today and join our community of lifesavers.</p>
        <Link
          to="/register"
          className="bg-white text-red-600 font-bold px-6 py-3 rounded shadow hover:bg-gray-200 transition"
        >
          Register Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10 mt-16">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Blood Donation App. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/about" className="hover:underline">About Us</Link>
            <Link to="/contact" className="hover:underline">Contact</Link>
            <Link to="#" className="hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
