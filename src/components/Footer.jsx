import { Link } from "react-router-dom";
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Heart,
  ArrowUp,
  Code,
  Trophy,
} from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden border-t border-gray-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl leetcode-glow">
                  <Code className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    RateMyProf
                  </h3>
                  <p className="text-blue-300 text-sm">
                    University Excellence Platform
                  </p>
                </div>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Empowering students to make informed decisions about their
                education through authentic peer reviews and comprehensive
                professor insights.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-110 leetcode-glow"
                >
                  <Facebook className="h-5 w-5 text-blue-400" />
                </a>
                <a
                  href="#"
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-110 leetcode-glow"
                >
                  <Twitter className="h-5 w-5 text-blue-400" />
                </a>
                <a
                  href="#"
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-110 leetcode-glow"
                >
                  <Instagram className="h-5 w-5 text-pink-400" />
                </a>
                <a
                  href="#"
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-110 leetcode-glow"
                >
                  <Linkedin className="h-5 w-5 text-blue-400" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-blue-100">
                Quick Links
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/"
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center space-x-2 group"
                  >
                    <span className="w-1 h-1 bg-blue-400 rounded-full group-hover:scale-150 transition-transform duration-200"></span>
                    <span>Home</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/professors"
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center space-x-2 group"
                  >
                    <span className="w-1 h-1 bg-blue-400 rounded-full group-hover:scale-150 transition-transform duration-200"></span>
                    <span>All Professors</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/departments"
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center space-x-2 group"
                  >
                    <span className="w-1 h-1 bg-blue-400 rounded-full group-hover:scale-150 transition-transform duration-200"></span>
                    <span>Departments</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/compare"
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center space-x-2 group"
                  >
                    <span className="w-1 h-1 bg-blue-400 rounded-full group-hover:scale-150 transition-transform duration-200"></span>
                    <span>Compare Professors</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-blue-100">
                Resources
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center space-x-2 group"
                  >
                    <span className="w-1 h-1 bg-blue-400 rounded-full group-hover:scale-150 transition-transform duration-200"></span>
                    <span>Student Guide</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center space-x-2 group"
                  >
                    <span className="w-1 h-1 bg-blue-400 rounded-full group-hover:scale-150 transition-transform duration-200"></span>
                    <span>Review Guidelines</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center space-x-2 group"
                  >
                    <span className="w-1 h-1 bg-blue-400 rounded-full group-hover:scale-150 transition-transform duration-200"></span>
                    <span>FAQ</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center space-x-2 group"
                  >
                    <span className="w-1 h-1 bg-blue-400 rounded-full group-hover:scale-150 transition-transform duration-200"></span>
                    <span>Support</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-blue-100">
                Contact Us
              </h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-300">
                  <MapPin className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span className="text-sm">
                    123 University Ave, Campus Town, ST 12345
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Phone className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span className="text-sm">(555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Mail className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span className="text-sm">support@ratemyprof.edu</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <span>© 2024 RateMyProf. Made with</span>
                <Heart className="h-4 w-4 text-red-400 fill-current" />
                <span>for students</span>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 p-3 leetcode-button text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-50"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </footer>
  );
};

export default Footer;
