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
  Scale,
  X,
  Plus,
  BarChart3,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";

const Compare = () => {
  const [professors, setProfessors] = useState([]);
  const [selectedProfessors, setSelectedProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  useEffect(() => {
    fetchProfessors();
  }, []);

  const fetchProfessors = async () => {
    try {
      setLoading(true);
      const professorsRef = collection(db, "professors");
      const querySnapshot = await getDocs(professorsRef);

      const professorsData = [];
      querySnapshot.forEach((doc) => {
        professorsData.push({ id: doc.id, ...doc.data() });
      });

      setProfessors(professorsData);
    } catch (error) {
      console.error("Error fetching professors:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProfessors = professors.filter((professor) => {
    if (searchQuery) {
      return professor.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    if (departmentFilter) {
      return professor.department === departmentFilter;
    }
    return true;
  });

  const addProfessorToComparison = (professor) => {
    if (selectedProfessors.length >= 3) {
      alert("You can only compare up to 3 professors at a time");
      return;
    }
    if (selectedProfessors.find((p) => p.id === professor.id)) {
      alert("This professor is already in your comparison");
      return;
    }
    setSelectedProfessors((prev) => [...prev, professor]);
  };

  const removeProfessorFromComparison = (professorId) => {
    setSelectedProfessors((prev) => prev.filter((p) => p.id !== professorId));
  };

  const clearComparison = () => {
    setSelectedProfessors([]);
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  const getRatingLabel = (rating) => {
    if (rating >= 4) return "Excellent";
    if (rating >= 3) return "Good";
    if (rating >= 2) return "Fair";
    return "Poor";
  };

  const departments = [
    "Computer Science",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Engineering",
    "Business",
    "Economics",
    "Psychology",
    "History",
    "English",
    "Philosophy",
    "Art",
    "Music",
    "Physical Education",
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-2xl">
              <Scale className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-800">
              Compare Professors
            </h1>
          </div>
          <p className="text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto">
            Side-by-side comparison of professors
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
            <Scale className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-800">
            Compare Professors
          </h1>
        </div>
        <p className="text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto">
          Side-by-side comparison of professors
        </p>
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
              placeholder="Search professors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="input"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setSearchQuery("");
              setDepartmentFilter("");
            }}
            className="btn-outline"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Selected Professors */}
      {selectedProfessors.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 flex items-center space-x-3">
              <BarChart3 className="h-7 w-7 text-green-600" />
              <span>Comparison ({selectedProfessors.length}/3)</span>
            </h2>
            <button onClick={clearComparison} className="btn-destructive">
              Clear All
            </button>
          </div>

          {/* Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedProfessors.map((professor) => (
              <div key={professor.id} className="card-elevated p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-800 flex-1 pr-4">
                    {professor.name}
                  </h3>
                  <button
                    onClick={() => removeProfessorFromComparison(professor.id)}
                    className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Department</span>
                    <span className="text-slate-800 font-medium">
                      {professor.department}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span
                        className={`font-medium ${getRatingColor(
                          professor.averageRating || 0
                        )}`}
                      >
                        {professor.averageRating?.toFixed(1) || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Reviews</span>
                    <span className="text-slate-800 font-medium">
                      {professor.reviewCount || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Courses</span>
                    <span className="text-slate-800 font-medium">
                      {professor.courses?.length || 0}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <Link
                    to={`/professors/${professor.id}`}
                    className="text-blue-600 font-medium hover:underline flex items-center space-x-2 text-sm"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          {selectedProfessors.length > 1 && (
            <div className="card-elevated p-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-6 text-center">
                Detailed Comparison
              </h3>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead className="table-header">
                    <tr>
                      <th className="table-head">Metric</th>
                      {selectedProfessors.map((prof) => (
                        <th key={prof.id} className="table-head text-center">
                          {prof.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr className="table-row">
                      <td className="table-cell text-slate-500">Department</td>
                      {selectedProfessors.map((prof) => (
                        <td
                          key={prof.id}
                          className="table-cell text-center text-slate-800"
                        >
                          {prof.department}
                        </td>
                      ))}
                    </tr>
                    <tr className="table-row">
                      <td className="table-cell text-slate-500">
                        Average Rating
                      </td>
                      {selectedProfessors.map((prof) => (
                        <td key={prof.id} className="table-cell text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span
                              className={`font-medium ${getRatingColor(
                                prof.averageRating || 0
                              )}`}
                            >
                              {prof.averageRating?.toFixed(1) || "N/A"}
                            </span>
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr className="table-row">
                      <td className="table-cell text-slate-500">
                        Review Count
                      </td>
                      {selectedProfessors.map((prof) => (
                        <td
                          key={prof.id}
                          className="table-cell text-center text-slate-800"
                        >
                          {prof.reviewCount || 0}
                        </td>
                      ))}
                    </tr>
                    <tr className="table-row">
                      <td className="table-cell text-slate-500">
                        Courses Taught
                      </td>
                      {selectedProfessors.map((prof) => (
                        <td
                          key={prof.id}
                          className="table-cell text-center text-slate-800"
                        >
                          {prof.courses?.length || 0}
                        </td>
                      ))}
                    </tr>
                    <tr className="table-row">
                      <td className="table-cell text-slate-500">
                        Rating Status
                      </td>
                      {selectedProfessors.map((prof) => (
                        <td key={prof.id} className="table-cell text-center">
                          {prof.averageRating >= 4 ? (
                            <div className="flex items-center justify-center space-x-1 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-sm">Excellent</span>
                            </div>
                          ) : prof.averageRating >= 3 ? (
                            <div className="flex items-center justify-center space-x-1 text-yellow-600">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-sm">Good</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center space-x-1 text-red-600">
                              <XCircle className="h-4 w-4" />
                              <span className="text-sm">Needs Improvement</span>
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Professor Selection */}
      <div className="space-y-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 flex items-center space-x-3">
          <Plus className="h-7 w-7 text-blue-600" />
          <span>Select Professors to Compare</span>
        </h2>

        {filteredProfessors.length === 0 ? (
          <div className="card-elevated p-12 text-center">
            <Search className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              No professors found
            </h3>
            <p className="text-slate-600 mb-6">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfessors.map((professor) => (
              <div key={professor.id} className="card-elevated p-6 group">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-all duration-200 flex-1 pr-4">
                    {professor.name}
                  </h3>
                  <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-2 rounded-xl border border-yellow-200">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <span className="text-sm font-bold text-slate-800">
                      {professor.averageRating?.toFixed(1) || "N/A"}
                    </span>
                  </div>
                </div>
                <p className="text-slate-600 mb-4 font-medium text-sm">
                  {professor.department}
                </p>
                <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                  <span className="flex items-center space-x-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{professor.courses?.length || 0} courses</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{professor.reviewCount || 0} reviews</span>
                  </span>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <button
                    onClick={() => addProfessorToComparison(professor)}
                    disabled={selectedProfessors.find(
                      (p) => p.id === professor.id
                    )}
                    className="w-full btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {selectedProfessors.find((p) => p.id === professor.id)
                      ? "Already Selected"
                      : "Add to Comparison"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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

export default Compare;
