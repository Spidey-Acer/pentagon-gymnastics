import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
          <div className="mx-auto max-w-4xl">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-xl">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z"/>
                </svg>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Welcome to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
                ABC Gymnastics
              </span>
            </h1>
            
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Transform your fitness journey with our exceptional array of classes. From yoga to CrossFit, 
              we offer diverse programs designed to help you achieve your wellness goals in a supportive environment.
            </p>
            
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/register"
                className="rounded-md bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-200"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="text-lg font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors duration-200"
              >
                Sign In <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose ABC Gymnastics?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Experience fitness like never before with our comprehensive offerings
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {[
              {
                icon: "🏋️‍♂️",
                title: "Diverse Classes",
                description: "From Yoga and Pilates to CrossFit and Boot Camp, we offer 8 different class types to suit every fitness level and preference."
              },
              {
                icon: "⏰",
                title: "Flexible Scheduling",
                description: "Choose from morning, afternoon, or evening sessions that fit perfectly into your busy lifestyle."
              },
              {
                icon: "📱",
                title: "Easy Booking",
                description: "Book your classes instantly through our user-friendly platform with real-time availability updates."
              }
            ].map((feature, index) => (
              <div key={index} className="text-center p-8 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Classes Preview */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our Class Offerings
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Discover the perfect workout for your fitness journey
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {[
              { name: "Yoga", icon: "🧘‍♀️", color: "from-green-400 to-green-600" },
              { name: "Spin", icon: "🚴‍♂️", color: "from-blue-400 to-blue-600" },
              { name: "Boot Camp", icon: "🏋️‍♂️", color: "from-red-400 to-red-600" },
              { name: "Barre", icon: "🩰", color: "from-pink-400 to-pink-600" },
              { name: "Pilates", icon: "🤸‍♀️", color: "from-purple-400 to-purple-600" },
              { name: "Orangetheory", icon: "🧡", color: "from-orange-400 to-orange-600" },
              { name: "CrossFit", icon: "💪", color: "from-gray-400 to-gray-600" },
              { name: "Hybrid", icon: "⚡", color: "from-yellow-400 to-yellow-600" }
            ].map((classType, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${classType.color} rounded-full flex items-center justify-center`}>
                  <span className="text-2xl text-white">{classType.icon}</span>
                </div>
                <h3 className="font-semibold text-gray-900">{classType.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Start Your Fitness Journey?
          </h2>
          <p className="mt-4 text-xl text-blue-100">
            Join thousands of members who have transformed their lives with ABC Gymnastics
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/register"
              className="rounded-md bg-white px-6 py-3 text-lg font-semibold text-blue-600 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-200"
            >
              Join Now
            </Link>
            <Link
              to="/login"
              className="rounded-md border border-white px-6 py-3 text-lg font-semibold text-white hover:bg-white hover:text-blue-600 transition-all duration-200"
            >
              Member Login
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <svg className="w-8 h-8 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z"/>
              </svg>
              <span className="text-xl font-bold text-white">ABC Gymnastics</span>
            </div>
            <p className="text-gray-400">
              © 2025 ABC Gymnastics. All rights reserved. Transform your fitness journey with us.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
