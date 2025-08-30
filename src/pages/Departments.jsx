import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Star,
  Users,
  BookOpen,
  MapPin,
  ArrowRight,
  Award,
  TrendingUp,
  Filter,
} from "lucide-react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const professorsRef = collection(db, "professors");
      const querySnapshot = await getDocs(professorsRef);

      const professors = [];
      querySnapshot.forEach((doc) => {
        professors.push({ id: doc.id, ...doc.data() });
      });

      // Group professors by department
      const deptMap = {};
      professors.forEach((professor) => {
        if (!deptMap[professor.department]) {
          deptMap[professor.department] = {
            name: professor.department,
            professors: [],
            totalReviews: 0,
            avgRating: 0,
            totalCourses: 0,
          };
        }
        deptMap[professor.department].professors.push(professor);
        deptMap[professor.department].totalReviews +=
          professor.reviewCount || 0;
        deptMap[professor.department].totalCourses +=
          professor.courses?.length || 0;
      });

      // Calculate average ratings for each department
      Object.values(deptMap).forEach((dept) => {
        const totalRating = dept.professors.reduce(
          (sum, prof) => sum + (prof.averageRating || 0),
          0
        );
        dept.avgRating =
          dept.professors.length > 0 ? totalRating / dept.professors.length : 0;
      });

      const deptArray = Object.values(deptMap);
      setDepartments(deptArray);
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDepartments = departments.filter((dept) => {
    if (searchQuery) {
      return dept.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const sortedDepartments = [...filteredDepartments].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "professors":
        return b.professors.length - a.professors.length;
      case "rating":
        return b.avgRating - a.avgRating;
      case "reviews":
        return b.totalReviews - a.totalReviews;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-2xl">
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-800">
              Departments
            </h1>
          </div>
          <p className="text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto">
            Explore professors by academic department
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="card-elevated p-6 lg:p-8 animate-pulse">
              <div className="h-6 bg-slate-200 rounded mb-4"></div>
              <div className="h-4 bg-slate-200 rounded mb-3"></div>
              <div className="h-4 bg-slate-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-2xl">
            <MapPin className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-800">
            Departments
          </h1>
        </div>
        <p className="text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto">
          Explore professors by academic department
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        <div className="card-elevated p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {departments.length}
          </div>
          <div className="text-slate-600 text-sm font-medium">Departments</div>
        </div>
        <div className="card-elevated p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {departments.reduce((sum, dept) => sum + dept.professors.length, 0)}
          </div>
          <div className="text-slate-600 text-sm font-medium">
            Total Professors
          </div>
        </div>
        <div className="card-elevated p-6 text-center">
          <div className="text-3xl font-bold text-yellow-600 mb-2">
            {departments.reduce((sum, dept) => sum + dept.totalReviews, 0)}
          </div>
          <div className="text-slate-600 text-sm font-medium">
            Total Reviews
          </div>
        </div>
        <div className="card-elevated p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {departments.reduce((sum, dept) => sum + dept.totalCourses, 0)}
          </div>
          <div className="text-slate-600 text-sm font-medium">
            Total Courses
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card-elevated p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Filter className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-slate-800">
            Search & Filters
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input"
          >
            <option value="name">Sort by Name</option>
            <option value="professors">Sort by Professor Count</option>
            <option value="rating">Sort by Average Rating</option>
            <option value="reviews">Sort by Review Count</option>
          </select>

          <button
            onClick={() => {
              setSearchQuery("");
              setSortBy("name");
            }}
            className="btn-outline"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 font-medium">
          <Users className="h-4 w-4" />
          <span>
            Showing {filteredDepartments.length} of {departments.length}{" "}
            departments
          </span>
        </div>
      </div>

      {/* Departments Grid */}
      {sortedDepartments.length === 0 ? (
        <div className="card-elevated p-12 text-center">
          <Search className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            No departments found
          </h3>
          <p className="text-slate-600 mb-6">
            Try adjusting your search criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {sortedDepartments.map((department) => (
            <div
              key={department.name}
              className="card-elevated p-6 lg:p-8 group"
            >
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h3 className="text-lg lg:text-xl font-semibold text-slate-800 group-hover:text-blue-600 transition-all duration-200 flex-1 pr-4">
                  {department.name}
                </h3>
                <div className="flex items-center space-x-1 bg-blue-50 px-3 py-2 rounded-xl border border-blue-200">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-bold text-slate-800">
                    {department.professors.length}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Average Rating</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-slate-800 font-medium">
                      {department.avgRating.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Total Reviews</span>
                  <span className="text-slate-800 font-medium">
                    {department.totalReviews}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Total Courses</span>
                  <span className="text-slate-800 font-medium">
                    {department.totalCourses}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <Link
                  to={`/professors?department=${encodeURIComponent(
                    department.name
                  )}`}
                  className="text-blue-600 font-medium group-hover:underline flex items-center space-x-2 text-sm lg:text-base"
                >
                  <span>View Professors</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-all duration-200" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Back to Professors */}
      <div className="text-center">
        <Link
          to="/professors"
          className="btn-primary inline-flex items-center space-x-2"
        >
          <ArrowRight className="h-5 w-5" />
          <span>View All Professors</span>
        </Link>
      </div>
    </div>
  );
};

export default Departments;
