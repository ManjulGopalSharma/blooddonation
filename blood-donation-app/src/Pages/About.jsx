import Map from'../assets/map.png';
import Community from'../assets/community.png';
import Notification from'../assets/notification.png';
import Impact from'../assets/impact.png';
import Camp from'../assets/camp.png';
import Health from'../assets/health.png';
import donationCamp from'../assets/donationCamp.png';
export default function About() {
  return (
    <section className="bg-white py-5 px-6 md:px-16 ubuntu-regular">
      
      {/* Section Heading */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <h2 className="text-2xl md:text-4xl alfa-slab-one-bold font-extrabold text-red-600">
          BloodCare- A Blood Donation App
        </h2>
        <p className="mt-4 font-medium text-gray-600 text-lg">
          Connecting donors and patients in real-time to save lives when every second matters.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-2 gap-12 items-center">

        {/* Left Content */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-gray-800">
            Our Mission
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Our mission is to create a reliable and fast blood donation platform 
            that bridges the gap between donors, recipients, hospitals, and camps. 
            We aim to reduce delays during emergencies by providing real-time 
            location-based donor matching.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800">
            Why This App Matters
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Thousands of patients suffer due to delayed access to blood. 
            This platform ensures that eligible donors are identified quickly 
            and notified instantly, helping save lives efficiently.
          </p>
        </div>

        {/* Right Image */}
        <div className="flex justify-center">
          <img
            src={donationCamp}
            alt="Blood Donation Illustration"
            className="w-80 md:w-96  rounded-xl cursor-pointer transition-transform duration-500 hover:scale-105"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-20 grid sm:grid-cols-2 md:grid-cols-3 gap-8">

        {/* Feature Card 1: Emergency Map */}
        <div className="bg-red-50 p-6 rounded-xl  cursor-pointer shadow-lg text-center transform transition-transform duration-500 hover:scale-105 hover:shadow-2xl">
          <img
            src={Map}
            alt="Map Feature"
            className="h-20 shadow mx-auto rounded-xl mb-4"
          />
          <h4 className="text-xl font-semibold text-red-600">
            Emergency Map Requests
          </h4>
          <p className="text-gray-600 mt-2">
            View urgent blood requests on an interactive map with real-time location updates.
          </p>
        </div>

        {/* Feature Card 2: Community */}
        <div className="bg-red-50 p-6 rounded-xl cursor-pointer shadow-lg text-center transform transition-transform duration-500 hover:scale-105 hover:shadow-2xl">
          <img
            src={Community}
            alt="Community"
            className="h-20 shadow rounded-xl mx-auto mb-4"
          />
          <h4 className="text-xl font-semibold text-red-600">
            Verified Donor Community
          </h4>
          <p className="text-gray-600 mt-2">
            Only medically eligible donors can donate, ensuring safety and trust for everyone.
          </p>
        </div>

        {/* Feature Card 3: Notifications */}
        <div className="bg-red-50 p-6 rounded-xl  cursor-pointer shadow-lg text-center transform transition-transform duration-500 hover:scale-105 hover:shadow-2xl">
          <img
            src={Notification}
            alt="Notifications"
            className="h-20 mx-auto shadow rounded-xl mb-4"
          />
          <h4 className="text-xl font-semibold text-red-600">
            Real-Time Notifications
          </h4>
          <p className="text-gray-600 mt-2">
            Get instant alerts when someone nearby needs blood or when you become eligible again.
          </p>
        </div>

        {/* Feature Card 4: Blood Camps */}
        <div className="bg-red-50 p-6 rounded-xl cursor-pointer shadow-lg text-center transform transition-transform duration-500 hover:scale-105 hover:shadow-2xl">
          <img
            src={Camp}
            alt="Blood Camps"
            className="h-20 rounded-xl mx-auto shadow  mb-4"
          />
          <h4 className="text-xl font-semibold text-red-600">
            Blood Donation Camps
          </h4>
          <p className="text-gray-600 mt-2">
            Discover upcoming blood donation camps near you and register to participate.
          </p>
        </div>

        {/* Feature Card 5: Analytics / Impact */}
        <div className="bg-red-50 p-6 rounded-xl cursor-pointer shadow-lg text-center transform transition-transform duration-500 hover:scale-105 hover:shadow-2xl">
          <img
            src={Impact}
            alt="Impact Stats"
            className="h-20  rounded-xl mx-auto  shadow mb-4"
          />
          <h4 className="text-xl font-semibold text-red-600">
            Track Your Impact
          </h4>
          <p className="text-gray-600 mt-2">
            See your contribution and the lives saved through your donations.
          </p>
        </div>

        {/* Feature Card 6: Health & Safety */}
        <div className="bg-red-50 p-6 rounded-xl cursor-pointer shadow-lg text-center transform transition-transform duration-500 hover:scale-105 hover:shadow-2xl">
          <img
            src={Health}
            alt="Health Tips"
            className="h-20  rounded-xl mx-auto mb-4 shadow"
          />
          <h4 className="text-xl font-semibold text-red-600">
            Health & Safety Tips
          </h4>
          <p className="text-gray-600 mt-2">
            Follow guidelines before and after donation to ensure your safety.
          </p>
        </div>
      </div>

      {/* Impact Line */}
      <div className="mt-16 text-center">
        <p className="text-xl font-semibold text-gray-800">
          ❤️ One donation can save up to <span className="text-red-600">three lives</span>
        </p>
      </div>

    </section>
  );
}
