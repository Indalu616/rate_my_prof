import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  Filter,
  Star,
  Users,
  TrendingUp,
  Award,
  Plus,
  Sparkles,
  BookOpen,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../contexts/AuthContext";
import AddProfessorForm from "../components/AddProfessorForm";

const ProfessorList = () => {
  const [professors, setProfessors] = useState([]);
  const [filteredProfessors, setFilteredProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [showAddProfessor, setShowAddProfessor] = useState(false);
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "professors"));
        const professorsData = [];
        querySnapshot.forEach((doc) => {
          professorsData.push({ id: doc.id, ...doc.data() });
        });
        setProfessors(professorsData);
        setFilteredProfessors(professorsData);
      } catch (error) {
        console.error("Error fetching professors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessors();
  }, []);

  // Handle search query from URL parameters
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  useEffect(() => {
    let filtered = [...professors];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (professor) =>
          professor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          professor.department
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          professor.courses?.some((course) =>
            course.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Apply department filter
    if (departmentFilter) {
      filtered = filtered.filter(
        (professor) => professor.department === departmentFilter
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "rating":
          return (b.averageRating || 0) - (a.averageRating || 0);
        case "reviews":
          return (b.reviewCount || 0) - (a.reviewCount || 0);
        case "department":
          return a.department.localeCompare(b.department);
        default:
          return 0;
      }
    });

    setFilteredProfessors(filtered);
  }, [professors, searchQuery, departmentFilter, sortBy]);

  const handleAddProfessorSuccess = () => {
    setShowAddProfessor(false);
    // Refresh the list
    window.location.reload();
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
        {/* Loading Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-2xl">
              <Award className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-800">
              Our Professors
            </h1>
          </div>
          <p className="text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto">
            Discover and rate professors from various departments
          </p>
        </div>

        {/* Loading Stats */}
        <div className="flex flex-col lg:flex-row justify-center gap-6 max-w-4xl mx-auto">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="card-elevated p-6 animate-pulse">
              <div className="h-8 bg-slate-200 rounded mb-3"></div>
              <div className="h-6 bg-slate-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>

        {/* Loading Cards */}
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
            <Award className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-800">
            Our Professors
          </h1>
        </div>
        <p className="text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto">
          Discover and rate professors from various departments
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
        <div className="card-elevated p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {professors.length}
          </div>
          <div className="text-slate-600 text-sm font-medium">
            Total Professors
          </div>
        </div>
        <div className="card-elevated p-4 text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {professors.filter((p) => (p.averageRating || 0) >= 4).length}
          </div>
          <div className="text-slate-600 text-sm font-medium">Highly Rated</div>
        </div>
        <div className="card-elevated p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600 mb-1">
            {professors.reduce((sum, p) => sum + (p.reviewCount || 0), 0)}
          </div>
          <div className="text-slate-600 text-sm font-medium">
            Total Reviews
          </div>
        </div>
        <div className="card-elevated p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {new Set(professors.map((p) => p.department)).size}
          </div>
          <div className="text-slate-600 text-sm font-medium">Departments</div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {currentUser && (
            <button
              onClick={() => setShowAddProfessor(true)}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Professor</span>
            </button>
          )}
        </div>

        <button
          onClick={() => {
            setSearchQuery("");
            setDepartmentFilter("");
            setSortBy("name");
          }}
          className="btn-outline"
        >
          Clear Filters
        </button>
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
          {/* Search */}
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

          {/* Department Filter */}
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

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input"
          >
            <option value="name">Sort by Name</option>
            <option value="rating">Sort by Rating</option>
            <option value="reviews">Sort by Reviews</option>
            <option value="department">Sort by Department</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 font-medium">
          <Users className="h-4 w-4" />
          <span>
            Showing {filteredProfessors.length} of {professors.length}{" "}
            professors
          </span>
        </div>
      </div>

      {/* Professors Grid */}
      {filteredProfessors.length === 0 ? (
        <div className="text-center py-16">
          <div className="p-4 bg-slate-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <Search className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            No professors found
          </h3>
          <p className="text-slate-600 mb-6">
            Try adjusting your search criteria or filters
          </p>
          {currentUser && (
            <button
              onClick={() => setShowAddProfessor(true)}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add the First Professor</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProfessors.map((professor) => (
            <Link
              key={professor.id}
              to={`/professors/${professor.id}`}
              className="card-elevated p-6 lg:p-8 group"
            >
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h3 className="text-lg lg:text-xl font-semibold text-slate-800 group-hover:text-blue-600 transition-all duration-200 flex-1 pr-4">
                  {professor.name}
                </h3>
                <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-2 rounded-xl border border-yellow-200">
                  <Star className="h-5 w-5 lg:h-6 lg:w-6 text-yellow-500 fill-current" />
                  <span className="text-lg lg:text-xl font-bold text-slate-800">
                    {professor.averageRating?.toFixed(1) || "N/A"}
                  </span>
                </div>
              </div>
              <p className="text-slate-600 mb-4 font-medium text-sm lg:text-base">
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
                <span className="text-blue-600 font-medium group-hover:underline flex items-center space-x-2 text-sm lg:text-base">
                  <span>View Profile</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-all duration-200" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Add Professor Modal */}
      {showAddProfessor && (
        <AddProfessorForm
          isOpen={showAddProfessor}
          onClose={() => setShowAddProfessor(false)}
          onSuccess={handleAddProfessorSuccess}
        />
      )}
    </div>
  );
};

export default ProfessorList;
