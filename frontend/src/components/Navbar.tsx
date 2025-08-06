import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import Logo from "./Logo";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleProfile = () => {
    navigate("/profile");
    setIsProfileOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Logo variant="light" size="lg" />
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {isAuthenticated ? (
                <>
                  <NavLink
                    to="/classes"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? "bg-blue-700 text-white"
                          : "text-blue-100 hover:bg-blue-700 hover:text-white"
                      }`
                    }
                  >
                    Classes
                  </NavLink>
                  <NavLink
                    to="/equipment"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? "bg-blue-700 text-white"
                          : "text-blue-100 hover:bg-blue-700 hover:text-white"
                      }`
                    }
                  >
                    Equipment
                  </NavLink>
                  <NavLink
                    to="/packages"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? "bg-blue-700 text-white"
                          : "text-blue-100 hover:bg-blue-700 hover:text-white"
                      }`
                    }
                  >
                    Packages
                  </NavLink>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? "bg-blue-700 text-white"
                          : "text-blue-100 hover:bg-blue-700 hover:text-white"
                      }`
                    }
                  >
                    Dashboard
                  </NavLink>
                  {user?.role === "admin" && (
                    <NavLink
                      to="/admin"
                      className={({ isActive }) =>
                        `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                          isActive
                            ? "bg-purple-700 text-white"
                            : "text-purple-100 hover:bg-purple-700 hover:text-white bg-purple-600"
                        }`
                      }
                    >
                      Admin
                    </NavLink>
                  )}

                  {/* User Profile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-700 transition-colors duration-200"
                    >
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold">
                          {user?.forename
                            ? user.forename.charAt(0).toUpperCase()
                            : user?.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span>{user?.forename || "User"}</span>
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isProfileOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                        <div className="px-4 py-2 text-sm text-gray-700 border-b">
                          <div className="font-semibold">
                            {user?.forename} {user?.surname}
                          </div>
                          <div className="text-gray-500">{user?.email}</div>
                        </div>
                        <button
                          onClick={handleProfile}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Edit Profile
                        </button>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium border border-blue-300 transition-colors duration-200 ${
                        isActive
                          ? "bg-white text-blue-600"
                          : "text-white hover:bg-white hover:text-blue-600"
                      }`
                    }
                  >
                    Register
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
