import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Shield,
  Users,
  BookOpen,
  MessageSquare,
} from "lucide-react";

const AdminDashboard = () => {
  const [professors, setProfessors] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("professors");
  const [showAddProfessor, setShowAddProfessor] = useState(false);
  const [editingProfessor, setEditingProfessor] = useState(null);

  // Form states
  const [professorForm, setProfessorForm] = useState({
    name: "",
    department: "",
    courses: "",
    email: "",
  });

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
    "Sociology",
    "History",
    "English",
    "Philosophy",
    "Art",
    "Music",
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch professors
      const professorsRef = collection(db, "professors");
      const professorsQuery = query(professorsRef, orderBy("name"));
      const professorsSnapshot = await getDocs(professorsQuery);

      const professorsData = [];
      professorsSnapshot.forEach((doc) => {
        professorsData.push({ id: doc.id, ...doc.data() });
      });
      setProfessors(professorsData);

      // Fetch reviews
      const reviewsRef = collection(db, "reviews");
      const reviewsQuery = query(reviewsRef, orderBy("createdAt", "desc"));
      const reviewsSnapshot = await getDocs(reviewsQuery);

      const reviewsData = [];
      reviewsSnapshot.forEach((doc) => {
        reviewsData.push({ id: doc.id, ...doc.data() });
      });
      setReviews(reviewsData);

      // Fetch users
      const usersRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersRef);

      const usersData = [];
      usersSnapshot.forEach((doc) => {
        usersData.push({ id: doc.id, ...doc.data() });
      });
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProfessor = async (e) => {
    e.preventDefault();

    if (!professorForm.name || !professorForm.department) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const courses = professorForm.courses
        .split(",")
        .map((course) => course.trim())
        .filter((course) => course.length > 0);

      await addDoc(collection(db, "professors"), {
        name: professorForm.name.trim(),
        department: professorForm.department,
        courses,
        email: professorForm.email.trim() || "",
        averageRating: 0,
        reviewCount: 0,
        createdAt: new Date().toISOString(),
      });

      setProfessorForm({ name: "", department: "", courses: "", email: "" });
      setShowAddProfessor(false);
      fetchData();
    } catch (error) {
      console.error("Error adding professor:", error);
      alert("Failed to add professor");
    }
  };

  const handleEditProfessor = async (e) => {
    e.preventDefault();

    if (!professorForm.name || !professorForm.department) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const courses = professorForm.courses
        .split(",")
        .map((course) => course.trim())
        .filter((course) => course.length > 0);

      await updateDoc(doc(db, "professors", editingProfessor.id), {
        name: professorForm.name.trim(),
        department: professorForm.department,
        courses,
        email: professorForm.email.trim() || "",
      });

      setProfessorForm({ name: "", department: "", courses: "", email: "" });
      setEditingProfessor(null);
      fetchData();
    } catch (error) {
      console.error("Error updating professor:", error);
      alert("Failed to update professor");
    }
  };

  const handleDeleteProfessor = async (professorId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this professor? This will also delete all associated reviews."
      )
    ) {
      try {
        // Delete professor
        await deleteDoc(doc(db, "professors", professorId));

        // Delete associated reviews
        const reviewsToDelete = reviews.filter(
          (review) => review.professorId === professorId
        );
        for (const review of reviewsToDelete) {
          await deleteDoc(doc(db, "reviews", review.id));
        }

        fetchData();
      } catch (error) {
        console.error("Error deleting professor:", error);
        alert("Failed to delete professor");
      }
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteDoc(doc(db, "reviews", reviewId));
        fetchData();
      } catch (error) {
        console.error("Error deleting review:", error);
        alert("Failed to delete review");
      }
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, "users", userId), { role: newRole });
      fetchData();
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("Failed to update user role");
    }
  };

  const openEditForm = (professor) => {
    setEditingProfessor(professor);
    setProfessorForm({
      name: professor.name,
      department: professor.department,
      courses: professor.courses?.join(", ") || "",
      email: professor.email || "",
    });
  };

  const closeForms = () => {
    setShowAddProfessor(false);
    setEditingProfessor(null);
    setProfessorForm({ name: "", department: "", courses: "", email: "" });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="card-elevated rounded-xl p-8 animate-pulse">
          <div className="h-8 bg-slate-200 rounded mb-4"></div>
          <div className="h-4 bg-slate-200 rounded mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="card-elevated rounded-xl p-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-red-100 rounded-xl shadow-lg">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-slate-600 text-lg">
              Manage professors, monitor reviews, and oversee user accounts
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-elevated rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {professors.length}
            </div>
          </div>
          <div className="text-sm text-slate-500 font-medium">
            Total Professors
          </div>
        </div>
        <div className="card-elevated rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <MessageSquare className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600">
              {reviews.length}
            </div>
          </div>
          <div className="text-sm text-slate-500 font-medium">
            Total Reviews
          </div>
        </div>
        <div className="card-elevated rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-600">
              {users.length}
            </div>
          </div>
          <div className="text-sm text-slate-500 font-medium">Total Users</div>
        </div>
        <div className="card-elevated rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Shield className="h-5 w-5 text-red-600" />
            </div>
            <div className="text-3xl font-bold text-red-600">
              {users.filter((user) => user.role === "admin").length}
            </div>
          </div>
          <div className="text-sm text-slate-500 font-medium">Admin Users</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card-elevated rounded-xl shadow-lg">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-8">
            <button
              onClick={() => setActiveTab("professors")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === "professors"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              Professors ({professors.length})
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === "reviews"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              Reviews ({reviews.length})
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === "users"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              Users ({users.length})
            </button>
          </nav>
        </div>

        <div className="p-8">
          {/* Professors Tab */}
          {activeTab === "professors" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">
                  Manage Professors
                </h2>
                <button
                  onClick={() => setShowAddProfessor(true)}
                  className="btn-primary px-6 py-3 flex items-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Professor</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="table">
                  <thead className="table-header">
                    <tr>
                      <th className="table-head">Name</th>
                      <th className="table-head">Department</th>
                      <th className="table-head">Courses</th>
                      <th className="table-head">Rating</th>
                      <th className="table-head">Reviews</th>
                      <th className="table-head">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {professors.map((professor) => (
                      <tr key={professor.id} className="table-row">
                        <td className="table-cell text-sm font-medium text-slate-800">
                          {professor.name}
                        </td>
                        <td className="table-cell text-sm text-slate-600">
                          {professor.department}
                        </td>
                        <td className="table-cell text-sm text-slate-600">
                          {professor.courses?.length || 0} courses
                        </td>
                        <td className="table-cell text-sm text-slate-600">
                          {professor.averageRating?.toFixed(1) || "N/A"}
                        </td>
                        <td className="table-cell text-sm text-slate-600">
                          {professor.reviewCount || 0}
                        </td>
                        <td className="table-cell text-sm font-medium space-x-3">
                          <button
                            onClick={() => openEditForm(professor)}
                            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            title="Edit Professor"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProfessor(professor.id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                            title="Delete Professor"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">
                Monitor Reviews
              </h2>

              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="card-elevated rounded-xl p-6 border border-slate-200 hover:border-slate-300 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h4 className="font-semibold text-slate-800">
                            {review.userName}
                          </h4>
                          <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm mb-3">
                          Course:{" "}
                          <span className="text-blue-600 font-medium">
                            {review.course}
                          </span>
                        </p>
                        {review.comment && (
                          <p className="text-slate-500 text-sm bg-slate-50 p-3 rounded-lg border border-slate-200">
                            {review.comment}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 ml-4"
                        title="Delete Review"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">
                Manage Users
              </h2>

              <div className="overflow-x-auto">
                <table className="table">
                  <thead className="table-header">
                    <tr>
                      <th className="table-head">Name</th>
                      <th className="table-head">Email</th>
                      <th className="table-head">Role</th>
                      <th className="table-head">Joined</th>
                      <th className="table-head">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {users.map((user) => (
                      <tr key={user.id} className="table-row">
                        <td className="table-cell text-sm font-medium text-slate-800">
                          {user.displayName || "Anonymous"}
                        </td>
                        <td className="table-cell text-sm text-slate-600">
                          {user.email}
                        </td>
                        <td className="table-cell text-sm text-slate-600">
                          <select
                            value={user.role || "student"}
                            onChange={(e) =>
                              handleUpdateUserRole(user.id, e.target.value)
                            }
                            className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          >
                            <option value="student">Student</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="table-cell text-sm text-slate-600">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="table-cell text-sm text-slate-600">
                          {user.role === "admin" ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                              Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                              Student
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Professor Modal */}
      {(showAddProfessor || editingProfessor) && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="card-elevated rounded-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                {editingProfessor ? "Edit Professor" : "Add New Professor"}
              </h2>

              <form
                onSubmit={
                  editingProfessor ? handleEditProfessor : handleAddProfessor
                }
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={professorForm.name}
                    onChange={(e) =>
                      setProfessorForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Department *
                  </label>
                  <select
                    value={professorForm.department}
                    onChange={(e) =>
                      setProfessorForm((prev) => ({
                        ...prev,
                        department: e.target.value,
                      }))
                    }
                    className="input w-full"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Courses (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={professorForm.courses}
                    onChange={(e) =>
                      setProfessorForm((prev) => ({
                        ...prev,
                        courses: e.target.value,
                      }))
                    }
                    placeholder="e.g., CS 101, CS 201, CS 301"
                    className="input w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={professorForm.email}
                    onChange={(e) =>
                      setProfessorForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="input w-full"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeForms}
                    className="btn-outline flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    {editingProfessor ? "Update" : "Add"} Professor
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
