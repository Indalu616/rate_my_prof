import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, User, LogOut, Bell, Search, Code, Trophy } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const TopNavbar = ({ onMenuClick }) => {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      setShowUserMenu(false);
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/professors?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Left side - Menu button and Logo */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
            >
              <Menu className="h-4 w-4" />
            </button>

            <Link to="/" className="flex items-center space-x-2">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Code className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-slate-800">
                RateMyProf
              </span>
            </Link>
          </div>

          {/* Center - Search bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search professors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-all duration-200"
              >
                <Search className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>

          {/* Right side - Actions and User menu */}
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200 relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User menu */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200"
                >
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-700 text-xs font-medium">
                      {currentUser.displayName?.charAt(0) ||
                        currentUser.email?.charAt(0) ||
                        "U"}
                    </span>
                  </div>
                  <span className="hidden sm:block text-xs text-slate-700">
                    {currentUser.displayName || currentUser.email}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                    <div className="px-3 py-2 border-b border-slate-200">
                      <p className="text-xs text-slate-500">Signed in as</p>
                      <p className="text-xs font-medium text-slate-700 truncate">
                        {currentUser.email}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link
                        to={isAdmin() ? "/admin" : "/dashboard"}
                        className="flex items-center px-3 py-2 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="h-3.5 w-3.5 mr-2" />
                        {isAdmin() ? "Admin Dashboard" : "Student Dashboard"}
                      </Link>

                      {isAdmin() && (
                        <Link
                          to="/admin"
                          className="flex items-center px-3 py-2 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Trophy className="h-3.5 w-3.5 mr-2" />
                          Admin Panel
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-slate-200 py-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-2 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200"
                      >
                        <LogOut className="h-3.5 w-3.5 mr-2" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200 font-medium"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 font-medium text-xs shadow-sm"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
