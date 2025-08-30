import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Sun,
  Moon,
  User,
  LogOut,
  Settings,
  Sparkles,
  GraduationCap,
  Code,
  Trophy,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <nav className="leetcode-nav sticky top-0 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-200 leetcode-glow">
              <Code className="h-8 w-10 lg:h-10 lg:w-12 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                RateMyProf
              </h1>
              <div className="flex items-center space-x-1">
                <Trophy className="h-3 w-3 lg:h-4 lg:w-4 text-yellow-400" />
                <span className="text-xs lg:text-sm text-gray-400 font-medium">
                  PRO
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-300 hover:text-blue-400 font-medium transition-colors duration-200 relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              to="/professors"
              className="text-gray-300 hover:text-blue-400 font-medium transition-colors duration-200 relative group"
            >
              Professors
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              to="/departments"
              className="text-gray-300 hover:text-blue-400 font-medium transition-colors duration-200 relative group"
            >
              Departments
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              to="/compare"
              className="text-gray-300 hover:text-blue-400 font-medium transition-colors duration-200 relative group"
            >
              Compare
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* Right Side */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-3 text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-xl transition-all duration-200 leetcode-glow"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* User Menu */}
            {currentUser ? (
              <div className="flex items-center space-x-4">
                {isAdmin() && (
                  <Link
                    to="/admin"
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl leetcode-glow"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to={isAdmin() ? "/admin" : "/dashboard"}
                  className="leetcode-button px-4 py-2 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isAdmin() ? "Admin Dashboard" : "Dashboard"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md border border-gray-600 hover:border-gray-500"
                >
                  <LogOut className="h-4 w-4 inline mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md border border-gray-600 hover:border-gray-500"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="leetcode-button px-6 py-2 text-white rounded-xl font-medium shadow-lg hover:shadow-xl"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-xl transition-all duration-200"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900 rounded-2xl mt-4 shadow-xl border border-gray-700">
              <Link
                to="/"
                className="block px-4 py-3 text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-xl transition-all duration-200 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/professors"
                className="block px-4 py-3 text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-xl transition-all duration-200 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Professors
              </Link>
              <Link
                to="/departments"
                className="block px-4 py-3 text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-xl transition-all duration-200 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Departments
              </Link>
              <Link
                to="/compare"
                className="block px-4 py-3 text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-xl transition-all duration-200 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Compare
              </Link>

              {/* Mobile Theme Toggle */}
              <div className="px-4 py-3">
                <button
                  onClick={toggleTheme}
                  className="flex items-center space-x-3 w-full text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-xl transition-all duration-200 font-medium px-4 py-2"
                >
                  {isDark ? (
                    <>
                      <Sun className="h-5 w-5" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="h-5 w-5" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>
              </div>

              {/* Mobile User Menu */}
              {currentUser ? (
                <div className="space-y-2 px-4 pb-4">
                  {isAdmin() && (
                    <Link
                      to="/admin"
                      className="block w-full px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl font-medium transition-all duration-200 text-center shadow-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    to={isAdmin() ? "/admin" : "/dashboard"}
                    className="block w-full px-4 py-3 leetcode-button text-white rounded-xl font-medium transition-all duration-200 text-center shadow-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    {isAdmin() ? "Admin Dashboard" : "Dashboard"}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-all duration-200 font-medium shadow-sm border border-gray-600 hover:border-gray-500"
                  >
                    <LogOut className="h-4 w-4 inline mr-2" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2 px-4 pb-4">
                  <Link
                    to="/login"
                    className="block w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-all duration-200 font-medium text-center shadow-sm border border-gray-600 hover:border-gray-500"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block w-full px-4 py-3 leetcode-button text-white rounded-xl font-medium transition-all duration-200 text-center shadow-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
