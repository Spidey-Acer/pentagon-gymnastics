import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <svg
                  className="w-8 h-8 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z" />
                </svg>
                ABC Gymnastics
              </h1>
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
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium text-white transition-colors duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? "bg-blue-700 text-white"
                          : "text-blue-100 hover:bg-blue-700 hover:text-white"
                      }`
                    }
                  >
                    Login
                  </NavLink>
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
