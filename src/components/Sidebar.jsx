import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Home,
  Users,
  Building2,
  BarChart3,
  BookOpen,
  Heart,
  MessageSquare,
  Settings,
  Shield,
  TrendingUp,
  X,
} from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { currentUser, isAdmin } = useAuth();

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Professors", href: "/professors", icon: Users },
    { name: "Departments", href: "/departments", icon: Building2 },
    { name: "Compare", href: "/compare", icon: BarChart3 },
  ];

  const studentNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: BookOpen },
  ];

  const adminNavigation = [
    { name: "Admin Dashboard", href: "/admin", icon: Shield },
  ];

  const isActive = (href) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  const NavItem = ({ item }) => (
    <Link
      to={item.href}
      className={`nav-link ${
        isActive(item.href) ? "nav-link-active" : "nav-link-inactive"
      }`}
    >
      <item.icon className="h-4 w-4" />
      <span className="text-xs">{item.name}</span>
    </Link>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:fixed lg:top-14 lg:bottom-0 shadow-lg ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
            <h2 className="text-sm font-medium text-slate-700">Navigation</h2>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-all duration-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {/* Main Navigation */}
            <div className="mb-6">
              <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 px-2">
                Main
              </h3>
              <div className="space-y-0.5">
                {navigation.map((item) => (
                  <NavItem key={item.name} item={item} />
                ))}
              </div>
            </div>

            {/* Student Navigation */}
            {currentUser && !isAdmin() && (
              <div className="mb-6">
                <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 px-2">
                  Student
                </h3>
                <div className="space-y-0.5">
                  {studentNavigation.map((item) => (
                    <NavItem key={item.name} item={item} />
                  ))}
                </div>
              </div>
            )}

            {/* Admin Navigation */}
            {currentUser && isAdmin() && (
              <div className="mb-6">
                <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 px-2">
                  Admin
                </h3>
                <div className="space-y-0.5">
                  {adminNavigation.map((item) => (
                    <NavItem key={item.name} item={item} />
                  ))}
                </div>
              </div>
            )}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-slate-200 bg-slate-50">
            <div className="text-center">
              <div className="w-6 h-6 bg-blue-100 rounded-lg mx-auto mb-1.5 flex items-center justify-center">
                <BookOpen className="h-3 w-3 text-blue-600" />
              </div>
              <p className="text-xs text-slate-500">RateMyProf v1.0</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
